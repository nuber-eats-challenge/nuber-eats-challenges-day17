import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { Review } from "../entities/review.entity";
import { CoreOutput } from "../../podcast/dtos/output.dto";
import { User } from "src/users/entities/user.entity";

@InputType()
export class ReviewPodcastInput extends PickType(Review, ['content', 'rating']) { }

@ObjectType()
export class ReviewPodcastOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  id?: number;
}

@ObjectType()
export class SeeSubscriptionsOutput extends CoreOutput {
  @Field(() => [User], { nullable: true })
  users?: User[];
}