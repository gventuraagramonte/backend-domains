import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sslCertificate from 'get-ssl-certificate'
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './interfaces/item.interface';

@Injectable()
export class ItemsService {

  constructor(
    @InjectModel('Item') private readonly itemModel: Model<Item>
  ){}

  async create(createItemDto: CreateItemDto) {
    const {nombreItem} = createItemDto
    const plainItem = nombreItem.toLocaleLowerCase()
    
    try {
      const data = await this.obtainMetadataCertificates(plainItem)
      const item = await this.itemModel.create({
        nombreItem: plainItem,
        fechaItem: data.validTo,
        diasItem: data.days,
        issuer: data.issuer,
        statusItem: data.active
      })
      
      return item;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  // Trae todos los certificados que han sido ingresados exitosamente
  async findAll() {
    return await this.itemModel.find();
  }

  // Filtra certificados por nombre 3 primero digitos
  filterItems(filter:string){
    const regex = new RegExp(filter,'i')
    return this.itemModel.find({nombreItem: regex}).exec()
  }

  // Filtra certificados por id
  async findOne(id: string) {
    const oneItem = await this.itemModel.findById(id)
    if(!oneItem) throw new NotFoundException(`Item with ${id} not found`)
    return oneItem
  }

  // Actualiza certificados
  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  // actualiza certificados de manera interna
  async internUpdate(idItem:string, updateItemDto: UpdateItemDto) {
    const updateItem = await this.itemModel.findByIdAndUpdate(idItem,updateItemDto,{new: true})
        return updateItem
  }

  // Actualizara la data si hay algun cambio
  async updateData(){
    // Puedo recibir todos los datos
    const items = await this.findAll()
    
    // Evaluar si trae data o no
    items.map(async (item)=>{
      const {id,nombreItem,issuer, diasItem, fechaItem, statusItem} = item
      // voy a traer la nueva data
      try {
        const newData = await this.obtainMetadataCertificates(nombreItem)
        console.log("Validando informacion en el try")
        // Valido que no haya cambios
        if(
            newData.active !== statusItem || 
            (newData.days+"") !== diasItem || 
            newData.validTo !== fechaItem || 
            newData.issuer !== issuer
          ){  
            // Aqui llamaremos al actualizador
            await this.internUpdate(id, {
              nombreItem,
              diasItem: (newData.days+""),
              fechaItem: newData.validTo,
              issuer: newData.issuer,
              statusItem: true
            })
          }
      } catch (error) {
        if(error.errno === -3008){
          console.log("entro en el catch")
          await this.internUpdate(id,{
            nombreItem,
            statusItem: false
          })
        }
        console.error(error)
      }
      
    })
    
    // Retorna confirmacion
    return "Actualizacion exitosa"
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }

  private handleExceptions(error: any) {
    console.error(error)
    if(error.errno === -3008) {
           throw new BadRequestException('Certificado sin data')
        }
    throw new InternalServerErrorException('Cannot create Item - Check server logs')
  }

  async obtainMetadataCertificates(url:string) {
    
      // Traigo informacion de los certificados
      const certificateData = await sslCertificate.get(url)
      const dias = this.daysDiff(certificateData.valid_to)
      const jsonData = {
        validFrom: certificateData.valid_from,
        validTo: certificateData.valid_to,
        issuer: certificateData.issuer.CN,
        days: dias,
        active: true
      }

      return jsonData

  }

  private daysDiff(valid_to:string) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    let today = new Date() // Dia de creacion
    let toValid = new Date(valid_to) // Convertimos el dia de vencimiento

    const utc1 = Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())
    const utc2 = Date.UTC(toValid.getFullYear(),toValid.getMonth(),toValid.getDate())

    return Math.floor((utc2-utc1)/_MS_PER_DAY)
  }
}
