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
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'ngx-avatar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AvatarUserDeptComponent } from './avatar-user-dept.component';

@NgModule({
    declarations: [
      AvatarUserDeptComponent,
    ],
    imports: [CommonModule, MatChipsModule, NgxMatSelectSearchModule, InlineSVGModule, MatIconModule, MatInputModule,
        MatFormFieldModule, MatTooltipModule, FormsModule, TranslateModule, MatChipsModule, ReactiveFormsModule, AvatarModule,
        NgbModule, PerfectScrollbarModule,
    ],
    providers: [
    ],
    entryComponents: [
      AvatarUserDeptComponent,
    ],
    exports: [
      AvatarUserDeptComponent,
    ],
})
export class AvatarUserDeptModule { }
