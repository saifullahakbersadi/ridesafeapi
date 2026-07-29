import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { TravelTimeService } from 'src/traveltime/traveltime.service';
import { JwtPayload } from 'src/auth/auth.types';
import { RegisterDriverDto } from './dto/register-driver.dto';

const MAX_DISPATCH_DISTANCE_KM = 10;
const SALT_ROUNDS = 10;

interface FindNearestDriverParams {
  customerLat: number;
  customerLng: number;
}

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly travelTimeService: TravelTimeService,
    private readonly jwtService: JwtService,
  ) {}

  async registerDriver(dto: RegisterDriverDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const { user, driver } = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          password: hashedPassword,
          phone: dto.phone,
          role: 'DRIVER',
        },
      });
      const driver = await tx.driver.create({
        data: {
          userId: user.id,
          licenseNo: dto.licenseNo,
          postcode: dto.postcode,
          driverAddressLat: dto.driverAddressLat,
          driverAddressLng: dto.driverAddressLng,
          companyId: dto.companyId,
          vehicleId: dto.vehicleId,
        },
      });
      return { user, driver };
    });

    this.logger.log(`New driver registered: ${user.id}`);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      },
      driver,
    };
  }

  async findDriver(pickup: FindNearestDriverParams, postcode: string) {
    // Find all available drivers that match postcode and have a known location
    const drivers = await this.prisma.driver.findMany({
      where: {
        postcode: postcode,
        status: 'ACTIVE',
        driverAddressLat: { not: null },
        driverAddressLng: { not: null },
      },
    });

    // Check each candidate driver's own distance to the pickup location,
    // keep the ones within range, and pick the nearest
    const candidates = await Promise.all(
      drivers.map(async (driver) => {
        try {
          const travelTime = await this.travelTimeService.getTravelTime(
            driver.driverAddressLng as number,
            driver.driverAddressLat as number,
            pickup.customerLng,
            pickup.customerLat,
          );
          return { driver, travelTime };
        } catch (error) {
          this.logger.warn(
            `Unable to get travel time for driver ${driver.id}: ${(error as Error).message}`,
          );
          return null;
        }
      }),
    );

    const nearestDriver = candidates
      .filter(
        (candidate): candidate is NonNullable<typeof candidate> =>
          candidate !== null,
      )
      .filter(
        (candidate) =>
          candidate.travelTime.distanceKm < MAX_DISPATCH_DISTANCE_KM,
      )
      .sort((a, b) => a.travelTime.distanceKm - b.travelTime.distanceKm)[0];

    if (!nearestDriver) {
      return null;
    }

    return {
      driver: nearestDriver.driver,
      distanceKm: nearestDriver.travelTime.distanceKm,
      durationMinutes: nearestDriver.travelTime.durationMinutes,
    };
  }
  
  //Get all driver
  getAllDriver(){
    return this.prisma.driver.findMany();
  }
}
