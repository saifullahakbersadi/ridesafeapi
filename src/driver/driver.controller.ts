import { Body, Controller, Get, Post } from '@nestjs/common';
import { DriverService } from './driver.service';
import { RegisterDriverDto } from './dto/register-driver.dto';

@Controller('driver')
export class DriverController {
    constructor(private driverService: DriverService){}

    @Post('register')
    registerDriver(
        @Body() registerDriverDto: RegisterDriverDto
    ){
        return this.driverService.registerDriver(registerDriverDto)
    }

    @Get('all')
    getAllDrivers(){
        return this.driverService.getAllDriver();
    }
}
