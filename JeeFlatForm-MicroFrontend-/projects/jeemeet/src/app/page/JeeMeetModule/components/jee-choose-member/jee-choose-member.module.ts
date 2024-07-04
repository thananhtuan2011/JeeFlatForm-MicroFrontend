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
import { ChooseMemberV2Component } from './choose-menber-v2/choose-member-v2.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTreeCustomModule } from '../tree/mat-tree-custom/mat-tree-custom.module';
import { MatDropdownTreeComponentModule } from '../tree/mat-tree-dropdown/mat-dropdown-tree.module';
import { TreeMenberComponent } from './tree-menber/tree-menber.component';
import { ChooseMemberV3Component } from './choose-menber-v3/choose-member-v2.component';

@NgModule({
    declarations: [
        JeeChooseMemberComponent,
        AvatarUserMT2Component,
        ChooseMemberV2Component,
        ChooseMemberV3Component,
        TreeMenberComponent
    ],
    imports: [CommonModule, MatRadioModule, MatChipsModule, NgxMatSelectSearchModule, InlineSVGModule, MatIconModule, MatInputModule,
        MatFormFieldModule, MatTooltipModule, FormsModule, TranslateModule, MatChipsModule, ReactiveFormsModule, AvatarModule,
        NgbModule, PerfectScrollbarModule, MatDropdownTreeComponentModule, MatTreeCustomModule
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
        ChooseMemberV2Component
    ],
    exports: [
        JeeChooseMemberComponent,
        ChooseMemberV2Component,
        AvatarUserMT2Component
    ],
})
export class JeeChooseMemberModule { }
