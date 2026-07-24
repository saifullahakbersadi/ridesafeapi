import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TravelTimeService {
  private readonly logger = new Logger(TravelTimeService.name);

  constructor(private readonly httpService: HttpService) {}

  private readonly getMapBoxToken = process.env.MAPBOX_ACCESS_TOKEN;

  async getTravelTime(
    pickupLng: number,
    pickupLat: number,
    destinationLng: number,
    destinationLat: number,
  ) {
    const url =
      `https://api.mapbox.com/directions/v5/mapbox/driving/` +
      `${pickupLng},${pickupLat};${destinationLng},${destinationLat}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            access_token: this.getMapBoxToken,
            overview: false,
          },
        }),
      );

      const route = response.data.routes[0];

      return {
        distanceMeters: route.distance,
        distanceKm: Number((route.distance / 1000).toFixed(2)),
        durationSeconds: route.duration,
        durationMinutes: Math.ceil(route.duration / 60),
      };
    } catch (error) {
      const details = (error as any)?.response?.data ?? (error as Error).message;
      this.logger.error(`Mapbox directions request failed: ${JSON.stringify(details)}`);
      throw new InternalServerErrorException('Unable to calculate travel time');
    }
  }
}
