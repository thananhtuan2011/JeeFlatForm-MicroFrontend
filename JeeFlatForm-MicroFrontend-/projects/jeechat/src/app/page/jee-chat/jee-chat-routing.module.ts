import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailChatComponent } from './component/detail-chat/detail-chat.component';
import { MychatContactComponent } from './component/mychat-contact/mychat-contact.component';
import { SliderMessageComponent } from './component/slider-message/slider-message.component';
import { ChatbotAIComponent } from './component/chatbot-ai/chatbot-ai.component';


const routes: Routes = [
  {
    path: '',
    component: MychatContactComponent,
    children: [
      { path: '', component: SliderMessageComponent },
      {
        path: 'Messages/:id/:idchat',
        component: DetailChatComponent,

      },
      { path: 'chatbot', component: ChatbotAIComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JeeChatRoutingModule { }
