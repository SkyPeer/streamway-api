import {Column, Entity, PrimaryGeneratedColumn,
    CreateDateColumn, JoinColumn,
    OneToOne, OneToMany} from 'typeorm';
import {CityEntity} from "@app/forecast/entities/city.entity";

@Entity({name: 'tf_models'})
export class TFModel_Entity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false})
    model_name: string;

    @Column({default: ''})
    model_topology: string;

    @Column({default: ''})
    weight_specs: string;

    @Column({type: 'bytea', nullable: true}) // or false, depending on your requirements
    weights: Buffer; // Or Uint8Array, depending on your preference

    @Column({default: ''})
    description: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @OneToOne(() => CityEntity, city=> city.tf_model)
    city: CityEntity;
}


