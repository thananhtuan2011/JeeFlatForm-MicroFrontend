import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, merge, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Models
import { MatDialog } from '@angular/material/dialog';
import { TemplateDashboardDataSource } from '../Model/data-sources/template-dashboard.datasource';
import { TemplateDashboardService } from '../Services/template-dashboard.service';
import { TemplateDashboardModel } from '../Model/template-dashboard.model';
import { TemplateDashboardEditComponent } from '../template-dashboard-edit/template-dashboard-edit.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { QueryParamsModel } from 'src/app/modules/auth/models/query-params.model';

@Component({
	selector: 'kt-template-dashboard-list',
	templateUrl: './template-dashboard-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TemplateDashboardListComponent implements OnInit {
	// Table fields
	dataSource: TemplateDashboardDataSource;
	displayedColumns = ['title', 'nguoicapnhat', 'ngaycapnhat', 'actions'];
	// Filter fields
	productsResult: any[] = [];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
	//=================PageSize Table=====================
	pageSize: number;
	constructor(public _TemplateDashboardService: TemplateDashboardService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
	) { }

	/** LOAD DATA */
	ngOnInit() {
		this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => {
                    this.loadDataList();
                })
            )
            .subscribe();
		this.dataSource = new TemplateDashboardDataSource(this._TemplateDashboardService);
		this.dataSource.entitySubject.subscribe(res => this.productsResult = res);
		this.loadDataList();
	}

	loadDataList() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
            this.sort.active,
            this.paginator.pageIndex,
            this.paginator.pageSize
		);
		this.dataSource.loadList(queryParams);
	}
	loadPage() {
		var arrayData = [];
		this.dataSource.entitySubject.subscribe(res => arrayData = res);
		if (arrayData !== undefined && arrayData.length == 0) {
			var totalRecord = 0;
			this.dataSource.paginatorTotal$.subscribe(tt => totalRecord = tt)
			if (totalRecord > 0) {
				const queryParams1 = new QueryParamsModel(
					this.filterConfiguration(),
					this.sort.direction,
                    this.sort.active,
                    this.paginator.pageIndex = this.paginator.pageIndex - 1,
                    this.paginator.pageSize
				);
				this.dataSource.loadList(queryParams1);
			}
			else {
				const queryParams1 = new QueryParamsModel(
					this.filterConfiguration(),
					this.sort.direction,
                    this.sort.active,
                    this.paginator.pageIndex = 0,
                    this.paginator.pageSize
				);
				this.dataSource.loadList(queryParams1);
			}
		}
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}


	/** Delete */
	Delete(_item: any) {
		const _title = this.translate.instant('GeneralKey.xoa');
		const _description = this.translate.instant('GeneralKey.bancochacchanmuonxoakhong');
		const _waitDesciption = this.translate.instant('GeneralKey.dulieudangduocxoa');
		const _deleteMessage = this.translate.instant('GeneralKey.xoathanhcong');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this._TemplateDashboardService.Delete_Template(_item.RowID).subscribe(res => {
				if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}
				this.loadDataList();
			});
		});
	}

	Add() {
		const TemplateDashboardModels = new TemplateDashboardModel();
		TemplateDashboardModels.clear();
		this.Update(TemplateDashboardModels);
	}

	Update(_item: TemplateDashboardModel) {
		let saveMessageTranslateParam = '';
		saveMessageTranslateParam += _item.RowID > 0 ? 'GeneralKey.capnhatthanhcong' : 'GeneralKey.themthanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = _item.RowID > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(TemplateDashboardEditComponent, { data: { _item }, panelClass: 'no-padding', });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				this.loadDataList();
			}
			else {
				this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
				this.loadDataList();
			}
		});
	}

	paginate() {
		this.loadDataList();
	}

	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 120;
		return tmp_height + 'px';
	}
}
