import { Controller, Get, Header } from "@nestjs/common"
import { ProfileService } from "./profile.service"

@Controller("tags") // localhost:3000/tags
export class ProfileController {
    constructor(private readonly tagService: ProfileService) {}

    @Get()
    @Header("Cache-Control", "no-store")
    // @UseGuards(AuthGuard)
    async findAll(): Promise<{ tags: string[] }> {
        const tags = await this.tagService.findAll()
        return { tags: tags.map((tag) => tag.name) }
    }

    @Get('/items')
    @Header("Cache-Control", "no-store")
    // @UseGuards(AuthGuard)
    async getPythonItems(): Promise<any[]> {
        return await this.tagService.getTimes()

    }
}
