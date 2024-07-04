import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { JeeChooseMemberComponent } from './jee-choose-member.component';
import { TranslateModule } from '@ngx-translate/core';
import { JeeChooseMemberService } from './services/jee-choose-member.service';
import { AvatarModule } from 'ngx-avatar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
    declarations: [
        JeeChooseMemberComponent,
    ],
    imports: [CommonModule, MatChipsModule, NgxMatSelectSearchModule, InlineSVGModule, MatIconModule, MatInputModule,
        MatFormFieldModule, MatTooltipModule, FormsModule, PickerModule, TranslateModule, MatChipsModule, ReactiveFormsModule, AvatarModule,
        NgbModule, PerfectScrollbarModule,
    ],
    providers: [
        JeeChooseMemberService,
    ],
    entryComponents: [
        JeeChooseMemberComponent,
    ],
    exports: [
        JeeChooseMemberComponent,
    ],
})
export class JeeChooseMemberModule { }
