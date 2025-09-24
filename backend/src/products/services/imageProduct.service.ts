// import { Injectable, NotFoundException } from '@nestjs/common';
// import { ImageProduct } from '../../shared/entities/imageProduct.entity';
// import { ImageRepository } from '../../shared/repositories/image.repository';
// import { ProductRepository } from '../../shared/repositories/product.repository';
// import { ImageResponseDto } from '../dtos/imageProduct.dto';

// @Injectable()
// export class ImageProductService {
//   constructor(
//     private readonly _imageRepository: ImageRepository,
//     private readonly _productRepository: ProductRepository,
//   ) {}

//   async create(
//     id: number,
//     file: Express.Multer.File,
//   ): Promise<ImageResponseDto> {
//     const product = await this._productRepository.findOne({ where: { id } });
//     if (!product) throw new NotFoundException('Producto no encontrado');

//     const image = this._imageRepository.create({
//       filePath: file.path,
//       originalName: file.originalname,
//       product,
//     });

//     const saved = await this._imageRepository.save(image);

//     return {
//       id: saved.id,
//       url: `${process.env.APP_URL || 'http://localhost:3000'}/uploads/products/${file.filename}`,
//       originalName: saved.originalName,
//       productId: product.id,
//       createdAt: saved.createdAt,
//       updatedAt: saved.updatedAt,
//     };
//   }

//   async findById(
//     id: number,
//     includeProduct: boolean = true,
//   ): Promise<ImageProduct> {
//     const image = await this._imageRepository.findOne({
//       where: { id },
//       relations: includeProduct ? ['product'] : [],
//     });
//     if (!image) throw new NotFoundException('Imagen no encontrada');
//     return image;
//   }

//   async findByProduct(id: number): Promise<ImageProduct[]> {
//     return this._imageRepository.find({
//       where: { product: { id: id } },
//     });
//   }

//   async update(
//     id: number,
//     file: Express.Multer.File,
//   ): Promise<ImageResponseDto> {
//     const image = await this.findById(id);

//     image.filePath = file.path;
//     image.originalName = file.originalname;

//     const saved = await this._imageRepository.save(image);

//     return {
//       id: saved.id,
//       url: `${process.env.APP_URL || 'http://localhost:3000'}/uploads/products/${file.filename}`,
//       originalName: saved.originalName,
//       productId: saved.product.id,
//       createdAt: saved.createdAt,
//       updatedAt: saved.updatedAt,
//     };
//   }

//   async remove(id: number): Promise<void> {
//     const image = await this.findById(id);
//     await this._imageRepository.remove(image);
//   }
// }
