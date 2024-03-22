import NProgress from 'nprogress';
NProgress.configure({
  easing: 'ease',
  speed: 200,
  showSpinner: false,
  trickle: 0.02,
  trickleSpeed: 400
});

export default (router) => {
  router.beforeEach((to, from, next) => {
    NProgress.start();
    next();
  });

  router.afterEach(NProgress.done);
};
