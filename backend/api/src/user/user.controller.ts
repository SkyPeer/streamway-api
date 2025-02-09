import {
    Controller,
    Post,
    Body,
    UsePipes,
    ValidationPipe
} from "@nestjs/common"
import {UserService} from "@app/user/user.service";
import {CreateUserDto} from "./dto/create-user.dto"
import {UserResponseInterface} from "@app/user/types/userResponse.interface";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("users")
    @UsePipes(new ValidationPipe())
    async createUser(
        @Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
        return this.userService.createUser(createUserDto);
    }
}
