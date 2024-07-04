
import { Observable } from 'rxjs';
// State
import { Component, Inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
// import { LayoutUtilsService, QueryParamsModel, MessageType } from '../../../../../../core/_base/crud';
// Material
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuanLyYKienGopYService } from '../_service/ql-ykien-gopy.service';
// import { QuanLyYKienGopYService } from '../-service/ql-ykien-gopy.service';


@Component({
	selector: 'kt-vote-detail',
	templateUrl: './vote-detail.component.html',
	styleUrls: ['./vote-detail.component.css']

})


export class VoteDetailComponent implements OnInit {
	selection = new SelectionModel<any>(true, []);
	datas: any[] = [];
	hasFormErrors: boolean = false;

	disabledBtn: boolean = false;
	constructor(
		public dialogRef: MatDialogRef<VoteDetailComponent>,
		private translate: TranslateService,
		public dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private service: QuanLyYKienGopYService,
		private changeDetectorRefs: ChangeDetectorRef,
	) { }



	ngOnInit() {
		if (this.data._data.IdRow > 0) {
			this.service.getListVoteByStatus(this.data._data.IdRow, this.data._data.VoteStatus).subscribe(res => {
				if (res) {
					this.datas = res.data;
					this.changeDetectorRefs.detectChanges();
				}
			})
		}

	}


	onSubmit() {

	}


	close() {
		this.dialogRef.close();

	}


}
