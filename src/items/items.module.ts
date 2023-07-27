import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from './schemas/item.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: 'Item',
        schema: ItemSchema
      }
    ])
  ],
  controllers: [ItemsController],
  providers: [ItemsService]
})
export class ItemsModule {}
