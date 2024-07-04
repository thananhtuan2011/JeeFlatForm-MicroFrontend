import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from 'src/app/modules/i18n/translation.module';
import { DropdownMenusModule } from 'src/app/_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarModule } from 'ngx-avatar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartsModule } from 'ng2-charts';
import { ChatbotAIComponent } from '../chatbot-ai/chatbot-ai.component';
import { ChatbotService } from '../chatbot-ai/chatbot.service';

const MY_FORMATS_EDIT: any = {
  parse: {
    dateInput: 'D/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM Y',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Y',
  },
};

@NgModule({
  declarations: [
    ChatbotAIComponent,
  ],
  imports: [
    CommonModule,
    DropdownMenusModule,
    InlineSVGModule,
    NgApexchartsModule,
    NgbDropdownModule,
    TranslationModule,
    GridsterModule,
    DynamicModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'Chat',
        component: ChatbotAIComponent,
      },
    ]),
    MatDatepickerModule,
    NgbDatepickerModule,
    MatMenuModule,
    AvatarModule,
    MatTooltipModule,
    MatFormFieldModule,
    FormsModule,
    ChartsModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_EDIT },
    ChatbotService,
  ],
  entryComponents: [
   
  ],
})
export class IframeChatBotModule { }
