import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn} from 'typeorm';
import {MeteoTempEntity} from "@app/meteo/meteo-temp.entity";

@Entity({ name: 'meteo_cities' })
export class MeteoCityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'decimal', precision: 10, scale: 7})
  lat: number;

  @Column({type: 'decimal', precision: 10, scale: 7})
  lon: number;

  @Column({default: ''})
  city: string;

  @Column({default: ''})
  country: string;

  @Column({default: ''})
  description: string;

  @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  lastUpdated: Date;

  @OneToMany(() => MeteoTempEntity, temp => temp.city)
  temps: MeteoTempEntity[];
}


