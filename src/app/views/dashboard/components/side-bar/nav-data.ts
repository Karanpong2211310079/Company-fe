export const navbarData = [
  {
    RouterLink: 'overviews',
    icon: 'fas fa-home',
    Label: 'Dashboard',
    roles: ['admin', 'user']  // ทุกคนเห็น
  },
  {
    RouterLink: 'employees',
    icon: 'fas fa-user-friends',
    Label: 'Employees',
    roles: ['admin', 'user']
  },
  {
    RouterLink: 'logs',
    icon: 'fas fa-clipboard-list',
    Label: 'Logs',
    roles: ['admin'] // เฉพาะ admin เห็น
  }
];
