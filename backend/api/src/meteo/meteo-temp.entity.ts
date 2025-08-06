import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne} from 'typeorm';
import {MeteoCityEntity} from "@app/meteo/meteo-city.entity";

@Entity({ name: 'meteo_temps' })
export class MeteoTempEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: null })
  min: number;

  @Column({default: null })
  max: number;

  @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created: Date;

  @ManyToOne(() => MeteoCityEntity, city => city.temps, {eager: true})
  city: MeteoCityEntity;
}


