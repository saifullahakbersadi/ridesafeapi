import { Body, Controller, Get, Param, Post, Patch, Query } from '@nestjs/common';
import { DriverService } from './driver.service';
import { RegisterDriverDto } from './dto/register-driver.dto'
import { UpdateDriverDto } from './dto/update-driver.dto';

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

    @Patch(':id/verified')
    driverVerified(
        @Param('id') id:string
    ){
        return this.driverService.driverVerified(id)
    }

    @Patch('update/:id')
    updateDriver(
        @Param('id') id:string,
        @Body() updateDriverDto: UpdateDriverDto
    ){
        return this.driverService.updateDriver(id, updateDriverDto)
    }

    @Patch(':driverId/booking/:bookingId')
    driverAcceptBooking(
        @Param('driverId') driverId: string,
        @Param('bookingId') bookingId: string,
        @Query('token') token: string
    ){
        return this.driverService.driverAcceptBooing(driverId, bookingId, token)
    }
}
