import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import UserProfilePage from '@/pages/user/UserProfilePage.vue';
import EditProfilePage from '@/pages/user/EditProfilePage.vue';
import ExplorePage from '@/pages/ExplorePage.vue';
import PostDetailPage from '@/pages/post/PostDetailPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/explore',
      name: 'explore',
      component: ExplorePage
    },
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
    {
      path: '/post/:id',
      name: 'post',
      component: PostDetailPage
    },
    {
      path: '/user/profile/:id',
      name: 'userProfile',
      component: UserProfilePage
    },
    {
      path: '/user/profile/edit/:id',
      name: 'userProfileEdit',
      component: EditProfilePage
    },
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
