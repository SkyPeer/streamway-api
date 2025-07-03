import { Module } from "@nestjs/common"
import { ProfileController } from "./profile.controller"
import { ProfileService } from "./profile.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProfileEntity } from "./profile.entity"
import { SubTagModule } from "@app/subtag/subtag.module"
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [TypeOrmModule.forFeature([ProfileEntity]), SubTagModule, HttpModule],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService],
})
export class ProfileModule {}
