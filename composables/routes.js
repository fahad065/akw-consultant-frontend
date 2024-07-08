export const items = useState('routes', () =>
  ref([
    {
      title: 'Dashboard',
      route: '/dashboard',
      color: '#AE3EC9',
      key: 'dashboard',
      permissions: ['read', 'write']
    },
    {
      title: 'Forms',
      route: '/forms',
      color: '#AE3EC9',
      key: 'dashboard',
      permissions: ['read', 'write']
    },
  ])
);
