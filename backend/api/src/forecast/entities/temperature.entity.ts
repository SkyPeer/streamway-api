import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne} from 'typeorm';
import {CityEntity} from "@app/forecast/entities/city.entity";

@Entity({ name: 'forecast_temperature' })
export class ForecastTemperatureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'decimal', precision: 10, scale: 7})
  min: number;

  @Column({type: 'decimal', precision: 10, scale: 7})
  max: number;

  @Column({type: 'decimal', precision: 10, scale: 7})
  wind_speed: number;

  @Column({type: 'decimal', precision: 10, scale: 7})
  wind_direction: number;

  @Column({type: 'decimal', precision: 10, scale: 7, nullable: true})
  predict: number;

  @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  timeStamp: Date;

  @Column()
  random: boolean;

  @ManyToOne(() => CityEntity, city => city.temperatures, {eager: true})
  city: CityEntity;
}


