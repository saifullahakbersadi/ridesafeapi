import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}
    // GET all users
    @UseGuards(JwtAuthGuard)
    @Get('all')
    getAllUsers(){
        return this.userService.getAll();
    }
    // GET user by email
    @Get()
    getUserByEmail(
        @Query('email') email:string
    ){
        return this.userService.getUserByEmail(email)
    }
}
