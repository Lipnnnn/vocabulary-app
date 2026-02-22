import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Level4View from '../views/Level4View.vue'
import Level6View from '../views/Level6View.vue'
import IeltsView from '../views/IeltsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/level4',
      name: 'level4',
      component: Level4View
    },
    {
      path: '/level6',
      name: 'level6',
      component: Level6View
    },
    {
      path: '/ielts',
      name: 'ielts',
      component: IeltsView
    }
  ]
})

export default router
