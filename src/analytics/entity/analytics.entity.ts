import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('analytics')
export class AnalyticsEntity {
  @Field(type => String)
  @ObjectIdColumn()
  _id: ObjectID;

  @Field()
  @Column()
  seriesName: string;

  @Field()
  @Column()
  accessCount: number;
}
