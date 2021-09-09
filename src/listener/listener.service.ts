import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/podcast/dtos/output.dto';
import { SearchPodcastsOutput } from 'src/podcast/dtos/podcast.dto';
import { Podcast } from 'src/podcast/entities/podcast.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ReviewPodcastInput, ReviewPodcastOutput, SeeSubscriptionsOutput } from './dtos/review.dto';
import { Review } from './entities/review.entity';
import { PodcastsService } from 'src/podcast/podcasts.service';
import { Episode } from 'src/podcast/entities/episode.entity';

@Injectable()
export class ListenerService {

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Podcast)
    private readonly podcastRepository: Repository<Podcast>,
    private readonly podcastsService: PodcastsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
  ) { }

  private readonly InternalServerErrorOutput = {
    ok: false,
    error: 'Internal server error occurred.',
  };


  async searchPodcasts(title: string): Promise<SearchPodcastsOutput> {
    try {
      const podcasts = await this.podcastRepository.find({ relations: ['reviews'], where: { title } });

      if (!podcasts) {
        return {
          ok: false,
          error: `podcast with title ${title} not found`
        }
      }

      return {
        ok: true,
        podcasts
      }

    } catch (e) {
      console.log(e);
      return this.InternalServerErrorOutput;
    }
  }

  async reviewPodcast(podcastId: number, { content, rating }: ReviewPodcastInput): Promise<ReviewPodcastOutput> {
    try {
      const review = this.reviewRepository.create({ content, rating });

      const podcast = await this.podcastRepository.findOne(podcastId);
      review.podcast = podcast;
      const { id } = await this.reviewRepository.save(review);

      return {
        ok: true,
        id
      }

    } catch {
      return this.InternalServerErrorOutput;
    }
  }

  async subscribeToPodcast(userId: number, podcastId: number): Promise<CoreOutput> {
    try {
      const user = await this.userRepository.findOne(userId, { loadRelationIds: true });

      user.podcast = await this.podcastRepository.findOne(podcastId);
      await this.userRepository.save(user);

      return {
        ok: true,
      }

    } catch (e) {
      return this.InternalServerErrorOutput;
    }
  }

  async seeSubscriptions(podcastId: number): Promise<SeeSubscriptionsOutput> {
    try {
      const podcast = await this.podcastRepository.findOne(podcastId, {relations: ['users']});

      return {
        ok: true,
        users: podcast.users
      }
    } catch {
      return this.InternalServerErrorOutput;
    }
  }

  async markEpisodeAsPlayed(userId: number, episodeId: number): Promise<CoreOutput> {
    try {
      const user = await this.userRepository.findOne(userId, { relations: ['episode'] });
      user.episode = await this.episodeRepository.findOne(episodeId);
      this.userRepository.save(user);

      return {
        ok: true
      }

    } catch {
      return this.InternalServerErrorOutput;
    }
  }
}
