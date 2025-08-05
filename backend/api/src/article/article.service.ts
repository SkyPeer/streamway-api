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
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        private readonly dataSource: DataSource,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {
    }

    async createArticle(
        currentUser: UserEntity,
        createArticleDto: CreateArticleDto):
        Promise<ArticleEntity> {
        const article = new ArticleEntity();
        Object.assign(article, createArticleDto);

        if (!article.tagList) {
            article.tagList = [];
        }

        article.slug = this.getSlug(article.title);

        article.author = currentUser;

        return await this.articleRepository.save(article);
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

    async findAll(currentUserId: number, query: any
    ): Promise<ArticlesResponseInterface> {
        const queryBuilder = this.dataSource.getRepository(ArticleEntity)
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author');

        queryBuilder.orderBy('articles.createdAt', 'DESC');

        if (query.tag) {
            queryBuilder.andWhere('articles.tagList LIKE :tag',
                {tag: `%${query.tag}%`});
        }

        if (query.author) {
            const author = await this.userRepository.findOne({where: {username: query.author}});
            queryBuilder.andWhere('articles.authorId = :id', {id: author.id});
        }

        if(query.favorited) {
            const author = await this.userRepository.findOne(
                {where: {username: query.favorited}, relations: ['favorites']}
            );

            if(!author) {
                throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
            }

            const authorFavoriteArticlesIds = author.favorites.map((item) => item.id);

            // queryBuilder.andWhere('articles.authorId = :id', {id: ids});
            if (authorFavoriteArticlesIds.length) {
                queryBuilder.andWhere('articles.id IN (:...authorFavoriteArticlesIds)', {authorFavoriteArticlesIds});
            } else {
                queryBuilder.andWhere('1=0');
            }
        }

        if (query.limit) {
            queryBuilder.limit(query.limit);
        }

        if (query.offset) {
            queryBuilder.offset(query.offset);
        }

        let favoritesIds: number[] = [];

        console.log('currentUserId', currentUserId)

        if(currentUserId) {
            const currentUser = await this.userRepository.findOne(
                {where: {username: query.username}, relations: ['favorites']}
            );
            favoritesIds = currentUser.favorites.map((favorite) => favorite.id);
            console.log('favorites ids', favoritesIds);
        }

        const articles = await queryBuilder.getMany();
        const articlesCount = await queryBuilder.getCount();
        const articlesWithFavorites = articles.map((article: ArticleEntity) => {
            const favorited = favoritesIds.includes(article.id);
            return {...article, favorited};
        })

        return {articles: articlesWithFavorites, articlesCount};
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

    async updateArticle(slug: string,
                        updateArticleDto: CreateArticleDto,
                        currentUserId: number): Promise<ArticleEntity> {
        const sourceArticle: ArticleEntity = await this.findBySlug(slug);

        if (!sourceArticle) {
            throw new HttpException("Article does not exist", HttpStatus.NOT_FOUND);
        }

        const authorId = sourceArticle.author.id;

        if (authorId !== currentUserId) {
            throw new HttpException('You dont have rights to update this article', HttpStatus.NOT_FOUND);
        }

        const data = {...sourceArticle, ...updateArticleDto}

        console.log(sourceArticle);

        //return this.articleRepository.update({slug}, data);
        // Don't use, because not returned ArticleEntity

        return this.articleRepository.save(data);

    }

    async deleteArticle(slug: string, currentUserId: number): Promise<DeleteResult> {
        console.log('currentUsr', currentUserId)

        const article = await this.findBySlug(slug);
        if (!article) {
            throw new HttpException("Article does not exist", HttpStatus.NOT_FOUND);
        }

        if (article.author.id !== currentUserId) {
            throw new HttpException("You are not author", HttpStatus.FORBIDDEN);
        }

        return await this.articleRepository.delete({slug});
    }

    async addArticleToFavorites(slug: string, currentUserId: number): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);
        const user = await this.userRepository.findOne({
            where: { id: currentUserId },
            relations: ['favorites']
        });

        const isNotFavorites = user.favorites.findIndex(
            articleInFavorites => articleInFavorites.id === article.id
        ) === -1;

        if(isNotFavorites) {
            user.favorites.push(article);
            article.favoritesCount++
            await this.userRepository.save(user)
            await this.articleRepository.save(article);
        }
        return article;
    }

    async deleteArticleFromFavorites(slug: string, currentUserId: number): Promise<ArticleEntity> {
        const article = await this.findBySlug(slug);
        const user = await this.userRepository.findOne({
            where: { id: currentUserId },
            relations: ['favorites']
        });

        const articleIndex = user.favorites.findIndex(
            articleInFavorites => articleInFavorites.id === article.id
        );

        if(articleIndex >= 0) {
            user.favorites.splice(articleIndex, 1);
            article.favoritesCount--
            await this.userRepository.save(user)
            await this.articleRepository.save(article);
        }

        return article;
    }

    async getArticlesPython(): Promise<any[]> {
        try {
            const response: AxiosResponse = await axios.get('http://localhost:8000/articles')
            return response?.data
        } catch (error) {
            if(error.response?.data?.detail) {
                throw new HttpException(error.response?.data?.detail || "Error from Articlelytics Service", HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException("Can't connect to Articlelytics Service", HttpStatus.INTERNAL_SERVER_ERROR);
            }

        }
    }

}