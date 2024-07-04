import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthComponent } from './auth.component';
import { TranslationModule } from '../i18n/translation.module';
import { ForgotPasswordNewComponent } from './forgot-password-new/forgot-password-new.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { TranslateModule } from '@ngx-translate/core';
import { JeeAccountModule } from 'src/app/pages/JeeAccount/jee-account.module';
import { ForgotPasswordCancelComponent } from './forgot-password-cancel/forgot-password-cancel.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ForgotPasswordDP247Component } from './forgot-password-dp247/forgot-password-dp247.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    ForgotPasswordNewComponent,
    LogoutComponent,
    AuthComponent,
    ForgotPasswordCancelComponent,
    ForgotPasswordDP247Component,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule,
    TranslateModule,
    JeeAccountModule,
  ],
  providers: [{
    provide: DeviceDetectorService,
  }]
})
export class AuthModule { }
