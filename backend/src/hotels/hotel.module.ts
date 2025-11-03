import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from '../shared/shared.module';
import { HotelController } from './controllers/hotel.controller';
import { HotelService } from './services/hotel.service';
import { HotelUseCase } from './useCases/hotel.usecase';

@Module({
  imports: [
    SharedModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [HotelController],
  providers: [HotelUseCase, HotelService],
  exports: [HotelService],
})
export class HotelModule {}
