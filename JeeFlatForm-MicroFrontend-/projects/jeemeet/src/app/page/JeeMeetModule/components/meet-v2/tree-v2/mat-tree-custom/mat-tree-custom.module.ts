import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

//Cdk
import {CdkTreeModule} from '@angular/cdk/tree';

//Material Module
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';

//Component Module
import { MatTreeCustomComponent } from './mat-tree-custom.component'


@NgModule({
    declarations: [
        MatTreeCustomComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        //CDK
        CdkTreeModule,

        //Material
        MatInputModule,
        MatSelectModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatIconModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatCardModule,
        MatTreeModule,
        MatAutocompleteModule,
        MatCheckboxModule,
    ],
    providers: [],
    exports: [
        MatTreeCustomComponent
    ]
})
export class MatTreeCustomModule { }