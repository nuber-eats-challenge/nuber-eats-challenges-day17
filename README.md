# nuber-eats-challenges-day17

<details>
  <summary>
  Day 15-16 정답해설
  </summary>

1. 테스트 설정하기
- ```let podcastsRepository: Repository<Podcast>;```
- ```let episodesRepository: Repository<Episode>;```
- ```let usersRepository: Repository<User>;```
- 테스트 설정에 let으로 repository들이 초기화되어있는데, 밑 라인의 beforeAll에서 app과 repository를 초기화시키기 때문에 let으로 선언되어 있습니다.
- repository 초기화
- ```podcastsRepository = moduleFixture.get<Repository<Podcast>>(getRepositoryToken(Podcast));```
- 나머지 episodeRepsitory, usersRepository 초기화 방법은 모두 동일합니다.
- afterAll?
- unit test 때에는 사용하지 않았던 것이 보입니다. afterAll 직관적으로 네이밍 되어 있어서 크게 설명 필요는 없을 것 같습니다. 테스트를 매번 새로 시작할 때마다 만든 데이터들이 쌓여 있으면 다음 테스트에 영향을 미치기 때문에, databse에 drop 명령을 내려 DB를 초기화시키는 과정이 필요합니다. 그래서 afterAll 안에서 이 과정을 수행하도록 합니다.
2. 테스트
- e2e테스트는 흔히 종단간 테스트로 번역이 되고, 실제 사용자가 행동하는 방식으로 테스트를 한다고 생각하시면 됩니다. 이번에는 unit 테스트처럼 가짜 데이터 베이스를 사용하지 않습니다.
![](https://i.ibb.co/xHBT2x3/repeat.png)
- e2e테스트에서는 ```request(app.getHttpServer()).post(GRAPHQL_ENDPOINT).send({query})```가 계속 반복될 것이므로 함수를 wrapping 해놓았습니다. request는 supertest 패키지에서 import한 함수이며, express test를 위해 nestjs 프레임워크에 포함 된 패키지입니다
- privateTest에 보시면 ```set('X-JWT', jwtToken)```는 헤더에 'X-JWT'라는 이름으로 jwtToken을 넘겨주는 과정입니다.
![](https://i.ibb.co/dj7vXbL/create-test.png)
- 래핑해 놓은 함수에 mutation ~ 부분에 실제로 graphql 문이 들어가있습니다. 주의하실 부분은 ${testPodcast.title} 이 부분인데 자바스크립트에서는 저렇게만 해도 string으로 인식하지만, graphql에서는 그렇지 않습니다. 작은 따옴표(')도 아니고 ```큰 따옴표(")로 감싸주어야 텍스트로 인식```하므로 주의하셔야 합니다.
- 또 한가지 주의하셔야 할 점은 ```request.send...(솔루션은 publicRest, privateTest)``` 이 코드들은 반드시 리턴값으로 넘겨주셔야 합니다. 그렇지 않으면 테스트는 무조건 success로 나오기 때문에 주의하셔야 합니다. 나머지 결과들도 영향을 받을 수 있기 때문에 꼭 리턴값으로 넘기셔야 한다는 것을 기억하셔야 합니다.
- ```expect(200)```: 200은 post 메소드로 send함수를 이용하여 보낸 request에 대한 응답의 status code를 의미합니다. /graphql에 정상적으로 query가 잘 보내졌으면, 200 의 응답코드를 받아야 한다는 의미인데, 위에서 언급한 큰 따옴표를 생략하고 request 요청을 하면 흔히 400 응답코드를 많이 받습니다.
- 테스트 방법은 unit 테스트처럼, 성공적으로 처리 되는 경우, 에러인 경우 에러처리 등의 경우가 잘 처리되고 있나 테스트 해보시면 됩니다. unit테스트와는 달리 실제 DB 사용, 실제 graphql에 query 요청을 한다는 점 등이 다릅니다.
![](https://i.ibb.co/6XKRk9S/test-result.png)

###결론
- Unit test에 이은 e2e테스트 입니다. 각 테스트의 목적을 생각해보시면서 코드를 작성해보세요.
- 테스트 과정을 거치면서 챌린지 과정에서 바쁘게 만들어 놓은 코드도 리뷰할 수 있고, 혹시나 작동하지 않았던, 또는 버그가 있던 부분도 알 수 있어서 의미 있는 챌린지 과제였습니다.
</details>

### Roles!

- 오늘의 강의: 우버 이츠 클론코딩 강의 #10.0 - #10.7 (21.09.08)
- 오늘의 과제: 위의 강의를 시청하신 후, 아래 코드 챌린지를 제출하세요.

### Code Challenge

- 오늘 과제는 resolver들에 역할 (Host, Listener) 기반 권한 부여(authorization)를 구현할 차례입니다.
- 지금 만드는 Podcast discovery app에서 유저들은 Host와 Listener 두 가지의 중 하나의 역할을 가지고 있습니다.
- 따라서 메타데이터를 설정, Guard와 Decorator을 만들어 resolver를 호출할 때 사용자의 역할을 검증하는 코드를 만드시면 됩니다.
- RoleType이 'Any', 'Host', 'Listener'인 **@Role** (RoleType) 형태로 decorator를 만들어서 사용자의 role에 따라 resolver를 보호하게 만드세요.
- 예를 들어, 'Host'가 역할인 유저만이 팟캐스트를 생성할 수 있습니다.



<details>
  <summary>
  Hint
  </summary>

- APP_GUARD 를 이용하시는 것을 추천드립니다.
- keyof typeof를 이용하여 RoleType을 만드세요.
- nestjs에서 metadata를 설정하고 사용하는 방법과 reflector가 어떤 것인지 참고해 보시면 도움되십니다.
</details>