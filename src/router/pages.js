export default [
  {
    path: '/node',
    name: 'node',
    component: () => import('@/views/node.vue'),
  },
  {
    path: '/node/:n_id',
    name: 'sensor',
    component: () => import('@/views/sensor.vue'),
  },
  {
    path: '/node/:n_id/sensor/:s_id',
    name: 'detail',
    component: () => import('@/views/detail.vue'),
  },
]
