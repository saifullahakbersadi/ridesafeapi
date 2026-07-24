import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TravelTimeModule } from 'src/traveltime/traveltime.module';

@Module({
  imports: [TravelTimeModule],
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule {}
