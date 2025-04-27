import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    // {
    //   path: '/explore',
    //   name: 'explore',
    //   component: ExplorePage
    // },
    // {
    //   path: '/article/:id',
    //   name: 'article',
    //   component: ArticlesPage
    // },
    // {
    //   path: '/article/create',
    //   name: 'articleCreate',
    //   component: ArticleCreatePage
    // },
    // {
    //   path: '/post/:id',
    //   name: 'post',
    //   component: PostPage
    // },
    // {
    //   path: '/post/create',
    //   name: 'postCreate',
    //   component: PostCreatePage
    // },
    // {
    //   path: '/user/profile/:id',
    //   name: 'userProfile',
    //   component: UserProfilePage
    // },
    // {
    //   path: '/user/profile/edit/:id',
    //   name: 'userProfileEdit',
    //   component: UserProfileEditPage
    // },
    // {
    //   path: '/resetPassword',
    //   name: 'resetPassword',
    //   component: ResetPasswordPage
    // },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundPage
    }
  ]
});

export default router;
