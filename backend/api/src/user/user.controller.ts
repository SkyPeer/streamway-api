import {
    Get,
    Controller,
    Post,
    Body,
    UsePipes,
    Req,
    ValidationPipe
} from "@nestjs/common"
import {UserService} from "@app/user/user.service";
import {CreateUserDto} from "./dto/create-user.dto"
import {GetUserDto} from "@app/user/dto/get-user.dto";
import {UserResponseInterface} from "@app/user/types/userResponse.interface";
import {Request} from "express";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("users")
    @UsePipes(new ValidationPipe())
    async createUser(
        @Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
        return this.userService.createUser(createUserDto);
    }

    @Post("users/login")
    @UsePipes(new ValidationPipe())
    async lohin(
        @Body('user') getUserDto: GetUserDto): Promise<UserResponseInterface> {
        // console.log('getUserDto', getUserDto)
        return this.userService.login(getUserDto)
    }

    @Get("user")
    async currentUser(@Req() request: Request): Promise<any> {
        // console.log('request', request)
        return 'user'
    }

}
