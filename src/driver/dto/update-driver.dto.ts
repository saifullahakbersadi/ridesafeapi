import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateDriverDto{
    @IsString()
        @IsOptional()
        firstName: string;

        @IsOptional()
        @IsString()
        lastName: string;
    
        @IsOptional()
        @IsString()
        phone?: string;

        @IsOptional()
        @IsString()
        licenseNo: string;

        @IsOptional()
        @IsString()
        postcode: string;
    
        @IsOptional()
        @IsNumber()
        driverAddressLat: number;
    
        @IsOptional()
        @IsNumber()
        driverAddressLng: number;
    
        @IsOptional()
        @IsString()
        companyId?: string;
    
        @IsOptional()
        @IsString()
        vehicleId?: string;
}