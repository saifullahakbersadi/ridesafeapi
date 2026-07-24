import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateBookingDto {
    @IsUUID()
    userId: string;

    @IsString()
    @IsNotEmpty()
    pickup: string;

    @IsNumber()
    pickupLat: number;

    @IsNumber()
    pickupLng: number;

    @IsString()
    @IsNotEmpty()
    destination: string;

    @IsNumber()
    destinationLat: number;

    @IsNumber()
    destinationLng: number;

    @IsDateString()
    pickupTime: string;

    @IsNumber()
    estimatedTravelTime: number;

    @IsNumber()
    distance: number;

    @IsOptional()
    @IsUUID()
    driverId?: string;

    @IsOptional()
    @IsString()
    vehicleId?: string;

    @IsOptional()
    @IsString()
    paymentId?: string;
}
