import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Movie {
  @Field(type => Int)
  id: number;

  @Field()
  title: string;

  @Field(type => Int, { nullable: true })
  vote_count?: number;

  @Field(type => Int, { nullable: true })
  vote_average?: number;
}
