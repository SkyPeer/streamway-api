import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {UserEntity} from "@app/user/user.entity";
import {CreateArticleDto} from "@app/article/dto/createArticle.dto";
import {ArticleEntity} from "@app/article/article.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, DeleteResult, DataSource} from "typeorm";
import slugify from "slugify";
import {ArticlesResponseInterface} from "@app/article/types/articlesResponse.interface";
import axios, {AxiosResponse} from "axios";

@Injectable()
export class ForecastService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        private readonly dataSource: DataSource,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {
    }

    buildArticleResponse(article: ArticleEntity) {
        return {article}
    }

    private getSlug(title: string): string {
        return (
            slugify(title, {lower: true}) + '-' +
            (Math.random() * Math.pow(36, 6)).toString(36)
        );
    }

    async getArticlesBySlugLike(slug: string): Promise<ArticleEntity[]> {
        // return await this.articleRepository.find({where: {slug: slug}})
        // SELECT * FROM public.articles where articles.slug like '%train%'
        return await this.articleRepository.query(`SELECT *
                                                   FROM articles
                                                   where slug like '%${slug}%'`);
    }

    async findBySlug(slug: string): Promise<ArticleEntity> {
        // const article = await this.articleRepository.findOne({where: {slug}})
        // return this.buildArticleResponse(article);
        return await this.articleRepository.findOne({where: {slug}})
    }

}