import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, HostListener, Input, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
// Services
// Models
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService } from 'src/app/modules/crud/utils/layout-utils.service';
import { ProcessWorkService } from '../../../services/process-work.service';



@Component({
	selector: 'kt-thanh-vien-list',
	templateUrl: './thanh-vien-list.component.html',
	styleUrls: ['./thanh-vien-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})


export class ThanhVienListComponent {

	@Input() ID_QuyTrinh: any;
	@Input() TenQuyTrinh: any;
	ListData: any[] = [];
	
	constructor(public _ProcessWorkService: ProcessWorkService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
		private router: Router,) {
	}

	ngOnChanges(changes: SimpleChange) {
		if (changes['ID_QuyTrinh']) {
			this.Load();
		}
	}
	/** LOAD DATA */
	Load() {
		this.loadDataList();
	}

	loadDataList() {

		// this.layoutUtilsService.showWaitingDiv();
		this._ProcessWorkService.getListThanhVien(this.ID_QuyTrinh)
			.pipe(
				tap(resultFromServer => {
					// this.layoutUtilsService.OffWaitingDiv();
					if (resultFromServer.status == 1) {
						if (resultFromServer.data.length > 0) {
							this.ListData = resultFromServer.data;
						}
						else {
							this.ListData = [];
						}
					}
					else {
						this.ListData = [];
					}
					this.changeDetectorRefs.detectChanges();
				})
			).subscribe();;
	}

	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 481;
		return tmp_height + 'px';
	}
}
