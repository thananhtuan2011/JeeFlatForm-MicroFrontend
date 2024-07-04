import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, HostListener, Input, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DynamicFormService } from '../../component/dynamic-form/dynamic-form.service';
import { ProcessWorkService } from '../../../services/process-work.service';
import { DanhMucChungService } from '../../../services/danhmuc.service';
import { LayoutUtilsService, MessageType } from 'projects/jeeworkflow/src/modules/crud/utils/layout-utils.service';
import { FormatTimeService } from '../../../services/jee-format-time.component';
import { FormatCSSTimeService } from '../../../services/jee-format-css-time.component';
import { DialogDecision } from '../../component/dialog-decision/dialog-decision.component';
import { ProcessWorkEditComponent } from '../../component/process-work-edit/process-work-edit.component';
import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { TokenStorage } from '../../../services/token-storage.service';
import { SocketioService } from '../../../services/socketio.service';

@Component({
	selector: 'kt-kanban-list',
	templateUrl: './kanban-list.component.html',
	styleUrls: ['./kanban-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})


export class KanBanListComponent implements OnInit {

	@Input() ID_QuyTrinh: any;
	@Input() TenQuyTrinh: any;
	@Input() WorkID: any;
	@Input() Values: any;
	Data_Header: any[] = [];
	Data_Body: any[] = [];
	weeks = [];
	connectedTo = [];
	GiaiDoanID: number = 0;
	Type: number = 0;//0: Bắt đầu, 1: Công việc, 2: Quyết định, 3: Kết quả quyết định, 4: Quy trình khác, 5: Đồng thời, 6: Kết thúc; 7: Gửi mail
	//==========Dropdown Search==============
	filter: any = {};
	isnew: boolean = false//Ẩn hiện nhấp nháy
	constructor(public _ProcessWorkService: ProcessWorkService,
		public danhMucService: DanhMucChungService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private router: Router,
		public dynamicFormService: DynamicFormService,
		public formatTimeService: FormatTimeService,
		public formatCSSTimeService: FormatCSSTimeService,
		private tokenStorage: TokenStorage,
		private socketService: SocketioService,
	) {
	}

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
		const queryParams = new QueryParamsModelNew(
			this.filterConfiguration(),
			'',
			'',
			1,
			50,
			true
		);
		this.layoutUtilsService.showWaitingDiv();
		this._ProcessWorkService.getTasksList_KanBan(queryParams).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			if (res && res.status == 1) {
				if (res.data.length > 0) {
					this.Data_Header = res.data;
					this.Data_Header.map((item, index) => {
						if (item.Data.length > 0) {
							item.Data.map((it, index) => {
								if (it.Implementer.length > 0) {
									let implementer1 = [];
									let implementer2 = [];
									it.Implementer.map((imp, index) => {
										if (index < 0) {
											implementer1.push(imp);
										} else {
											implementer2.push(imp);
										}
									})
									it.Implementer1 = implementer1;
									it.Implementer2 = implementer2;
									it.Implementer2_count = implementer2.length;
								}
							})
						}
					})
				}
				else {
					this.Data_Header = [];
				}
			} else {
				this.Data_Header = [];
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
			this.changeDetectorRefs.detectChanges();
		})
	}

	filterConfiguration(): any {
		this.filter.ProcessID = this.ID_QuyTrinh;
		return this.filter;
	}

	loadDynamic(val: any, NodeListID: number, IsNext: boolean) {
		let saveMessageTranslateParam = '';
		saveMessageTranslateParam = 'landingpagekey.thanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = MessageType.Create;
		const dialogRef = this.dialog.open(ProcessWorkEditComponent, { data: { _val: val, _type: 1, _IsNext: IsNext, _NodeListID: NodeListID }, panelClass: ['sky-padding-0', 'width600'], });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				this.Load();
			}
			else {
				this.Load();
				this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
			}
		});
	}

	//=================Cập nhật thông tin=================================
	CapNhatThongTin(item) {
		this._ProcessWorkService.Get_NodeDetail(+item.StageTasksID).subscribe(res => {
			if (res.status == 1) {
				if (res.data.DataFields.length > 0) {
					let isFlag = false;
					res.data.DataFields.map((item, index) => {
						if (item.IsFieldNode) {
							isFlag = true;
						}
					})
					if (isFlag) {
						const dialogRef = this.dialog.open(DialogDecision, { data: { _item: {}, _type: 13, _DatField: res.data.DataFields } });
						dialogRef.afterClosed().subscribe(res => {
							if (!res) {
								return;
							}
							this.Load();
						});
					} else {
						this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
					}
				} else {
					this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}

				this.changeDetectorRefs.detectChanges();
			} else {
				this.changeDetectorRefs.detectChanges();
			}
		})
	}
	//=================Xem nhiệm vụ=======================================
	ChiTietNhiemVu(th, weekItem) {
		this.tokenStorage.setID_Process(this.ID_QuyTrinh);
		if (weekItem.isNew) {
			this.updateReadMenu(weekItem.StageTasksID);
		}
		this.router.navigateByUrl(`Workflow/NhiemVu/${weekItem.TasksID}`);
	}

	GiaoViec(item) {
		let saveMessageTranslateParam = '';
		saveMessageTranslateParam = 'landingpagekey.capnhatthanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = MessageType.Create;
		const dialogRef = this.dialog.open(DialogDecision, {
			data: { _type: 1, _GiaiDoanID: item.StageTasksID, _DataThucHien: item.Implementer }
			, panelClass: ['sky-padding-0', 'width600'],

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
			this.Load();
		});
	}

	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 216;
		return tmp_height + 'px';
	}

	getWidth(): any {
		let tmp_height = 0;
		tmp_height = window.innerWidth - 100;
		return tmp_height + 'px';
	}

	//=================================================Các chức năng trong menu context=========================
	//=============================Quản lý kéo ngược================================================
	QuanLyKeoNguoc(_item: any) {
		const dialogRef = this.dialog.open(DialogDecision, { data: { _type: 6, _GiaiDoanID: _item.StageID, _OptionBackward: _item.OptionBackward, _StageBackward: _item.StageBackward } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			else {
				this.Load();
			}
		});
	}

	//===========================Chỉnh sửa thông tin giai đoạn==============================================
	ChinhSuaGiaiDoan(_item: any) {
		let dialogRef: any;
		// if (_item.NodeType == 1) {
		// 	dialogRef = this.dialog.open(ChinhSuaGiaiDoanCongViecComponent, { data: { _StageID: _item.StageID, _ProcessID: this.ID_QuyTrinh,} });
		// } else if (_item.NodeType == 2) {
		// 	dialogRef = this.dialog.open(ChinhSuaGiaiDoanQuyetDinhComponent, { data: { _StageID: _item.StageID, _ProcessID: this.ID_QuyTrinh } });
		// } else {
		// 	dialogRef = this.dialog.open(ChinhSuaGiaiDoanQuyTrinhConComponent, { data: { _StageID: _item.StageID, _ProcessID: this.ID_QuyTrinh } });
		// }
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				this.Load();
			}
			else {
				this.Load();
			}
		});
	}

	//==================================Chuyển giai đoạn==================================================
	ChuyenGiaiDoan(item, list) {
		if (list.NodeType == 2) {
			this._ProcessWorkService.Get_FieldsNode(item.StageTasksID, 0).subscribe(res => {
				if (res && res.status == 1) {
					if (res.KetQua.length > 0) {
						const dialogRef = this.dialog.open(DialogDecision, {
							data: { data: res.KetQua, _type: 0, _contentStr: res.ContentStr }

						});
						dialogRef.afterClosed().subscribe(res => {
							if (!res) {
								return;
							}
							else {
								this.loadDynamic(res._item, 0, true);
							}
						});
					}
				} else {
					this.ChinhSuaGiaiDoanNhiemVu(item, list);
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}
			})
		} else {
			this._ProcessWorkService.Get_FieldsNode(item.StageTasksID, 0).subscribe(res => {
				if (res.status == 1) {
					if (res.data.length > 0) {
						this.loadDynamic(item.StageTasksID, 0, true);
					} else {
						this.Load();
					}
				}
				else if (res.status == -1)
					this.ChinhSuaGiaiDoanNhiemVu(item, list);
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);

			})
		}
	}

	//=========================================Giao lại cho người khác=========================
	GiaoViecNguoikhac(item) {
		let saveMessageTranslateParam = '';
		saveMessageTranslateParam = 'landingpagekey.capnhatthanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = MessageType.Create;
		const dialogRef = this.dialog.open(DialogDecision, {
			data: { _type: 1, _GiaiDoanID: item.StageTasksID, _DataThucHien: item.Implementer }

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
			this.Load();
		});
	}

	//===================================Xóa nhiệm vụ====================================
	Delete(_item: any) {
		const _title = this.translate.instant('landingpagekey.xoa');
		const _description = this.translate.instant('landingpagekey.bancochacchanmuonxoakhong');
		const _waitDesciption = this.translate.instant('landingpagekey.dulieudangduocxoa');
		const _deleteMessage = this.translate.instant('landingpagekey.xoathanhcong');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this._ProcessWorkService.Delete_WorkProcess(_item.TasksID).subscribe(res => {
				if (res && res.status === 1) {
					this.Load();
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}
			});
		});
	}

	//=======================================Cập nhật thông tin nhiệm vụ=============================
	CapNhatGiaiDoan(item, val, list) {
		const _title = this.translate.instant('workprocess.capnhatnhiemvu');
		let _description: any;
		if (val == 0) {
			_description = this.translate.instant('workprocess.bancochacchanmuontamdungnhiemvu');
		}
		if (val == 1) {
			_description = this.translate.instant('workprocess.bancochacchanmuonthuchiennhiemvu');
		}
		if (val == 2) {
			_description = this.translate.instant('workprocess.bancochacchanmuonhoanthanhnhiemvu');
		}
		const _waitDesciption = this.translate.instant('workprocess.dulieudangduocxyly');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			if (val == 0) {
				const dialogRef = this.dialog.open(DialogDecision, {
					data: { _type: 2, _GiaiDoanID: item.StageTasksID }
				});
				dialogRef.afterClosed().subscribe(res => {
					if (!res) {
						return;
					}
					this.Load();
				});
			} else {
				let it = {
					ID: +item.StageTasksID,
					Status: +val,
				}
				this._ProcessWorkService.updateStatusNode(it).subscribe(res => {
					if (res && res.status == 1) {
						this.Load();
					} else if (res && res.status == 2) {
						this.ChuyenGiaiDoan(item, list);
					} else {
						this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
					}
				});
			}
		});

	}

	//============================================Xét style CSS=================================
	height: number = 1200;
	onScroll($event) {
		let _scroll = 1200;
		let _height = _scroll + $event.currentTarget.scrollTop;
		this.height = _height;
	}

	changeRoute(item) {
		this.router.navigateByUrl(
			`chi-tiet-nhiem-vu?type=2&processid=${this.ID_QuyTrinh}`
		);
	}

	//======================== Chuyển giai đoạn kéo thả kanban===================================
	previousIndex: number;

	dragStart(event: CdkDragStart, index: number) {
		this.previousIndex = index;
		event.source.dropContainer.connectedTo = event.source.dropContainer.data[index].Scope; // Đổi connec khi chọn 1 nhiệm vụ di chuyển
	}

	drop(event: CdkDragDrop<any[]>) {
		if (event.container.id != event.previousContainer.id) {
			let IsNext = false;
			//==========================Xét trường hợp chuyển giải đoạn tới lùi==================
			const obj = event.previousContainer.data[this.previousIndex].ScopeID.find(x => +x.id == +event.container.id);
			if (obj) {
				IsNext = obj.isnext;
			}
			this.GiaiDoanID = +event.previousContainer.data[this.previousIndex].StageTasksID;
			if (IsNext) {
				IsNext = true;
				this._ProcessWorkService.Get_FieldsNode(this.GiaiDoanID, +event.container.id).subscribe(res => {
					if (res.status == 1) {
						if (res.data.length > 0) {
							this.loadDynamic(this.GiaiDoanID, +event.container.id, IsNext);
						} else {
							this.Load();
						}
					}
					else if (res.status == -1) {
						let item = {
							StageTasksID: this.GiaiDoanID
						}
						this.ChinhSuaGiaiDoanNhiemVu_drop(item, this.GiaiDoanID, +event.container.id);
					}
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				})
			} else {
				IsNext = false;
				let _item = {
					NodeID: this.GiaiDoanID,
					InfoChuyenGiaiDoanData: [],
					IsNext: IsNext,
					NodeListID: +event.container.id,
				};
				this.ChuyenGiaiDoanBack(_item);
			}

		}
	}

	ChinhSuaGiaiDoanNhiemVu_drop(item, GiaiDoanID, NodeListID) {
		this._ProcessWorkService.Get_NodeDetail(+item.StageTasksID).subscribe(res => {
			if (res.status == 1) {
				if (res.data.DataFields.length > 0) {
					let isFlag = false;
					res.data.DataFields.map((item, index) => {
						if (item.IsFieldNode) {
							isFlag = true;
						}
					})
					if (isFlag) {
						const dialogRef = this.dialog.open(DialogDecision, { data: { _item: {}, _type: 13, _DatField: res.data.DataFields }, panelClass: ['sky-padding-0', 'width600'], });
						dialogRef.afterClosed().subscribe(res => {
							if (!res) {
								return;
							}
							this.ChuyenGiaiDoan_drop(GiaiDoanID, NodeListID);
						});
					} else {
						this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
					}
				} else {
					this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}

				this.changeDetectorRefs.detectChanges();
			} else {
				this.changeDetectorRefs.detectChanges();
			}
		})
	}

	ChuyenGiaiDoan_drop(GiaiDoanID, NodeListID) {
		this._ProcessWorkService.Get_FieldsNode(GiaiDoanID, NodeListID).subscribe(res => {
			if (res.status == 1) {
				if (res.data.length > 0) {
					this.loadDynamic(this.GiaiDoanID, NodeListID, true);
				} else {
					this.Load();
				}
			}
		})
	}

	ChuyenGiaiDoanBack(_item: any) {
		this.layoutUtilsService.showWaitingDiv();
		this.dynamicFormService.ChuyenGiaiDoan(_item).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				const _messageType = this.translate.instant('workprocess.chuyengiaidoanthanhcong');
				this.layoutUtilsService.showActionNotification(_messageType, MessageType.Update, 4000, true, false)
				this.Load();
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	ChinhSuaGiaiDoanNhiemVu(item, list) {
		this._ProcessWorkService.Get_NodeDetail(+item.StageTasksID).subscribe(res => {
			if (res.status == 1) {
				if (res.data.DataFields.length > 0) {
					let isFlag = false;
					res.data.DataFields.map((item, index) => {
						if (item.IsFieldNode) {
							isFlag = true;
						}
					})
					if (isFlag) {
						const dialogRef = this.dialog.open(DialogDecision, { data: { _item: {}, _type: 13, _DatField: res.data.DataFields }, panelClass: 'sky-padding-0', });
						dialogRef.afterClosed().subscribe(res => {
							if (!res) {
								return;
							}
							this.Load();
						});
					} else {
						this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
					}
				} else {
					this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}

				this.changeDetectorRefs.detectChanges();
			} else {
				this.changeDetectorRefs.detectChanges();
			}
		})
	}

	//====================================================Start code xét style css===================================================
	getBackground(val) {
		if (val.IsFinish) {
			if (val.StageID > 0) {
				return 'color-hoanthanh';
			} else {
				return 'color-thatbai';
			}

		} else {
			return 'color-giaidoan';
		}
	}
	getTitleHeader(val) {
		if (val.IsFinish) {
			if (val.StageID > 0) {
				return 'title-hoanthanh';
			} else {
				return 'title-thatbai';
			}
		} else {
			return 'title-giaidoan';
		}
	}
	getItemStatusString(status: number): string {
		switch (status) {
			case 0:
				return 'Tạm dừng';
			case 1:
				return 'Đang làm';
		}
		return 'Chưa bắt đầu';
	}
	BgTrangThai(status: number): any {
		switch (status) {
			case 0:
				return 'bg-tamdung';
			case 1:
				return 'bg-thuchien';

		}
		return 'bg-batdau';
	}
	ColorTrangThai(status: number): any {
		switch (status) {
			case 0:
				return 'cl-tamdung';
			case 1:
				return 'cl-thuchien';

		}
		return 'cl-batdau';
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
	getBackground_HeaderTask(val) {
		if (val.IsQuaHan) {
			return 'bg-quahan';
		} else {
			return 'bg-not-quahan';
		}
	}

	getColor_HeaderTask(val) {
		if (val.IsQuaHan) {
			return 'cl-quahan';
		} else {
			return 'cl-not-quahan';
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
