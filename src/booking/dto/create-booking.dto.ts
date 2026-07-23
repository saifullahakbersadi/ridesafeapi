import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateBookingDto {
    @IsUUID()
    userId: string;

    @IsString()
    @IsNotEmpty()
    pickup: string;

    @IsString()
    @IsNotEmpty()
    destination: string;

    @IsDateString()
    pickupTime: string;

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
