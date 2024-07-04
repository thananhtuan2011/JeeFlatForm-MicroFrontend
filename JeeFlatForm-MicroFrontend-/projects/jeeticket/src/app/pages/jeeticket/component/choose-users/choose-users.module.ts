import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
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
// import { JeeSearchFormService } from './jee-search-form.service';
// import { JeeSearchFormComponent } from './jee-search-form.component';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { ClickOutside2Directive } from './click-outside2.directive';
import { DropdownTreeModule } from 'dps-lib';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AvatarModule } from 'ngx-avatar';
import { ChooseUsersComponent } from './choose-users.component';

@NgModule({
//   declarations: [JeeSearchFormComponent, ClickOutside2Directive],
  declarations: [ChooseUsersComponent],
  imports: [
    MatButtonModule,
    CommonModule,
    MatChipsModule,
    NgxMatSelectSearchModule,
    InlineSVGModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule,
    PickerModule,
    TranslateModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSelectModule,
    DropdownTreeModule,
    AvatarModule,
  ],
//   providers: [JeeSearchFormService],
  providers: [],
  entryComponents: [ChooseUsersComponent],
  exports: [ChooseUsersComponent],
})
export class ChooseUsersModule {}
