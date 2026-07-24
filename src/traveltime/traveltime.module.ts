// mapbox.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TravelTimeService } from './traveltime.service';

@Module({
  imports: [HttpModule],
  providers: [TravelTimeService],
  exports: [TravelTimeService], // Allow other modules to use it
})
export class TravelTimeModule {}