import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {ArticleService} from "@app/article/article.service";
import {AuthGuard} from "@app/user/guards/auth.guard";
import {User} from "@app/user/decorators/user.decorator";
import {UserEntity} from "@app/user/user.entity";
import {ArticleEntity} from "@app/article/article.entity";
import {CreateArticleDto} from "@app/article/dto/createArticle.dto";
import {ArticleResponseInterface} from "@app/article/types/articleResponse.interface";
import {ArticlesResponseInterface} from "@app/article/types/articlesResponse.interface";

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get()
    async findAll(@User('id') currentUserId: number, @Query() query: any): Promise<ArticlesResponseInterface> {
        return await this.articleService.findAll(currentUserId, query);
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async create(
        @User() currentUser: UserEntity,
        @Body('article') createArticleDto: CreateArticleDto
    ): Promise<ArticleResponseInterface> {
        const article: ArticleEntity = await this.articleService.createArticle(currentUser, createArticleDto);
        return this.articleService.buildArticleResponse(article);
    }

    buildArticleResponse(article: ArticleEntity) {
        return {article}
    }

    @Get('/search')
    async findArticlesBySlug(@Query('slug') slug: string) {
        // http://{host}/articles/search?slug=train
        return await this.articleService.getArticlesBySlugLike(slug)
    }


    @Get('/:slug')
    async findBySlug(@Param() param: any): Promise<ArticleResponseInterface> {
        // http: //localhost:3000/articles/foo
        console.log('slug', param)
        const slug = param.slug;
        const article = await this.articleService.findBySlug(slug);
        return this.buildArticleResponse(article);
    }

    @Delete('/:slug')
    @UseGuards(AuthGuard)
    async deleteArticle(
        @User('id') currentUserId: number,
        @Param('slug') slug: string,
    ) {
        return this.articleService.deleteArticle(slug, currentUserId);
    }

    @Put('/update')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async updatePost(
        @Query('slug') slug: string,
        @User('id') currentUserId: number,
        @Body('article') updateArticleDto: CreateArticleDto
        ): Promise<ArticleResponseInterface>
    {

        console.log('updateArticle bu slug:', slug);

        const article = await this.articleService.updateArticle(slug, updateArticleDto, currentUserId);
        return this.buildArticleResponse(article);
    }

    @Post(':slug/favorite')
    @UseGuards(AuthGuard)
    async addArticleToFavorites(
        @User('id') currentUserId: number,
        @Param('slug') slug: string,
    ): Promise<any> {
        return await this.articleService.addArticleToFavorites(slug, currentUserId)
    }

    @Delete(':slug/favorite')
    @UseGuards(AuthGuard)
    async deleteArticleFromFavorites(
        @User('id') currentUserId: number,
        @Param('slug') slug: string,
    ): Promise<any> {
        return await this.articleService.deleteArticleFromFavorites(slug, currentUserId)
    }

}

