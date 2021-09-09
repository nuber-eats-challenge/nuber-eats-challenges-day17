import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "../../podcast/entities/core.entity";
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { IsNumber, IsString, Max, max, Min } from "class-validator";
import { Podcast } from "../../podcast/entities/podcast.entity";


@InputType('ReviewInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Review extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  content: string

  @Column({ default: 0 })
  @Field(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @ManyToOne(() => Podcast, podcast => podcast.reviews, {
    onDelete: 'CASCADE'
  })
  @Field(() => Podcast)
  podcast: Podcast;

  @RelationId((review: Review) => review.podcast)
  podcastId: number;
}