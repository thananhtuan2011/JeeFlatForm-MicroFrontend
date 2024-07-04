import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from 'src/app/modules/i18n/translation.module';
// JeeAdmin
import { AvatarModule } from 'ngx-avatar';
import { AccountInfoComponent } from './widgets/jee-account-info/jee-account-info.component';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JeeAccountService } from './services/jee-account.service';
import { ChangePasswordEditDialogComponent } from './widgets/change-password-dialog/change-password-dialog.component';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { ForgetPasswordEditDialogComponent } from './widgets/forget-password-dialog/forget-password-dialog.component';
import { NgOtpInputModule } from 'src/app/modules/components/otp-input/ng-otp-input.module';
import { TwoFactorAuthenticationDialog } from './widgets/two-factor-authentication-dialog/two-factor-authentication-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ForgetPasswordDP247EditDialogComponent } from './widgets/forget-password-dialog-dp247/forget-password-dialog-dp247.component';
const routes: Routes = [
  {
    path: '',
    component: AccountInfoComponent,
    children: [
      {
        path: '',
        component: AccountInfoComponent,
      },
    ],
  },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatRadioModule,
    MatSidenavModule,
    TranslateModule,
    MatMenuModule,
    NgbModule,
    RouterModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    AvatarModule,
    ScrollingModule,
    MatIconModule,
    FormsModule,
    InlineSVGModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    ScrollingModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgOtpInputModule,
    MatCardModule,
    MatChipsModule
  ],
  providers: [DatePipe, JeeAccountService],
  declarations: [AccountInfoComponent, ChangePasswordEditDialogComponent,
    ForgetPasswordEditDialogComponent, TwoFactorAuthenticationDialog,
    ForgetPasswordDP247EditDialogComponent],
  exports: [AccountInfoComponent, ChangePasswordEditDialogComponent,
    ForgetPasswordEditDialogComponent, TwoFactorAuthenticationDialog,
    ForgetPasswordDP247EditDialogComponent],
})
export class JeeAccountModule { }
