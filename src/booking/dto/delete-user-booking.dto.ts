import { IsUUID } from "class-validator";

export class DeleteUserBookingDto{
    @IsUUID()
    userId: string;
}
