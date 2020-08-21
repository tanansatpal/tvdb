import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity('analytics')
export class AnalyticsEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  seriesName: string;

  @Column()
  accessCount: number;
}
