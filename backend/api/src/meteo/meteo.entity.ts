import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({ name: 'meteo' })
export class MeteoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  min: number;

  @Column()
  max: number;

  @Column({ default: '' })
  city: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

}


