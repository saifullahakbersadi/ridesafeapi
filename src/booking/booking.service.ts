import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateUserBookingDto } from './dto/update-user-booking.dto';
import { DeleteUserBookingDto } from './dto/delete-user-booking.dto';

@Injectable()
export class BookingService {

    private readonly logger  = new Logger(BookingService.name);
    constructor(private prisma:PrismaService){}

    //Get bookings by userID
   async getBookingsByUserId(userId: string){
        try{
            const userBookings = await this.prisma.booking.findMany({
                where:{
                    userId: userId
                }
            })
            if (!userBookings){
                throw new NotFoundException('User do not have any booking right now.')
            }
            return userBookings;
        }catch(error){
            this.logger.error('Unable to find, please check log')
            throw new InternalServerErrorException(
                'Unable to find booking'
            );
        }
    }

    //Create booking
    async createBooking(createBookingDto: CreateBookingDto){
        try{
            const booking = await this.prisma.booking.create({ data: createBookingDto });
            this.logger.log(`New booking created by ${booking.userId}`)
            return booking;
        }catch(error){
            this.logger.error('Booking creation failed')
            throw new InternalServerErrorException(
                'Unable to create booking'
            );
        }
        
    }
    //Update booking
    async updateUserBooking(updateUserBooking: UpdateUserBookingDto){
        try{
            const { bookingId, userId, ...updateData } = updateUserBooking;

            const booking = await this.prisma.booking.findUnique({
                where:{
                    id: bookingId
                }
            })

            if (!booking){
                throw new NotFoundException('Booking not found')
            }

            if (booking.userId !== userId){
                throw new ForbiddenException('You do not have permission to update this booking')
            }

            const updatedBooking = await this.prisma.booking.update({
                where:{
                    id: bookingId
                },
                data: updateData
            })

            this.logger.log(`Booking ${bookingId} updated`)
            return updatedBooking;
        }catch(error){
            if (error instanceof NotFoundException || error instanceof ForbiddenException){
                throw error;
            }
            this.logger.error('Booking update failed', (error as Error).stack)
            throw new InternalServerErrorException(
                'Unable to update booking'
            );
        }
    }
    //Delete booking
    async deleteBooking(bookingId: string, deleteUserBooking: DeleteUserBookingDto){
        try{
            const booking = await this.prisma.booking.findUnique({
                where:{
                    id: bookingId
                }
            })

            if (!booking){
                throw new NotFoundException('Booking not found')
            }

            if (booking.userId !== deleteUserBooking.userId){
                throw new ForbiddenException('You do not have permission to delete this booking')
            }

            await this.prisma.booking.delete({
                where:{
                    id: bookingId
                }
            })

            this.logger.log(`Booking ${bookingId} deleted`)
            return { message: 'Booking deleted successfully' };
        }catch(error){
            if (error instanceof NotFoundException || error instanceof ForbiddenException){
                throw error;
            }
            this.logger.error('Booking deletion failed', (error as Error).stack)
            throw new InternalServerErrorException(
                'Unable to delete booking'
            );
        }
    }

}
