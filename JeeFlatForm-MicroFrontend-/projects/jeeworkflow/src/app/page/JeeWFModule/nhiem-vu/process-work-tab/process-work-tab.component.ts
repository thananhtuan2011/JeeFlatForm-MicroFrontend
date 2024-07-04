import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
// RXJS
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ProcessWorkModel } from '../Model/process-work.model';
import { ProcessWorkService } from '../../../services/process-work.service';
import { DanhMucChungService } from '../../../services/danhmuc.service';
import { LayoutUtilsService, MessageType } from 'projects/jeeworkflow/src/modules/crud/utils/layout-utils.service';
import { DynamicSearchFormService } from '../../component/dynamic-search-form/dynamic-search-form.service';
import { TokenStorage } from '../../../services/token-storage.service';
import { ProcessWorkEditComponent } from '../../component/process-work-edit/process-work-edit.component';
import { DialogDecision } from '../../component/dialog-decision/dialog-decision.component';

@Component({
	selector: 'kt-process-work-tab',
	templateUrl: './process-work-tab.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProcessWorkTabComponent implements OnInit {

	ListProcess: any[] = [];
	//=======================================
	ID_QuyTrinh: string = '';
	TenQuyTrinh: string = '';
	Important: boolean = false;
	WorkID: number = 0;
	Values: any;
	selectedTab: number = 0;
	//==========Dropdown Search==============
	filter: any = {};
	IsEdit: boolean = false;
	IsAdd: boolean = false;
	IsLock: boolean = false;
	IsFinish: boolean = false;

	constructor(public processWorkService: ProcessWorkService,
		private danhMucService: DanhMucChungService,
		public dialog: MatDialog,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private dynamicSearchFormService: DynamicSearchFormService,
		private tokenStorage : TokenStorage,
	) { }

	/** LOAD DATA */
	ngOnInit() {
		this.danhMucService.GetDSQuyTrinh(1).subscribe(res => {
			if (res && res.status == 1) {
				this.ListProcess = res.data;
				if (this.ListProcess.length > 0) {
					let id = this.tokenStorage.getID_Process();
					if(id && id != "" && id != "" && id != null && id != undefined){
						this.ID_QuyTrinh = '' + id;
					}else{
						this.ID_QuyTrinh = '' + res.data[0].rowid;
					}
					this.tokenStorage.setID_Process("");
					this.LoadThongTinQuyTrinh();
				} else {
					let message = "Không có dữ liệu";
					this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}
			}
			this.changeDetectorRefs.detectChanges();
		})
		if (this.processWorkService != undefined) {
			this.selectedTab = this.processWorkService.selectTab_Kanban;
		}
		let opt = {
			title: this.translate.instant("workprocess.timkiemtheotennhiemvu"),
			searchbox: 'keyword',
			controls: [{
				type: 0,
				name: 'keyword',
				placeholder: this.translate.instant("landingpagekey.tukhoa"),
			},
			{
				type: 1,
				name: 'VaiTro',
				placeholder: this.translate.instant("workprocess.vaitro"),
				api: `/controllergeneral/GetListRoles`,
				idname: 'RowID',
				titlename: 'Title'
			}, {
				type: 1,
				name: 'TrangThai',
				placeholder: this.translate.instant("workprocess.trangthai"),
				api: `/controllergeneral/getListTaskStatus`,
				idname: 'RowID',
				titlename: 'Title'
			}, {
				type: 5,
				placeholder: this.translate.instant("workprocess.hoanthanh"),
				from: {
					name: 'TuNgayHoanThanh',
				},
				to: {
					name: 'DenNgayHoanThanh',
				}
			}, {
				type: 5,
				placeholder: this.translate.instant("workprocess.hanchot"),
				from: {
					name: 'TuNgayHanChot',
				},
				to: {
					name: 'DenNgayHanChot',
				}
			}, {
				type: 5,
				placeholder: this.translate.instant("workprocess.tao"),
				from: {
					name: 'TuNgayTao',
				},
				to: {
					name: 'DenNgayTao',
				}
			}]
		}
		this.dynamicSearchFormService.setOption(opt);
		this.dynamicSearchFormService.filterResult.subscribe(value => {
			this.Values = value;
		});
	}

	changeDropDown(val) {
		this.ID_QuyTrinh = val;
		this.LoadThongTinQuyTrinh();
	}

	LoadThongTinQuyTrinh() {
		this.danhMucService.getProcessName(+this.ID_QuyTrinh).subscribe(res => {
			if (res && res.status == 1) {
				this.TenQuyTrinh = res.data[0].ProcessName;
				this.Important = res.data[0].IsImportant;
				this.IsEdit = res.data[0].IsEdit;
				this.IsAdd = res.data[0].IsAdd;
				this.IsLock = res.data[0].IsLock;
				this.IsFinish = res.data[0].IsFinish;
				this.changeDetectorRefs.detectChanges();
			} else {
				if (res.status == -1) {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				} else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}
			}
		})
	}

	goBack() {
		let _backUrl = `ProcessWork`;
		this.router.navigateByUrl(_backUrl);
	}

	Add() {
		if (this.IsFinish) {
			const ProcessWorkModels = new ProcessWorkModel();
			ProcessWorkModels.clear(); // Set all defaults fields
			this.Update(ProcessWorkModels);
		} else {
			let message = "Quy trình cần được hoàn thành thiết lập trước khi sử dụng. Vui lòng liên hệ người phụ trách để hoàn thành thiết lập quy trình.";
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
		}
	}

	Update(_item: ProcessWorkModel) {
		const dialogRef = this.dialog.open(ProcessWorkEditComponent, { data: { _item, _type: 0, _val: +this.ID_QuyTrinh }, panelClass: ['sky-padding-0', 'width700'], });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			else {
				this.WorkID = +res.WorkID;
				this.changeDetectorRefs.detectChanges();
			}
		});
	}

	onLinkClick(eventTab: MatTabChangeEvent) {
		if (eventTab.index == 0) {
			this.selectedTab = 0;
			this.processWorkService.selectTab_Kanban = 0;
		}
		else if (eventTab.index == 1) {
			this.selectedTab = 1;
			this.processWorkService.selectTab_Kanban = 1;
		} else if (eventTab.index == 2) {
			this.selectedTab = 2;
		} else if (eventTab.index == 3) {
			this.selectedTab = 3;
		} else if (eventTab.index == 4) {
			this.selectedTab = 4;
		} else {
			this.selectedTab = 5;
		}
	}

	//=============================Quản lý vị trí giai đoạn================================================
	QuanLyViTri() {
		const dialogRef = this.dialog.open(DialogDecision, {
			data: { _type: 15, _ProcessID: this.ID_QuyTrinh },
			panelClass: ['sky-padding-0', 'width600']
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			else {
				this.ngOnInit();
			}
		});
	}
}
