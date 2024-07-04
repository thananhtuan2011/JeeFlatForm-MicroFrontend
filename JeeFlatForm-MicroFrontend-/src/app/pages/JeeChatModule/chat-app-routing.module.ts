import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatAppComponent } from './chat-app.component';

const routes: Routes = [
  {
    path: '', 
    component: ChatAppComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('jeechat/Chat').then((m) => m.JeeChatModule),
      },
    ]

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatAppRoutingModule { }
