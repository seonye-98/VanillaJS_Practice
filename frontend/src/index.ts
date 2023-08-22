import AbstractView from './views/AbstractView.js';
import Dashboard from './views/Dashboard.js';
import Posts from './views/Posts.js';
import PostView from './views/PostView.js';
import Settings from './views/Settings.js';

interface IMatch {
  route: {
    path: string;
    view: new (params: Record<string, string>) => AbstractView;
  };

  result: string[] | null;
}

const pathToRegex = (path: string) => new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');

const getParams = (match: IMatch) => {
  if (match.result !== null) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result) => result[1]);
    //다차원 배열 -> 객체
    return Object.fromEntries(
      keys.map((key, i) => {
        return [key, values[i]];
      })
    );
  }
  return {};
};

const navigateTo = (url: string) => {
  history.pushState(null, 'null', url);
  router();
};
//클라이언트 측 라우터 작성
//비동기로 작성되는 이유?
//실제로 페이지를 렌더링하거나 표시하기 전에 일부 설정을 가져오기 위해 서버측에 비동기 요청을 만들고 싶을 수 있기 때문

const router = async () => {
  const routes = [
    { path: '/', view: Dashboard },
    { path: '/posts', view: Posts },
    { path: '/posts/:id', view: PostView },
    { path: '/settings', view: Settings },
  ];

  const potentialMatches: IMatch[] = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match: IMatch | undefined = potentialMatches.find((potentialMatch) => potentialMatch.result !== null);

  //매치하는 경로가 없는 경우, '/'경로에 설정된 화면 보여줌
  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }
  //getParams(match)
  const view = new match.route.view(getParams(match));
  const appElement = document.querySelector('#app');
  if (appElement instanceof Element) {
    appElement.innerHTML = await view.getHtml();
  }
};

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e: MouseEvent) => {
    if (e.target && (e.target as HTMLElement).matches('[data-link]')) {
      e.preventDefault(); //페이지 새로고침 방지
      navigateTo((e.target as HTMLAnchorElement).href);
    }
  });
  router();
});
