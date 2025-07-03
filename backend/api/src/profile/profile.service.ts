import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {TagEntity} from "@app/tag/tag.entity"
import {Repository} from "typeorm"
import axios, {AxiosResponse} from "axios";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>,
    ) {}

    async findAll(): Promise<TagEntity[]> {
        return await this.tagRepository.find()
    }

    async getTimes(): Promise<any[]> {
        const response: AxiosResponse = await axios.get('http://localhost:8000')
        console.log('---get items ---')
        return response?.data || []
    }
}
