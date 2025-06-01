import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {UserEntity} from "@app/user/user.entity";
import {CreateArticleDto} from "@app/article/dto/createArticle.dto";
import {ArticleEntity} from "@app/article/article.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, DeleteResult, DataSource} from "typeorm";
import slugify from "slugify";
import {ArticlesResponseInterface} from "@app/article/types/articlesResponse.interface";

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

        if (query.limit) {
            queryBuilder.limit(query.limit);
        }

        if (query.offset) {
            queryBuilder.offset(query.offset);
        }

        const articles = await queryBuilder.getMany();
        const articlesCount = await queryBuilder.getCount();

        return {articles, articlesCount};
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


}