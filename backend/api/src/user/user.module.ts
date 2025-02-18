import { Module } from "@nestjs/common"
import { UserService } from "./user.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserController } from "@app/user/user.controller"
import { UserEntity } from "./user.entity"


@Module({
    // providers: [UsersService],
    // exports: [UsersService],
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
