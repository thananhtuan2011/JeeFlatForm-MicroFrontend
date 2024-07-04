import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: '',
    redirectTo: '/Dashboard',
    pathMatch: 'full',
  },
  //=============================================================================
  {
    path: 'Dashboard',
    loadChildren: () =>
      import('./JeeDashboard/page-girdters-dashboard/page-girdters-dashboard.module').then((m) => m.PageGirdtersDashboardModule),
    data: { preload: true }
  },
  {
    path: 'WorkV2',
    loadChildren: async () => (await import('jeework/MenuWork')).MenuWorkModule,
    data: { preload: true }
  },
  {
    path: 'Iframe',
    loadChildren: () =>
      import('./JeeIfram/iframe/iframe.module').then((m) => m.IframeModule),
    data: { preload: true }
  },
  {
    path: 'IframeSupport',
    loadChildren: () =>
      import('./JeeIfram/chatbot-ai/chat-bot.module').then((m) => m.IframeChatBotModule),
    data: { preload: true }
  },
  {
    path: 'Meet',
    loadChildren: () =>
      import('jeemeet/Meet').then((m) => m.JeeMeetModule),
    data: { preload: true }
  },
  {
    path: 'ThongTinCaNhan',
    loadChildren: () => import('./JeeAccount/jee-account.module').then((m) => m.JeeAccountModule),
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
