import { Module } from "@nestjs/common"
import { TagController } from "./tag.controller"
import { TagService } from "./tag.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TagEntity } from "./tag.entity"
import { SubTagModule } from "@app/subtag/subtag.module"

@Module({
    imports: [TypeOrmModule.forFeature([TagEntity]), SubTagModule],
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService],
})
export class TagModule {}
