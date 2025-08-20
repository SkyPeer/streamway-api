import {Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne} from 'typeorm';
import {MeteoCityEntity} from "@app/meteo/meteo-city.entity";

// TODO rename meteo_values || weather_forecasts || temperature_readings
@Entity({ name: 'meteo_temps' })
export class MeteoTempEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'decimal', precision: 10, scale: 7})
  min: number;

  @Column({type: 'decimal', precision: 10, scale: 7})
  max: number;

  @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created: Date;

  @ManyToOne(() => MeteoCityEntity, city => city.temps, {eager: true})
  city: MeteoCityEntity;
}


