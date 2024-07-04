import { NgModule } from '@angular/core';
import { MatDropdownTreeComponentComponent } from './mat-dropdown-tree.component';

/** Form Module */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/** CDK Module */
import { CdkTreeModule } from '@angular/cdk/tree';
import { ScrollingModule } from '@angular/cdk/scrolling';

/** Material Module */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    MatDropdownTreeComponentComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CdkTreeModule,
    ScrollingModule,

    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTreeModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    MatDropdownTreeComponentComponent
  ]
})
export class MatDropdownTreeV2ComponentModule { }
