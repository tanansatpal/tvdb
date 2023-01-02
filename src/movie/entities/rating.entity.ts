import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class RatingData {
  @Field(type => Float)
  rating: number;
}
