import { CrudProductUC } from './useCases/crudProductUC.uc';
import { ProductUC } from './useCases/productUC.uc';
import { ProductController } from './controllers/product.controller';
import { Module } from '@nestjs/common';
import { SharedModule } from './../shared/shared.module';
import { ProductService } from './services/crudProduct.service';
import { CrudProductService } from './services/product.service';

@Module({
  imports: [SharedModule.forRoot()],
  controllers: [ProductController],
  providers: [ProductUC, CrudProductUC, ProductService, CrudProductService],
})
export class ProductModule {}
