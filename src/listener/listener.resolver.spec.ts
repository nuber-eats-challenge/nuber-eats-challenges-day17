import { Test, TestingModule } from '@nestjs/testing';
import { ListenerResolver } from './listener.resolver';

describe('ListenerResolver', () => {
  let resolver: ListenerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListenerResolver],
    }).compile();

    resolver = module.get<ListenerResolver>(ListenerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
