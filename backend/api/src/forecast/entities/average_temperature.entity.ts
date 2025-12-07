import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'average_temperature' })
export class ForecastTemperatureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  temp: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  predict: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  month: number;
}
