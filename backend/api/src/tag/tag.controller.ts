import { Controller, Get, Header } from "@nestjs/common"
import { TagService } from "./tag.service"

@Controller("tags") // localhost:3000/tags
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get()
    @Header("Cache-Control", "no-store")
    @Header("Auth", "test")
    // @UseGuards(AuthGuard)
    async findAll(): Promise<{ tags: string[] }> {
        const tags = await this.tagService.findAll()
        return { tags: tags.map((tag) => tag.name) }
    }
}
