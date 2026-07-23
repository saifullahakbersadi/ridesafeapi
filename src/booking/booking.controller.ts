import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateUserBookingDto } from './dto/update-user-booking.dto';
import { DeleteUserBookingDto } from './dto/delete-user-booking.dto';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
    constructor(private bookingService: BookingService){}
    // POST create booking
    @Post()
    createBooking(
        @Body() createBookingDto: CreateBookingDto
    ){
        return this.bookingService.createBooking(createBookingDto)
    }
    // GET booking by User ID
    @Get('user/:userId')
    getBookingsByUserId(
        @Param('userId') userId: string
    ){
        return this.bookingService.getBookingsByUserId(userId)
    }
    // POST update booking
    @Post('update')
    updateUserBooking(
        @Body() updateUserBookingDto: UpdateUserBookingDto
    ){
        return this.bookingService.updateUserBooking(updateUserBookingDto)
    }
    // DELETE booking
    @Delete(':bookingId')
    deleteBooking(
        @Param('bookingId') bookingId: string,
        @Body() deleteUserBookingDto: DeleteUserBookingDto
    ){
        return this.bookingService.deleteBooking(bookingId, deleteUserBookingDto)
    }
}
