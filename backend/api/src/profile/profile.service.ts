import {Injectable} from "@nestjs/common"
import {InjectRepository} from "@nestjs/typeorm"
import {TagEntity} from "@app/tag/tag.entity"
import {Repository} from "typeorm"
import axios, {AxiosResponse} from "axios";
import {ProfileEntity} from "@app/profile/profile.entity";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(ProfileEntity)
        private readonly tagRepository: Repository<ProfileEntity>,
    ) {}

    async findAll(): Promise<ProfileEntity[]> {
        return await this.tagRepository.find()
    }



    async getItems(): Promise<any[]> {
        const response: AxiosResponse = await axios.get('http://localhost:8000')
        console.log('---get items ---')
        return response?.data || []
    }
}
