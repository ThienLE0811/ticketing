/**
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/auth',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/auth/login',
        component: './Auth/Login',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    component: './Dashboard',
  },
  {
    name: 'Ticket',
    icon: 'audit',
    path: '/ticket',
    component: './Ticket',
  },
  {
    name: 'FAQ',
    icon: 'hdd',
    path: '/knowledge',
    component: './Knowledge',
  },
  {
    name: 'Group',
    icon: 'partition',
    path: '/system/group',
    component: './Group',
  },
  {
    name: 'User',
    icon: 'user',
    path: '/system/user',
    component: './User',
  },
  {
    name: 'SLA',
    icon: 'FieldTimeOutlined',
    path: '/system/sla-setting',
    component: './SLA',
  },
  {
    name: 'Email',
    icon: 'MailOutlined',
    path: '/system/email',
    component: './Email',
  },
  {
    name: 'MDM',
    icon: 'TableOutlined',
    path: '/system/mdm',
    component: './MDM',
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '*',
    component: './404',
  },
];
