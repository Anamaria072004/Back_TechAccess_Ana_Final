import { User } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity('accesos')
export class Acceso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  horaIngreso!: Date;

  @Column({ type: 'timestamp', nullable: true })
  horaSalida!: Date;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' }) 
  fecha!: Date;

  @Column({ nullable: true })
  observacion!: string;

   @ManyToOne(() => User, (user) => user.accesos, { onDelete: 'CASCADE' })
  usuario!: User;

}