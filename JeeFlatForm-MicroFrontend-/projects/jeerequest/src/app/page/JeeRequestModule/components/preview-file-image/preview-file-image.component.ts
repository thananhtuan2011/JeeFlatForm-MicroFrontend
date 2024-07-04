

import {
	ActivatedRoute,
	Router,
	RouterLinkActive,
	Scroll,
} from "@angular/router";
import { filter } from "rxjs/operators";
import { ViewportScroller } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
	selector: "kt-preview-file-image",
	templateUrl: "./preview-file-image.component.html"
})
export class PreviewFileImageYeuCauComponent implements OnInit{
	viewer = 'url';
	doc = '';
	type = ''
	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
	 * @param store: Store<AppState>
	 */
	constructor(
		public dialogRef: MatDialogRef<PreviewFileImageYeuCauComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any, 
	) {
	}
	ngOnInit():void {
		this.type = this.data._item.type;
		this.doc = this.data._item.src;
	}

}