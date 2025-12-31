import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
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
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/GameProjectsView.vue')
    },
    {
        path: '/game-projects/:id',
        name: 'game-project-details',
        component: () => import(/* webpackChunkName: "game-project-details" */ '../views/GameProjectView.vue'),
        props: true, // Passa il parametro "id" come prop al componente
    },
    {
        path: '/3d-models',
        name: '3d-models',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/3DModelsView.vue')
    },
    {
        path: '/3d-models/:id',
        name: '3d-model-details',
        component: () => import(/* webpackChunkName: "3d-model-details" */ '../views/3DModelView.vue'),
        props: true, // Passa il parametro "id" come prop al componente
    },
    {
        path: '/soundtracks',
        name: 'soundtracks',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/SoundtracksView.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
