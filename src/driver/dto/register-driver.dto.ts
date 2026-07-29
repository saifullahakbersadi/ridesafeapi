import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDriverDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsString()
    licenseNo: string;

    @IsString()
    postcode: string;

    @IsNumber()
    driverAddressLat: number;

    @IsNumber()
    driverAddressLng: number;

    @IsOptional()
    @IsString()
    companyId?: string;

    @IsOptional()
    @IsString()
    vehicleId?: string;
}
