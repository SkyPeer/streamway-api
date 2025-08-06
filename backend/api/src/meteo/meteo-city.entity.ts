import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import {MeteoTempEntity} from "@app/meteo/meteo-temp.entity";

@Entity({ name: 'meteo_cities' })
export class MeteoCityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: null})
  lat: number;

  @Column({default: null})
  lon: number;

  @Column({default: ''})
  city: string;

  @Column({default: ''})
  country: string;

  @Column({default: ''})
  description: string;

  @OneToMany(() => MeteoTempEntity, temp => temp.city)
  temps: MeteoTempEntity[];
}


