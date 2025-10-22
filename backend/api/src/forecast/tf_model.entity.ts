import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

@Entity({name: 'tf_model'})
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

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updated_at: Date;
}


