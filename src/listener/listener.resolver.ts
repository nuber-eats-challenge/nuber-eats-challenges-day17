import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/podcast/dtos/output.dto';
import { SearchPodcastsOutput } from 'src/podcast/dtos/podcast.dto';
import { UserRole } from 'src/users/entities/user.entity';
import { ReviewPodcastInput, ReviewPodcastOutput, SeeSubscriptionsOutput } from './dtos/review.dto';
import { ListenerService } from './listener.service';

@Resolver()
export class ListenerResolver {
  constructor(private readonly listenerService: ListenerService) { }

  @Role([UserRole.Listener])
  @Query(() => SearchPodcastsOutput)
  searchPodcasts(@Args('title') podcastTitle: string): Promise<SearchPodcastsOutput> {
    return this.listenerService.searchPodcasts(podcastTitle);
  }

  @Role([UserRole.Listener])
  @Mutation(() => ReviewPodcastOutput)
  reviewPodcast(@Args('id') podcastId: number, @Args('input') reviewPodcastInput: ReviewPodcastInput): Promise<ReviewPodcastOutput> {
    return this.listenerService.reviewPodcast(podcastId, reviewPodcastInput);
  }

  @Role([UserRole.Listener])
  @Mutation(() => CoreOutput)
  subscribeToPodcast(@Args('id') userId: number, @Args('podcastId') podcastId: number): Promise<CoreOutput> {
    return this.listenerService.subscribeToPodcast(userId, podcastId);
  }

  @Role([UserRole.Listener])
  @Query(() => SeeSubscriptionsOutput)
  seeSubscriptions(@Args('id') podcastId: number): Promise<SeeSubscriptionsOutput> {
    return this.listenerService.seeSubscriptions(podcastId)
  }

  @Role([UserRole.Listener])
  @Mutation(() => CoreOutput)
  markEpisodeAsPlayed(@Args('id') userId: number, @Args('episodeId') episodeId: number): Promise<CoreOutput> {
    return this.listenerService.markEpisodeAsPlayed(userId, episodeId);
  }

}
