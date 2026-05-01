import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/game-projects',
        name: 'game-projects',
        component: () => import(/* webpackChunkName: "about" */ '../views/GameProjectsView.vue')
    },
    {
        path: '/game-projects/:id',
        name: 'game-project-details',
        component: () => import(/* webpackChunkName: "game-project-details" */ '../views/GameProjectView.vue'),
        props: true
    },
    {
        path: '/3d-models',
        name: '3d-models',
        component: () => import(/* webpackChunkName: "about" */ '../views/3DModelsView.vue')
    },
    {
        path: '/3d-models/:id',
        name: '3d-model-details',
        component: () => import(/* webpackChunkName: "3d-model-details" */ '../views/3DModelView.vue'),
        props: true
    },
    {
        path: '/soundtracks',
        name: 'soundtracks',
        component: () => import(/* webpackChunkName: "about" */ '../views/SoundtracksView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router
