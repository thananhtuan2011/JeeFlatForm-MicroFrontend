import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, Input, SimpleChange, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { ProcessWorkDataSource } from '../Model/data-sources/process-work.datasource';
import { ProcessWorkModel } from '../Model/process-work.model';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ProcessWorkService } from '../../../services/process-work.service';
import { DanhMucChungService } from '../../../services/danhmuc.service';
import { LayoutUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/layout-utils.service';
import { FormatCSSTimeService } from '../../../services/jee-format-css-time.component';
import { FormatTimeService } from '../../../services/jee-format-time.component';
import { TokenStorage } from '../../../services/token-storage.service';
import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { SocketioService } from '../../../services/socketio.service';

@Component({
	selector: 'kt-task-list',
	templateUrl: './task-list.component.html',
	styleUrls: ['./task-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TaskListComponent implements OnInit {
	// Table fields
	dataSource: ProcessWorkDataSource;
	displayedColumns = ['TaskName', 'ProcessName', 'Description', 'CreatedBy', 'CreatedDate', 'DownFile', 'actions'];
	// @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	// @ViewChild(MatSort, { static: true }) sort: MatSort;
	// Filter fields
	listchucdanh: any[] = [];
	// Selection
	selection = new SelectionModel<ProcessWorkModel>(true, []);
	productsResult: ProcessWorkModel[] = [];
	showTruyCapNhanh: boolean = true;
	id_menu: number = 60679;

	//=================PageSize Table=====================
	pageSize: number;

	@Input() ID_QuyTrinh: any;
	@Input() TenQuyTrinh: any;
	@Input() WorkID: any;
	@Input() Values: any;
	//==========Dropdown Search==============
	filter: any = {};
	//=================PageSize Table=====================
	// pageEvent: PageEvent;
	// pageLength: number;
	ListData: any[] = [];
	ListData_Field: any[] = [];
	isnew: boolean = false//Ẩn hiện nhấp nháy
	constructor(public _ProcessWorkService: ProcessWorkService,
		public danhMucService: DanhMucChungService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
		private router: Router,
		public formatCSSTimeService: FormatCSSTimeService,
		public formatTimeService: FormatTimeService,
		private datePipe: DatePipe,
		private tokenStorage: TokenStorage,
		private socketService: SocketioService,
		) { }

	ngOnChanges(changes: SimpleChange) {
		if (changes['WorkID'] || changes['Values'] || changes['ID_QuyTrinh']) {
			if (changes['Values']) {
				this.filter = changes['Values'].currentValue
			}
			if (+this.ID_QuyTrinh > 0) {
				this.Load();
			}
		}
	}

	ngOnInit(): void {
		setInterval(() => {
			this.isnew = !this.isnew;
			this.changeDetectorRefs.detectChanges();
		}, 1000);
	}
	/** LOAD DATA */
	Load() {

		this.dataSource = new ProcessWorkDataSource(this._ProcessWorkService);

		this.dataSource.entitySubject.subscribe(res => this.productsResult = res);

		this.loadDataList();
	}

	loadDataList() {

		const queryParams = new QueryParamsModelNew(
			this.filterConfiguration(),
			'',
			'',
			1,
			50,
			true,
		);
		this.layoutUtilsService.showWaitingDiv();
		this._ProcessWorkService.findData(queryParams)
			.pipe(
				tap(resultFromServer => {
					this.layoutUtilsService.OffWaitingDiv();
					if (resultFromServer.status == 1) {
						if (resultFromServer.data.length > 0) {
							resultFromServer.data.map((item, index) => {
								if (item.Implementer.length > 0) {
									let implementer1 = [];
									let implementer2 = [];
									item.Implementer.map((im, index) => {
										if (index < 0) {
											implementer1.push(im);
										} else {
											implementer2.push(im);
										}
									})
									item.Implementer1 = implementer1;
									item.Implementer2 = implementer2;
									item.Implementer2_count = implementer2.length;
								}

								if (item.task_manager.length > 0) {
									let task_manager1 = [];
									let task_manager2 = [];
									item.task_manager.map((im, index) => {
										if (index < 3) {
											task_manager1.push(im);
										} else {
											task_manager2.push(im);
										}
									})
									item.task_manager1 = task_manager1;
									item.task_manager2 = task_manager2;
									item.task_manager2_count = task_manager2.length;
								}
							})
							this.ListData = resultFromServer.data;
						}
						else {
							this.ListData = [];
							this.ListData_Field = [];
						}
					}
					else {
						this.ListData = [];
						this.ListData_Field = [];
					}
					this.changeDetectorRefs.detectChanges();
				})
			).subscribe();
	}

	filterConfiguration(): any {
		this.filter.ProcessID = this.ID_QuyTrinh;
		return this.filter;
	}

	XuatFile(item: any) {
		var linkdownload = item.Link;
		window.open(linkdownload);

	}

	ChiTietNhiemVu(item) {
		this.tokenStorage.setID_Process(this.ID_QuyTrinh);
		if(item.isNew){
			this.updateReadMenu(item.StageTasksID);
		}
		this.router.navigate([`Workflow/NhiemVu/${item.TasksID}`]);
	}

	//========================================================================================================
	ClickImage(item) {
		window.open(item.link)
	}
	//=========================================Start code xét style css================================================================
	getItemStatusString(status: number): string {
		switch (status) {
			case 0:
				return 'Đang tạm dừng';
			case 1:
				return 'Đang thực hiện';
			case 2:
				return 'Hoàn thành';
		}
		return 'Chưa thực hiện';
	}
	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 181;
		return tmp_height + 'px';
	}
	count_Date(NgayTao: any, NgayHoanThanh: any) {
		if (NgayTao == "" || NgayTao == null || NgayHoanThanh == "" || NgayHoanThanh == null) {
			return "";
		}

		//Giá trị đầu vào
		let date_value = new Date(NgayTao);
		let date_now = new Date(NgayHoanThanh);

		//Convert ngày về dạng string MM/dd/yyyy
		let str_tmp1 = this.datePipe.transform(date_value, 'MM/dd/yyyy');
		let str_tmp2 = this.datePipe.transform(date_now, 'MM/dd/yyyy');

		//Part giá trị này về lại dạng ngày
		var date_tmp1 = new Date(str_tmp1);
		var date_tmp2 = new Date(str_tmp2);
		//Tính ra số ngày
		let days = (date_tmp2.getTime() - date_tmp1.getTime()) / 1000 / 60 / 60 / 24;

		let date_return = '0 ngày';

		if (days > 0) {
			date_return = days + " ngày";
		}
		return date_return;
	}

	getBackground_HeaderTask(val) {
		if (val.IsFinish == null) {
			return 'bg';
		} else {
			if (val.IsFinish) {
				return 'bg-hoanthanh';
			} else {
				return 'bg-thatbai';
			}
		}
	}

	getColor_HeaderTask(val) {
		if (val.IsFinish != null) {
			if (val.IsFinish) {
				return 'cl-hoanthanh';
			} else {
				return 'cl-thatbai';
			}
		} else {
			if (val.IsQuaHan) {
				return 'cl-quahan';
			} else {
				return 'cl-not-quahan';
			}
		}
	}

	BgGiaiDoan(status: number): any {
		switch (status) {
			case 0:
				return 'bg-tamdung';
			case 1:
				return 'bg-thuchien';
		}
		return 'bg-batdau';
	}
	ColorGiaiDoan(status: number): any {
		switch (status) {
			case 0:
				return 'cl-tamdung';
			case 1:
				return 'cl-thuchien';
		}
		return 'cl-batdau';
	}
	BgBatDau(val) {
		if (val.Status == null) {
			return 'bg';
		} else {
			return 'bg-batdau';
		}
	}
	BgHanChot(val): any {
		if ((val.Deadline == null || val.Deadline == '')) {
			return 'bg';
		} else {
			return this.formatCSSTimeService.format_convertDate(val.Deadline, 1);
		}
	}
	ColorHanChot(val): any {
		if ((val.Deadline == null || val.Deadline == '')) {
			return 'cl';
		} else {
			return this.formatCSSTimeService.format_convertDate(val.Deadline, 2);
		}
	}
	//====================================================End code xét style css===================================================
	
	//=============================Update read new ngày 08/09/2022==========
	updateReadMenu(id) {
		let _item = {
			"appCode": "WORKFLOW",
			"mainMenuID": 9,
			"subMenuID": 9,
			"itemID": id,
		}
		this.socketService.readNotification_menu(_item).subscribe(res => {
			const busEvent = new CustomEvent('event-mainmenu', {
                bubbles: true,
                detail: {
                    eventType: 'update-main',
                    customData: 'some data here'
                }
            });
            dispatchEvent(busEvent);

            const busEventSub = new CustomEvent('event-submenu', {
                bubbles: true,
                detail: {
                    eventType: 'update-sub-jeewf',
                    customData: 'some data here'
                }
            });
            dispatchEvent(busEventSub);
		})
	}
}
