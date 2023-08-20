### 바닐라 JS로 SPA 만들기

[1] https://youtu.be/6BozpmSjk-Y
[2] https://www.youtube.com/watch?v=OstALBk-jTc

- tsc-watch library

- tsconfig : noEmit 설정시 ts파일 컴파일 결과물(js파일)이 생성되지 않음

### 오류 해결

1. 5060 포트
   ![image](https://user-images.githubusercontent.com/82202370/261841143-bf9ed05e-9987-49a4-8548-ab874284dd53.png)

   처음에는 뭔가 내 코드가 잘못됐다고 생각했으나, 찾아보니 포트넘버가 원인이었다.
   포트 5060, 5061이 외부 해킹요인일 수도 있다고 감지?되어서 크롬 등 브라우저에서 차단했다고 한다.
   웹서버를 **5060, 5061이외의 포트**인 3001번 포트로 지정하니까 오류가 사라졌다.

2. html script의 js파일이 제대로 불러오지 못함
   ![image](https://user-images.githubusercontent.com/82202370/261840547-17e4952b-4388-4968-a344-57d52a1ba1f7.png)

   express에서 static미들웨어를 사용하여 정적 directory를 제공한다.

   ```js
   //server.js
   app.use('/static', express.static(path.resolve(__dirname, 'frontend', 'static')));
   ```

   - /static경로를 통해서 ./frontend/static 디렉토리에 포함된 파일을 로드할 수 있다.
   - [express 공식문서 - static](https://expressjs.com/ko/starter/static-files.html)

---

#### 2번 오류 추가 설명

- 위의 사진에 나오는 에러는 js파일에서 모듈을 import할 때 확장자명, 경로 지정을 제대로 입력하지 않아서 발생하기도 한다.
- 모듈 import시 다음과 같이 정확하게 경로와 확장자명을 지정해주자.
  ` import Dashboard from "./views/Dashboard.js";`

---

### 의문점

1.  express static파일에 dist폴더를 지정하면 왜 불러오지 못하는 걸까?

- 답 : dist가 build된 파일을 저장하는 곳을 의미하기 때문인가?

2. TypeScript로 만들어진 모듈을 import할 떄, js확장자로 불러와도 잘 작동하는 이유는?

- 답 : 단순히 TypeScript가 JS의 superset이기 때문일까?

---

### 학습 메모

- [popstate 공식 문서](https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event)
