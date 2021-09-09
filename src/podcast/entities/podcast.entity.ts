import { Episode } from './episode.entity';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, Min, Max, IsNumber } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from './core.entity';
import { Review } from '../../listener/entities/review.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
@InputType('PodcastInputType', { isAbstract: true })
@ObjectType()
export class Podcast extends CoreEntity {
  @Column()
  @Field(type => String)
  @IsString()
  title: string;

  @Column()
  @Field(type => String)
  @IsString()
  category: string;

  @Column({ default: 0 })
  @Field(type => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @OneToMany(() => Episode, episode => episode.podcast)
  @Field(type => [Episode])
  episodes: Episode[];

  @OneToMany(() => Review, review => review.podcast)
  @Field(() => [Review])
  reviews: Review[];

  @OneToMany(() => User, user => user.podcast)
  users: User[];
}
