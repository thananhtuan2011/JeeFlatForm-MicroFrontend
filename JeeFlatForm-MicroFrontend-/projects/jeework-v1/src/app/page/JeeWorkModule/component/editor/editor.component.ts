import { Component, OnInit, Inject, ChangeDetectionStrategy, HostListener, ViewChild, ElementRef, ChangeDetectorRef, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tinyMCE } from '../Jee-Work/tinyMCE';
@Component({
	selector: 'kt-editor',
	templateUrl: './editor.component.html',
})
export class EditorGeneralComponent implements OnInit {
	item: any;
	oldItem: any
	itemForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	@ViewChild("focusInput", { static: true }) focusInput: ElementRef;
	disabledBtn: boolean = false;
	selectedTab: number = 0;

	Value: string;
	tinyMCE = {};
	public editorStyles1 = {
        'min-height': '400px',
        'max-height': '400px',
        'height': '100%',
        'font-size': '12pt',
        'overflow-y': 'auto',
        'padding-bottom': '3%',
    };
	constructor(
		public dialogRef: MatDialogRef<EditorGeneralComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		public dialog: MatDialog,) { }
	/** LOAD DATA */

	ngOnInit() {
		this.Value = this.data._value;
	}

	/** ACTIONS */

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		this.dialogRef.close({
			_result: this.Value,
		});
	}

	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
			this.onSubmit(false);
		}
	}

	goBack() {
		this.dialogRef.close();
	}
}
