import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { CreateUserDto } from "./dto/create-user.dto"
import { UserEntity } from "./user.entity"
import {sign} from "jsonwebtoken";
import {JWT_SECRET} from "@app/config";
import {UserResponseInterface} from "@app/user/types/userResponse.interface";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    generateJwt(user: UserEntity): any {
        return sign({
            id: user.id,
            username: user.username,
            email: user.email,
        }, JWT_SECRET);
    }

    buildUserResponse(user: UserEntity): UserResponseInterface {
        return {
            user: {
                ...user,
                token: this.generateJwt(user)
            }
        }
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserResponseInterface> {
        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto)
        const user = await this.userRepository.save(newUser);
        return this.buildUserResponse(user)
    }
}
