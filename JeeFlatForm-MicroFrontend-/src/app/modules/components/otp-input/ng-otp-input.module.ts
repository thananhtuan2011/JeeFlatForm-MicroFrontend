import { NgModule } from '@angular/core';
import { KeysPipe } from './pipes/keys.pipe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgOtpInputComponent } from './ng-otp-input/ng-otp-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [NgOtpInputComponent, KeysPipe],
  exports: [NgOtpInputComponent],
  providers: [KeysPipe]
})
export class NgOtpInputModule { }
