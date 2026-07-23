import { IsDateString, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateUserBookingDto{
    @IsUUID()
    userId: string;

    @IsUUID()
    bookingId: string;

    @IsOptional()
    @IsString()
    pickup?: string;

    @IsOptional()
    @IsString()
    destination?: string;

    @IsOptional()
    @IsDateString()
    pickupTime?: string;
}
