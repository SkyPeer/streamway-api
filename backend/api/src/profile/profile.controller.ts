import { Controller, Get, Header } from "@nestjs/common"
import { ProfileService } from "./profile.service"

@Controller("profile") // localhost:3000/tags
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    @Header("Cache-Control", "no-store")
    // @UseGuards(AuthGuard)
    async findAll(): Promise<{ tags: string[] }> {
        const tags = await this.profileService.findAll()
        return { tags: tags.map((tag) => tag.name) }
    }

    @Get('/items')
    @Header("Cache-Control", "no-store")
    // @UseGuards(AuthGuard)
    async getPythonItems(): Promise<any[]> {
        return await this.profileService.getItems()

    }
}
