import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [DatabaseModule, CategoriesModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
