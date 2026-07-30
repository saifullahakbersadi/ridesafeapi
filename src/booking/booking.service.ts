import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateUserBookingDto } from './dto/update-user-booking.dto';
import { DeleteUserBookingDto } from './dto/delete-user-booking.dto';
import { TravelTimeService } from 'src/traveltime/traveltime.service';
import { DriverService } from 'src/driver/driver.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class BookingService {

    private readonly logger  = new Logger(BookingService.name);
    constructor(
        private prisma:PrismaService,
        private readonly travelTimeService: TravelTimeService,
        private readonly driverService: DriverService,
        private readonly emailService: EmailService
    ){}

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
            let estimatedTravelTime = createBookingDto.estimatedTravelTime;
            let distance = createBookingDto.distance;
            const userExist = await this.prisma.user.findUnique({
                    where: {
                        id: createBookingDto.userId
                    }
            })
            try{
                
                // Get travel time/estimated arrival using TravelTimeService
                const travelTime = await this.travelTimeService.getTravelTime(
                    createBookingDto.pickupLng,
                    createBookingDto.pickupLat,
                    createBookingDto.destinationLng,
                    createBookingDto.destinationLat,
                );
                
                estimatedTravelTime = travelTime.durationMinutes;
                distance = travelTime.distanceKm;
                console.log(`Estimated travel time & distance ${estimatedTravelTime} & ${distance}`)
            }catch(travelTimeError){
                this.logger.warn(
                    `Travel time service failed, falling back to client-supplied estimate: ${(travelTimeError as Error).message}`
                );
            }

            const estimatedArrival = new Date(
                new Date(createBookingDto.pickupTime).getTime() + estimatedTravelTime * 60_000
            );

            let driverId = createBookingDto.driverId;

            if (!driverId){
                try{
                    const nearestDriver = await this.driverService.findDriver(
                        {
                            customerLat: createBookingDto.pickupLat,
                            customerLng: createBookingDto.pickupLng,
                        },
                        createBookingDto.pickupPostcode,
                    );

                    if (nearestDriver){
                        driverId = nearestDriver.driver.userId;
                        this.logger.log(
                            `Assigned nearest driver ${driverId} (${nearestDriver.distanceKm}km away)`
                        );
                    }else{
                        this.logger.warn('No available driver found within dispatch range')
                    }
                }catch(driverSearchError){
                    this.logger.warn(
                        `Driver search failed, creating booking unassigned: ${(driverSearchError as Error).message}`
                    );
                }
            }
            if (userExist){
            
                const booking = await this.prisma.booking.create({
                    data: {
                        ...createBookingDto,
                        estimatedTravelTime,
                        distance,
                        estimatedArrival,
                        driverId,
                    },
                    include: {
                        user: true,
                        driver: true,
                    }
                });
                this.logger.log(`New booking created by ${booking.userId}`)
                
                if (booking){
                    //Notify nearest driver & send email to user the pending booking
                    await this.emailService.sendEmail(
                        booking.user.email,
                        'Your booking is pending',
                        `<p>Hi ${booking.user.firstName},</p>
                        <p>Your booking from <strong>${booking.pickup}</strong> to <strong>${booking.destination}</strong>
                        on ${booking.pickupTime.toLocaleString()} is pending confirmation.</p>`,
                    );

                    if (booking.driver){
                        await this.emailService.sendEmail(
                            booking.driver.email,
                            'New booking assigned to you',
                            `<p>Hi ${booking.driver.firstName},</p>
                            <p>You've been assigned a new booking: pickup at <strong>${booking.pickup}</strong>,
                            drop-off at <strong>${booking.destination}</strong>, on ${booking.pickupTime.toLocaleString()}.</p><br>
                            <a href="${process.env.PROD_URL}/${booking.driver.id}/booking/${booking.id}">Accept Trip</a>`,
                        );
                    }
                }
                return booking;
            }else{
                this.logger.error('UserID verification failed')
                throw new NotFoundException(
                    'Unable to find User'
                );
            }
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
