import { Module } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { ListenerResolver } from './listener.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { PodcastsService } from 'src/podcast/podcasts.service';
import { User } from 'src/users/entities/user.entity';
import { Episode } from 'src/podcast/entities/episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Podcast, User, Episode])],
  providers: [ListenerService, ListenerResolver, PodcastsService]
})
export class ListenerModule {}
