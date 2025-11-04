import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ArticleEntity} from "@app/article/article.entity";
import {UserEntity} from "@app/user/user.entity";
import {ForecastService} from "@app/forecast/forecast.service";
import {ForecastController} from "@app/forecast/forecast.controller";

@Module({
    imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity])],
    controllers: [ForecastController],
    providers: [ForecastService],
})
export class ForecastModule {}