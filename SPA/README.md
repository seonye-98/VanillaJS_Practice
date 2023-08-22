## 바닐라 JS로 SPA 만들기

[1] https://youtu.be/6BozpmSjk-Y

- tsc-watch library

- tsconfig : noEmit 설정시 ts파일 컴파일 결과물(js파일)이 생성되지 않음

### 오류 해결

1.  5060 포트

    ![image](https://user-images.githubusercontent.com/82202370/261841143-bf9ed05e-9987-49a4-8548-ab874284dd53.png)

    처음에는 뭔가 내 코드가 잘못됐다고 생각했으나, 찾아보니 포트넘버가 원인이었다.
    포트 5060, 5061이 외부 해킹요인일 수도 있다고 감지?되어서 크롬 등 브라우저에서 차단했다고 한다.
    웹서버를 **5060, 5061이외의 포트**인 3001번 포트로 지정하니까 오류가 사라졌다.

2.  html script의 js파일이 제대로 불러오지 못함

    ![image](https://user-images.githubusercontent.com/82202370/261840547-17e4952b-4388-4968-a344-57d52a1ba1f7.png)

    express에서 static미들웨어를 사용하여 정적 directory를 제공한다.

    ```js
    //server.js
    app.use('/static', express.static(path.resolve(__dirname, 'frontend', 'static')));
    ```

    - /static경로를 통해서 ./frontend/static 디렉토리에 포함된 파일을 로드할 수 있다.
    - [express 공식문서 - static](https://expressjs.com/ko/starter/static-files.html)

    > 2번 오류 추가 설명
    >
    > - 위의 사진에 나오는 에러는 js파일에서 모듈을 import할 때 확장자명, 경로 지정을 제대로 입력하지 않아서 발생하기도 한다.
    > - 모듈 import시 다음과 같이 정확하게 경로와 확장자명을 지정해주자.
    >   ` import Dashboard from "./views/Dashboard.js";`

3.  esm에서 \_\_dirname 사용하기

    [참고 링크](https://jootc.com/p/202206123895)

---

### 의문점

1.  express static파일에 dist폴더를 지정하면 왜 불러오지 못하는 걸까?

- 답 : dist가 build된 파일을 저장하는 곳을 의미하기 때문인가?
- 해결
  dist 라는 폴더이름의 문제가 아니였다.. 원인은 esm문법과 commonJS문법을 혼합으로 사용하면서, 뭔가 충돌이 일어난듯한..? 자세한 내막은 아직 알지 못했지만, 뭔가 둘 사이의 호환이 잘 안되는 문제점을 많이 겪으면서 더더욱 통일해서 사용해야겠다고 생각했다!
  frontend에서는 esm문법을 사용하고 backend에서는 commonJS문법을 사용했었다.

  `해결 과정`

  1. 백엔드 ts로 바꿔서 모든 문법을 esm으로 통일
  2. package.json에 'type':'module' 추가

2. TypeScript로 만들어진 모듈을 import할 떄, js확장자로 불러와도 잘 작동하는 이유는?

- 답 : 단순히 TypeScript가 JS의 superset이기 때문일까?
- 해결
  TypeScript version 5부터 allowImportingTsExtensions, noEmit 옵션을 사용하면 .ts확장자를 import 구분에 사용할 수 있게 되었지만, 이 프로젝트에서는 html파일의 script로 js파일을 src로 넣어줘야 하므로, noEmit 옵션을 사용하게 되면 js로 컴파일된 파일을 src로 넣을 수 없다.
  따라서, 위의 옵션을 사용하지않고 `.js` 확장자를 사용하면 이미 js파일로 변환이 되어있기 때문에 에러없이 import 해올 수 있다.

  [참고 링크](https://pozafly.github.io/typescript/typescript-env/)

---

## URL Parameter 처리

[2] https://www.youtube.com/watch?v=OstALBk-jTc

### 목표

주소창에 http://<hi>localhost:3001/posts/2 를 입력하는 경우 2번째 PostView Component를 화면에 보여주기

### window.location 객체

- 현재 페이지의 URL을 가져오기위해 window.location 속성을 사용하여 Location 객체에 접근할 수 있다.
- 예시 URL : http://<hi>localhost:3001/posts/2?postId=2
- `window.location.href` : **전체 URL 문자** ex. http://<hi>localhost:3001/posts/2?postId=2
- `window.location.host` : **URL의 호스트 정보** ex. localhost:3001
- `window.location.pathname` : **hostname뒤 '/'문자 뒤의 경로(queryString은 포함하지 않는다.)** ex. /posts/2
- `window.location.search` : **'?'뒤의 쿼리스트링을 가져온다.** ex. ?postId=2

[참고 블로그](https://hianna.tistory.com/464)
[쿼리스트링 다루는 글](https://hianna.tistory.com/465)

#### 1. queryString을 통해서 postId를 구분하는 것이아니라 경로를 통해서 구분하기위해 location.pathname을 정규식 검사를 통해 postId값을 가져와야 한다.

```ts
const pathToRegex = (path: string) => new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');
```

- pathToRegex함수를 통해 '/posts/:id' 문자열을 /^\/posts\/(.+)$/의 정규식으로 바꿔준다.
- location.pathname.match(pathRegex(route.path)) URL 경로를 match메서드로 정규식 검사를 하면, 첫 번쨰 요소로 일치하는 전체 문자열을 갖는 배열을 반환한다.
- 정규식에 그룹이 있다면, 반환값 배열의 다음 원소는 각 그룹별로 일치하는 문자열을 포함한다.
  ```
  정규식 : /^\/posts\/(.+)$/
  '/posts/2'.match(정규식)
  반환값 : ["/posts/2/3", "2"]
  ```
- 정규식과 일치하는 문자열이 없다면 null을 반환한다.

[match 공식문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/match)

#### 2. match에 저장된 값으로 생성할 클래스에 넘겨줄 객체를 만든다.

- match의 인터페이스는 다음과 같다.

  ```ts
  interface IMatch {
    route: {
      path: string;
      view: new (params: Record<string, string>) => AbstractView;
    };

    result: string[] | null;
  }
  ```

- getParams: (match: IMatch) => Record<string, string> 함수를 통해 match.route.path에서 key값을 얻고, match.result의 두번째 이상의 요소에서 value값을 얻어 다음과 같은 객체를 반환한다.
  ```
  {
   id: 2
  }
  ```

#### 3. 생성할 클래스에 인자로 넘겨준다.

- 생성자 매개변수로 params를 받아, 클래스 내부에서 params.id로 경로에서 필요한 값에 접근할 수 있게 된다.

---

### 학습 메모

공식문서 중 `match와 exec는 g플래그가 없는 경우 동일하게 동작한다`는 내용이 있어서 이에 대해 알아봤다.

- g플래그가 없는 경우 : match, exec모두 정규식과 일치하는 첫번째 문자열만 있는 배열 반환
- g플래그가 있는 경우

  1. match : 정규식과 일치하는 하위 문자열을 포함하는 배열 반환
  2. exec : 정규식과 일치하는 첫번째 문자자열만 있는 배열을 반환하고, 다음으로 포인터가 넘어감

  ```js
  let str = '1번가 3번가 201호';
  let regexp = /\d+/g;
  str.match(regexp); //['1', '3', '201']
  regexp.exec(str); //['1', index: 0, input: '1번가 3번가 201호', groups: undefined]
  regexp.exec(str); //['3', index: 4, input: '1번가 3번가 201호', groups: undefined]
  regexp.exec(str); //['201', index: 8, input: '1번가 3번가 201호', groups: undefined]
  regexp.exec(str); //null
  //
  ```

- [popstate 공식 문서](https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event)
