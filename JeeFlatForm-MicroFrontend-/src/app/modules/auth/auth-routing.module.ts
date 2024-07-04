import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ForgotPasswordNewComponent } from './forgot-password-new/forgot-password-new.component';
import { ForgotPasswordCancelComponent } from './forgot-password-cancel/forgot-password-cancel.component';
import { ForgotPasswordDP247Component } from './forgot-password-dp247/forgot-password-dp247.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { returnUrl: window.location.pathname },
      },
      {
        path: 'registration',
        component: RegistrationComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordNewComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'forgot-password/cancel',
        component: ForgotPasswordCancelComponent,
      },
      {
        path: 'forgot/password',
        component: ForgotPasswordDP247Component,
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
