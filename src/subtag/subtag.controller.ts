import { Controller, Get } from "@nestjs/common"
import { SubTagService } from "./subtag.service"

@Controller("subtags") // localhost:3000/tags
export class SubTagController {
    constructor(private readonly subTagService: SubTagService) {}

    @Get()
    findAll() {
        return this.subTagService.findAll()
    }
}
