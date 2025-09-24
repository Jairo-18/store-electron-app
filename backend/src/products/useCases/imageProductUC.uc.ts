// import { Injectable } from '@nestjs/common';
// import { ImageProductService } from '../services/imageProduct.service';
// import { ImageProduct } from '../../shared/entities/imageProduct.entity';
// import { ImageResponseDto } from '../dtos/imageProduct.dto';

// @Injectable()
// export class ImageProducUC {
//   constructor(private readonly imageService: ImageProductService) {}

//   create(id: number, file: Express.Multer.File): Promise<ImageResponseDto> {
//     return this.imageService.create(id, file);
//   }

//   findById(id: number): Promise<ImageProduct> {
//     return this.imageService.findById(id);
//   }

//   findByProduct(id: number): Promise<ImageProduct[]> {
//     return this.imageService.findByProduct(id);
//   }

//   update(id: number, file: Express.Multer.File): Promise<ImageResponseDto> {
//     return this.imageService.update(id, file);
//   }

//   remove(id: number): Promise<void> {
//     return this.imageService.remove(id);
//   }
// }
