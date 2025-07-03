import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "tags" })
export class ProfileEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string
}
