import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(private prisma: PrismaService){}

    // GET all users
    getAll(){
        return this.prisma.user.findMany()
    }

    // GET user by email
    async getUserByEmail(email:string){
        try{
            const user = await this.prisma.user.findUnique({
                where:{
                    email: email
                }
            })

            if (!user){
                throw new NotFoundException(`No user found with this email: ${email}`)
            }
            
            return (user);

        }catch(error){
            this.logger.error(`getUserByEmail(${email}) failed`, (error as Error).stack);
            throw error;
        }
    }
}
