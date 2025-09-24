// import {
//   Controller,
//   Post,
//   Param,
//   UploadedFile,
//   UseInterceptors,
//   Get,
//   Patch,
//   Delete,
//   HttpStatus,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { ImageProducUC } from '../useCases/imageProductUC.uc';
// import { ApiTags, ApiConsumes, ApiBody, ApiOkResponse } from '@nestjs/swagger';
// import {
//   GetImageByIdDto,
//   GetImageDto,
//   UpdateImageDto,
//   UploadImageDto,
// } from '../dtos/imageProduct.dto';
// import { slugify } from 'transliteration';
// import { extname } from 'path';
// import {
//   CreatedRecordResponseDto,
//   DeleteReCordResponseDto,
//   UpdateRecordResponseDto,
// } from 'src/shared/dtos/response.dto';

// @ApiTags('Imagenes de productos')
// @Controller('image-products')
// export class ImageProductController {
//   constructor(private readonly _imageProductUC: ImageProducUC) {}

//   @Post(':id')
//   @ApiOkResponse({ type: CreatedRecordResponseDto })
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: './uploads/products',
//         filename: (req, file, cb) => {
//           const name = slugify(file.originalname.replace(/\.[^/.]+$/, ''));
//           const uniqueSuffix =
//             Date.now() + '-' + Math.round(Math.random() * 1e9);
//           cb(null, `${name}-${uniqueSuffix}${extname(file.originalname)}`);
//         },
//       }),
//     }),
//   )
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({ type: UploadImageDto })
//   async uploadImage(
//     @Param('id') id: number,
//     @UploadedFile() file: Express.Multer.File,
//   ) {
//     const rowId = await this._imageProductUC.create(id, file);
//     return {
//       title: 'Imagen de producto creada',
//       message: 'Imagen guardada correctamente',
//       statusCode: HttpStatus.CREATED,
//       data: rowId,
//     };
//   }

//   @Get(':id')
//   @ApiOkResponse({ type: GetImageDto })
//   async getImage(@Param('id') id: number) {
//     return this._imageProductUC.findById(id);
//   }

//   @Get('/product/:id')
//   @ApiOkResponse({ type: GetImageByIdDto })
//   async getImagesByProduct(@Param('id') id: number) {
//     const images = await this._imageProductUC.findByProduct(id);
//     return {
//       statusCode: HttpStatus.OK,
//       images,
//     };
//   }

//   @Patch(':id')
//   @ApiOkResponse({ type: UpdateRecordResponseDto })
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: './uploads/products',
//         filename: (req, file, cb) => {
//           const name = slugify(file.originalname.replace(/\.[^/.]+$/, ''));
//           const uniqueSuffix =
//             Date.now() + '-' + Math.round(Math.random() * 1e9);
//           cb(null, `${name}-${uniqueSuffix}${extname(file.originalname)}`);
//         },
//       }),
//     }),
//   )
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({ type: UpdateImageDto })
//   async updateImage(
//     @Param('id') id: number,
//     @UploadedFile() file: Express.Multer.File,
//   ) {
//     await this._imageProductUC.update(id, file);
//     return {
//       title: 'Imagen de producto actualizada',
//       message: 'Imagen actualizada correctamente',
//       statusCode: HttpStatus.OK,
//     };
//   }

//   @Delete(':id')
//   @ApiOkResponse({ type: DeleteReCordResponseDto })
//   async deleteImage(@Param('id') id: number) {
//     await this._imageProductUC.remove(id);
//     return {
//       title: 'Eliminar imagen de producto',
//       statusCode: HttpStatus.OK,
//       message: 'Imagen eliminada correctamente',
//     };
//   }
// }
