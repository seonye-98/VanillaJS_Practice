import Dashboard from './views/Dashboard.js';
import Posts from './views/Posts.js';
import Settings from './views/Settings.js';

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
    { path: '/settings', view: Settings },
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  //매치하는 경로가 없는 경우, '/'경로에 설정된 화면 보여줌
  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }

  const view = new match.route.view();
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
