import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TravelTimeModule } from 'src/traveltime/traveltime.module';
import { DriverModule } from 'src/driver/driver.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [TravelTimeModule, DriverModule, EmailModule],
  controllers: [BookingController],
  providers: [BookingService]
})
export class BookingModule {}
