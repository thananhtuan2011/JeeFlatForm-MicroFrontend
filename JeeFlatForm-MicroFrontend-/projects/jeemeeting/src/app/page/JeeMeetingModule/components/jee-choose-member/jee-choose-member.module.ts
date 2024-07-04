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
import { JeeChooseMemberComponent } from './jee-choose-member.component';
import { TranslateModule } from '@ngx-translate/core'; 
import { AvatarModule } from 'ngx-avatar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'; 
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { AvatarUserMT2Component } from './avatar-user/avatar-user-mt2.component';

@NgModule({
    declarations: [
        JeeChooseMemberComponent,
        AvatarUserMT2Component
    ],
    imports: [CommonModule, MatChipsModule, NgxMatSelectSearchModule, InlineSVGModule, MatIconModule, MatInputModule,
        MatFormFieldModule, MatTooltipModule, FormsModule, TranslateModule, MatChipsModule, ReactiveFormsModule, AvatarModule,
        NgbModule, PerfectScrollbarModule,
    ],
    providers: [ 
        {
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
    ],
    entryComponents: [
        JeeChooseMemberComponent,
    ],
    exports: [
        JeeChooseMemberComponent,
        AvatarUserMT2Component
    ],
})
export class JeeChooseMemberModule { }