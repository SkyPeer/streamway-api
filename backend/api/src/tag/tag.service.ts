import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { TagEntity } from "@app/tag/tag.entity"
import { Repository } from "typeorm"

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>,
    ) {}

    async findAll(): Promise<TagEntity[]> {
        /*console.log('private taName', this.tagName)*/
        // console.log(this.tagRepo)
        return await this.tagRepository.find()

        // return ["Tag1", "Tag2", "Tag3"]
    }
}

// class MyClass {
//     constructor(newData = '123') {
//         this.newData = newData;
//     }
//
//     // data = 'source' +  ' ' + this.newData
//     getData = () => {
//         console.log(this)
//         const data = 'source' +  ' ' + this.newData;
//         return data;
//     };
// }
//
// const myClass = new MyClass(321);
//
// // console.log('myClass', myClass.getData())
//
// // console.log(myClass.getData())
//
// const ttt  = myClass.getData()
//
// console.log('ttt:', ttt)
