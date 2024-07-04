import { Component, Inject, OnInit } from '@angular/core'; 
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'm-update-status-dialog-wf',
	templateUrl: './update-status-dialog-wf.component.html'
})
export class UpdateStatusWFDialogComponent implements OnInit {
	viewLoading: boolean = false;
	//yesText: string = 'Delete';
	constructor(
		public dialogRef: MatDialogRef<UpdateStatusWFDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit() {
		//if (this.data.doPositiveBtn)
			//this.yesText = this.data.doPositiveBtn;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	onYesClick(): void {
		/* Server loading imitation. Remove this */
		this.viewLoading = true;
		setTimeout(() => {
			this.dialogRef.close(true); // Keep only this row
		}, 0);
	}
}
