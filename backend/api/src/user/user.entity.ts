import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from "typeorm"
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

    @Column({ default: '' })
    password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10)
    }
}
