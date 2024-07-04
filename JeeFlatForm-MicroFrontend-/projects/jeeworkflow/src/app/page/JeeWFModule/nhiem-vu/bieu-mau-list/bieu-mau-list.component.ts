import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, HostListener, Input, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import Exporting from 'highcharts/modules/exporting';
import funnel from 'highcharts/modules/funnel';
import Highcharts from 'highcharts';
import { TemplateModel } from '../Model/process-work.model';
import { BieuMauDialogComponent } from '../bieu-mau-dialog/bieu-mau-dialog.component';
import { ProcessWorkService } from '../../../services/process-work.service';
import { LayoutUtilsService, MessageType } from 'projects/jeeworkflow/src/modules/crud/utils/layout-utils.service';
import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';

Exporting(Highcharts);
funnel(Highcharts);

@Component({
	selector: 'kt-bieu-mau-list',
	templateUrl: './bieu-mau-list.component.html',
	styleUrls: ['./bieu-mau-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})


export class BieuMauListComponent {

	@Input() ID_QuyTrinh: any;
	@Input() TenQuyTrinh: any;
	ListData: any[] = [];

	date = new Date();
	range = new FormGroup({
		start: new FormControl(new Date(this.date.getFullYear(), this.date.getMonth(), 1)),
		end: new FormControl(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0))
	});

	constructor(public _ProcessWorkService: ProcessWorkService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private router: Router,) {
	}

	ngOnChanges(changes: SimpleChange) {
		if (changes['ID_QuyTrinh']) {
			this.Load();
		}
	}
	/** LOAD DATA */
	async Load() {
		await this.ListTemplate();
	}

	filter(): any {
		const filter: any = {};
		filter.ProcessID = this.ID_QuyTrinh;
		return filter;
	}

	//==========================Start Thời gian hoàn thành========================
	listTemplate: any[] = [];

	async ListTemplate() {
		const queryParams = new QueryParamsModelNew(
			this.filter(),
		);
		this._ProcessWorkService.Get_DSTemplate(queryParams).subscribe(res => {
			if (res && res.status == 1) {
				if (res.data.length > 0) {
					this.listTemplate = res.data;
				} else {
					this.listTemplate = [];
				}
			}
			this.changeDetectorRefs.detectChanges();
		});
	}

	Add() {
		const ProcessTypeModels = new TemplateModel();
		ProcessTypeModels.clear(); // Set all defaults fields
		this.Update(ProcessTypeModels);
	}

	Update(_item: TemplateModel) {
		let saveMessageTranslateParam = '';
		saveMessageTranslateParam += _item.RowID > 0 ? 'landingpagekey.capnhatthanhcong' : 'landingpagekey.themthanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = _item.RowID > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(BieuMauDialogComponent, { data: { _item, _ID_QuyTrinh: this.ID_QuyTrinh }, panelClass: ['sky-padding-0', 'width600'], });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				this.Load();
			}
			else {
				this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
				this.Load();
			}
		});
	}

	Delete(_item: TemplateModel) {
		const _title = this.translate.instant('landingpagekey.xoa');
		const _description = this.translate.instant('landingpagekey.bancochacchanmuonxoakhong');
		const _waitDesciption = this.translate.instant('landingpagekey.dulieudangduocxoa');
		const _deleteMessage = this.translate.instant('landingpagekey.xoathanhcong');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this._ProcessWorkService.Delete_Template(_item.RowID).subscribe(res => {
				if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}
				this.Load();
			});
		});
	}

	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 181;
		return tmp_height + 'px';
	}
}
