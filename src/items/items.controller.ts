import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';
import { User } from '../auth/interfaces/user.interface';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(
    @Body() createItemDto: CreateItemDto,
    @GetUser() user:User
    ) {
    return this.itemsService.create(createItemDto,user);
  }

  // Primero debes treaer toda la data
  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get('filter')
  filterItems(@Query('query') query:string){
    return this.itemsService.filterItems(query)
  }

  @Get('refresh')
  refreshItems(){
    return this.itemsService.updateData()
  }
  
  // Al ultimo los ID's
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }
  

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto, @GetUser() user:User) {
    return this.itemsService.update(+id, updateItemDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
