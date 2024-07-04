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
    path: 'WorkV1',
    loadChildren: async () => (await import('jeework/MenuWork')).MenuWorkModule,
    data: { preload: true }
  },
  {
    path: 'Work',
    loadChildren: async () => (await import('jeeworkv1/WorkV1')).JeeWorkV1Module,
    data: { preload: true }
  },
  {
    path: 'HR',
    loadChildren: async () => (await import('jeehr/HR')).HRModule,
    data: { preload: true }
  },
  {
    path: 'Calendar',
    loadChildren: () =>
      import('jeehr/Calendar').then((m) => m.LichDangKyModule),
    data: { preload: true }
  },
  {
    path: 'Admin',
    loadChildren: async () => (await import('jeeadmin/Module')).JeeAdminModule,
    data: { preload: true }
  },
  {
    path: 'Chat',
    loadChildren: () =>
      import('./JeeChatModule/chat-app.module').then((m) => m.ChatAppModule),
    data: { preload: true }
  },
  {
    path: 'Group',
    loadChildren: () =>
      import('jeeteam/Group').then((m) => m.JeeTeamModule),
    data: { preload: true }
  },
  {
    path: 'Ticket',
    loadChildren: () =>
      import('jeeticket/Ticket').then((m) => m.JeeTicketModule),
    data: { preload: true }
  },
  {
    path: 'Support',
    loadChildren: () =>
      import('jeesupport/Support').then((m) => m.JeeSupportModule),
    data: { preload: true }
  },
  {
    path: 'Workflow',
    loadChildren: () =>
      import('jeeworkflow/Workflow').then((m) => m.JeeWFModule),
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
    path: 'Request',
    loadChildren: () =>
      import('jeerequest/Request').then((m) => m.JeeRequestModule),
    data: { preload: true }
  },
  {
    path: 'Meeting',
    loadChildren: () =>
      import('jeemeeting/Meeting').then((m) => m.JeeMeetingModule),
    data: { preload: true }
  },
  {
    path: 'Meet',
    loadChildren: () =>
      import('jeemeet/Meet').then((m) => m.JeeMeetModule),
    data: { preload: true }
  },
  {
    path: 'Guide',
    loadChildren: () =>
      import('./tour-guide/guide-admin/guide-admin.module').then((m) => m.GuideAdminModule),
  },
  {
    path: 'ThongTinCaNhan',
    loadChildren: () => import('./JeeAccount/jee-account.module').then((m) => m.JeeAccountModule),
  },
  {
    path: 'Config-System',
    loadChildren: () =>
      import('./tour-guide/guide-system/guide-system.module').then((m) => m.GuideSystemModule),
  },
  {
    path: 'WizardHR',
    loadChildren: () =>
      import('wizardplatform/WizardHR').then((m) => m.WizardHRModule),
    data: { preload: true }
  },
  {
    path: 'WizardTicket',
    loadChildren: () =>
      import('wizardplatform/WizardTicket').then((m) => m.WizardTicketModule),
    data: { preload: true }
  },
  {
    path: 'WizardWork',
    loadChildren: () =>
      import('wizardplatform/WizardWork').then((m) => m.WizardWorkModule),
    data: { preload: true }
  },
  {
    path: 'WizardSale',
    loadChildren: () =>
      import('wizardplatform/WizardSale').then((m) => m.WizardSaleModule),
    data: { preload: true }
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
