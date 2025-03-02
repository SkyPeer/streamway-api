import {Column, Entity, PrimaryGeneratedColumn, BeforeInsert, OneToMany} from "typeorm"
import {ArticleEntity} from "@app/article/article.entity";
import {hash} from "bcrypt"

@Entity({ name: "users" })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column({default: ''})
    username: string

    // @Column({ type: "varchar", default: '' })
    @Column({ default: '' })
    bio: string

    @Column({ default: '' })
    image: string

    @Column({ select: false })
    password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10)
    }

    @OneToMany(() => ArticleEntity, article => article.author)
    articles: ArticleEntity[];
}
