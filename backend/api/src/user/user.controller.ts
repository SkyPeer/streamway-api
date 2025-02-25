import {Get, Controller, Post, Body, UsePipes, Req, ValidationPipe, UseGuards} from "@nestjs/common"
import {UserService} from "@app/user/user.service";
import {CreateUserDto} from "./dto/create-user.dto"
import {GetUserDto} from "@app/user/dto/get-user.dto";
import {UserResponseInterface} from "@app/user/types/userResponse.interface";
import {Request} from "express";
import {ExpressRequestInterface} from "@app/types/expressRequest.interface";
import {User} from "@app/user/decorators/user.decorator";
import {UserEntity} from "@app/user/user.entity";
import {AuthGuard} from "@app/user/guards/auth.guard";

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
    async login(
        @Body('user') getUserDto: GetUserDto): Promise<UserResponseInterface> {
        // console.log('getUserDto', getUserDto)
        return this.userService.login(getUserDto)
    }

    @Get("user")
    @UseGuards(AuthGuard)
    async currentUser(
        // @Req() request: ExpressRequestInterface,
        @User() user: UserEntity,
        @User('id') currentUserId: number,
        ): Promise<any> {
        console.log('user', user)
        console.log('currentUserId', currentUserId)
        return this.userService.buildUserResponse(user);
    }

}
