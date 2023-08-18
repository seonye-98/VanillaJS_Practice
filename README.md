# MVVM_System

MVVM System 만들기

[참고블로그](https://junilhwang.github.io/TIL/CodeSpitz/Object-Oriented-Javascript/02-MVVM/#role-design)

### 공부 목표

위의 블로그에서 나온 MVVM System의 코드를 TypeScript로 Migration하고, 코드 분석을 통해 MVVM에 대해 알아보자!

### MVVM 패턴 (Model-View-View Model)

![image](https://user-images.githubusercontent.com/82202370/261467552-40b57bd0-ce39-402c-b36f-8954dc8232fa.png)

#### 모델(Model)

- 애플리케이션의 데이터인 데이터베이스, 상수, 변수 등
- ex. 사각형 모양의 박스 안에 글자가 들어 있다면 그 사각형 모양의 박스 위치 정보, 글자 내용, 글자 위치, 글자 포맷에 관한 정보를 모두 가지고 있어야 함

#### 뷰(View)

- inputbox, checkbox, textarea 등 사용자 인터페이스 요소를 나타낸다.
- 즉, 모델을 기반으로 사용자가 볼 수 있는 화면을 말함
- 모델이 가지고 있는 정보를 따로 저장하지 않아야 하며 단순 사각형 모양 등 화면에 표시하는 정보만 가지고 있어야 함

#### 뷰모델(View Model)

- 뷰를 더 추상화한 계층이며, MVC패턴과는 다르게 커맨드와 데이터 바인딩을 가진다.
- 커맨드 : 여러 가지 요소에 대한 처리를 하나의 액션으로 처리할 수 있게 하는 기법
- 데이터 바인딩 : 화면에 보이는 데이터와 웹 브라우저의 메모리 데이터를 일치시키는 기법
