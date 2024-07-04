import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownStructControlComponent } from './dropdown-struct-control.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CdkTreeModule } from '@angular/cdk/tree';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownStructControlService } from './Services/dropdown-struct-control.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		MatInputModule,
		MatIconModule,
		MatTooltipModule,
		MatTreeModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		NgbModule,
		CdkTreeModule
	],
	providers: [
		DropdownStructControlService
	],
	entryComponents: [
		DropdownStructControlComponent
	],
	declarations: [
		DropdownStructControlComponent
	],
	exports: [
		DropdownStructControlComponent
	]
})
export class DropdownStructControlAddModule { }
