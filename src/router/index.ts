import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
    },
    {
        path: '/skills',
        name: 'skills',
        component: () => import('../views/SkillsView.vue'),
    },
    {
        path: '/skills/:name',
        name: 'view-skill',
        component: () => import('../views/SkillView.vue'),
        
    },
    {
        path: '/portfolio',
        name: 'portfolio',
        component: () => import('../views/PortfolioView.vue')
    },
    {
        path: '/portfolio/:name',
        name: 'portfolio-section',
        component: () => import('../views/PorfolioSectionView.vue'),
        
    },
    {
        path: '/experience',
        name: 'experience',
        component: () => import('../views/TimelineView.vue'),
    },
  ]
})

export default router
