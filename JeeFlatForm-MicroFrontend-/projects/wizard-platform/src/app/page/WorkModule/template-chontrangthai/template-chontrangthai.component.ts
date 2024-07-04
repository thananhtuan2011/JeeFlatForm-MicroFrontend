import { Component, OnInit, Inject, ChangeDetectionStrategy, HostListener, ChangeDetectorRef, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, from, of, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { WorkwizardChungService } from '../work.service';
import { StatusModel } from '../status-dynamic-dialog/status-dynamic-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { QueryParamsModel } from '../../models/query-models/query-params.model';
import { Different_StatusesModel, GroupModel, ListPositionModelBasic, MapModel, PositionModelBasic, StatusModel1 } from '../model/danh-muc-du-an.model';
import { StatusDynamicModel } from '../view-config-status/view-config-status.component';

@Component({
	selector: 'app-template-chontrangthai',
	templateUrl: './template-chontrangthai.component.html',
	styleUrls: ['./template-chontrangthai.component.scss']
})
export class TemplateChonTrangThaiComponent implements OnInit {
	isInput: boolean=false;

	constructor(
		public dialogRef: MatDialogRef<TemplateChonTrangThaiComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private changeDetectorRefs: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		public _WorkwizardChungService: WorkwizardChungService,

	) {
	}
	litsTemplateDemo: any = [];
	listSTT: any = [];
	listStatus: any = [];
	TempSelected = 0;
	isChose = false;
	defaultColors = this._WorkwizardChungService.defaultColors;
	isDoinguoi = false;
	// isStatusNow = true;

	idfocus = 0;
	isAddTemplate = false;
	isAddStatusNew = false;
	isAddStatusDeadline = false;
	isAddStatusDone = false;
	updateTemp = 0;
	isAddStatus = false;
	IsSave = false;
	disabledBtn: boolean = false;
	isShow: boolean = true;
	isHeThong: boolean = false;
	id_department;
	_update: boolean= false;
	Category=[
		'Hệ thống',
		'Phòng ban',
		'Dự án'
	];
	@Output() selectStatus = new EventEmitter<any>();
	@Output() refreshTemplate = new EventEmitter<any>();
	@Input() dataInput :any;
	ngOnInit() {
		this._WorkwizardChungService.getthamso();
		if (this.dataInput) {
			this.data=this.dataInput;
			this.isInput=true;
			this.listSTT=this.data.listSTT;
		}

		// 
		this.id_department = this.data._item.id_department?this.data._item.id_department:0;
		this.TempSelected = this.data._item.id_template > 0 ? this.data._item.id_template : 0;
		this.TempSelectedItem=this.data._item;
		if (this.dataInput) {
			this.TempSelectedItem=this.data.item.find(t=>t.id_row==this.data._item.id_template);
		}

		if (this.TempSelected === 0) {
			this.isAddTemplate = true;
		}
		if (this.data.hethong) {
			this.isHeThong = this.data.hethong;			
		}
		this.LoadDataTemp();		
	}
	drop(event: CdkDragDrop<StatusModel[]>, list) {
		moveItemInArray(list, event.previousIndex, event.currentIndex);
		let t = this._listSTTMoitao.concat(this._listSTTHoatDong, this._listSTTDeadline, this._listSTTFinal);
		var listModel = new ListPositionModelBasic();
		listModel.clear();
		let position = 1;
		t.forEach(item => {
			var model = new PositionModelBasic();
			model.clear();
			model.position = position;
			model.id_row = item.id_row;
			listModel.data.push(model);
			position++;
		});


		this.updateAllPosition(listModel);

	}
	TempSelectedItem:any;
	checkIsEdit(){
		if (this.TempSelectedItem.isEdit!=0) {
			return true;
		
		}
		return false;
	}
	returnMaxHeight(){
		if (this.isInput) {
			return 'unset';
		}
		return ' max-height: 460px !important;';
	}

	updateAllPosition(_item) {
		_item.id_group=this.TempSelected;
		this._WorkwizardChungService.updateAllPosition(_item).subscribe((res) => {
			if (res && res.status == 1) {
				this._update = true;
				this.LoadDataTemp();
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	LoadDataTemp() {

		this.layoutUtilsService.showWaitingDiv();
		let filter: any = {};
		
		if(this.id_department){
			filter.type = 4;
			filter.id_department = this.id_department;
		}
		else if(this.data._item.id_project_team){
			filter.type = 3;
			filter.id_project_team = this.data._item.id_project_team;
		}
		else {
			filter.type = 5;
		}
		let model = new QueryParamsModel(
			filter
		)

		this._WorkwizardChungService.ListStatusById_2023(model).subscribe((res) => {
			this.layoutUtilsService.OffWaitingDiv();
			if (res && res.status === 1) {
				this.litsTemplateDemo = res.data;
				if (
					this.TempSelected == 0 ||
					!this.litsTemplateDemo.find((x) => x.id_row == this.TempSelected)
				) {
					this.TempSelected = this.litsTemplateDemo[0].id_row;
					this.TempSelectedItem=this.litsTemplateDemo[0];
					this._isSystem = this.litsTemplateDemo[0].IsSystem;
				}
				for (let index = 0; index < this.litsTemplateDemo.length; index++) {
					const element = this.litsTemplateDemo[index];
					element.ListStatus=element.Status;
				  }
				this.LoadListSTT();
				this.changeDetectorRefs.detectChanges();
			}
		});
	}
	filterConfiguration(): any {
		let filter: any = {};
		if(this.id_department){
			filter.type = 4;
			filter.id_department = this.id_department;
		}
		else if(this.data._item.id_project_team) {
			filter.type = 3;
			filter.id_project_team = this.data._item.id_project_team;
		}
		else {
			filter.type = 5;
		}
		return filter;
	}



	LoadListSTT() {
		let x = this.litsTemplateDemo.find((x) => x.id_row == this.TempSelected);
		if (x) {
			this.listSTT = x.Status;
			this._isSystem = x.IsSystem;
			this.GetAllListSTT();
		}
	}

	GetAllListSTT(){
		this._listSTTHoatDong = this.GetListSTT(2);
		this._listSTTMoitao = this.GetListSTT(1);
		this._listSTTDeadline = this.GetListSTT(3);
		this._listSTTFinal = this.GetListSTT(4);
	}

	_listSTTHoatDong: StatusModel1[]=[];
	_listSTTMoitao: StatusModel1[]=[];
	_listSTTDeadline: StatusModel1[]=[];
	_listSTTFinal: StatusModel1[]=[];

	GetListSTT(type){
		let array: StatusModel1[]=[];
		let t = this.listSTT.filter(x => x.Type == type);
		t.forEach(element => {
			let n : StatusModel1 = new StatusModel1();
			n.clear();
			n.StatusName = element.StatusName;
			n.Type = element.Type;
			n.color = element.color;
			n.id_row = element.id_row;
			n.title = element.title;
			n.IsDefault = element.is_default;
			n.Position = element.position;
			array.push(n);
		});
		array.sort((a,b)=>a.Position  - b.Position );
		return array;
	}
	listSTTHoatdong() {

		// this._listSTTHoatDong = this.listSTT.filter(x => x.Type == 2);
		return this._listSTTHoatDong;
	}

	listSTTMoitao() {
		return this.listSTT.filter(x => x.Type == 1);
	}

	listSTTDeadline() {
		return this.listSTT.filter(x => x.Type == 3);
	}

	listSTTFinal() {
		return this.listSTT.filter(x => x.Type == 4);
	}

	LoadStatusDuan() {
		
	}

	LoadNewvalue(viewid) {
		let x = this.listSTT.find((x) => x.StatusID == viewid);
		if (x) {
			return x;
		} else {
			return {
				color: 'pink',
				StatusName: 'Chọn trạng thái mới',
			};
		}
	}

	LuuThayDoi() {
		if (this.data._item.columnname === 'id_project_team') {
			this.IsSave = true;
		} else {
		}
	}

	Doistt(item, stt) {
		item.colornew = stt.color;
		item.newtitle = stt.StatusName;
	}

	HoanthanhUpdate() {
		const _item = new Different_StatusesModel();
		_item.clear();
		_item.id_project_team = this.data._item.id_row;
		_item.IsMapAll = !this.isChose;
		_item.TemplateID_New = this.TempSelected;
		let error = false;
		if (this.isChose) {
			this.listStatus.forEach((element) => {
				if (element.SL_Tasks > 0) {
					if (element.newvalue == 0) {
						error = true;
						return;
					} else {
						const ct = new MapModel();
						ct.new_status = element.newvalue;
						ct.old_status = element.id_row;
						_item.Map_Detail.push(ct);
					}
				}
			});
			if (!error) {
				this.Created(_item);
			} else {
				this.layoutUtilsService.showError('Bắt buộc phải chọn trạng thái ' + this._WorkwizardChungService.ts_congviec);
			}
		} else {
			_item.Map_Detail = [];
			this.Created(_item);
		}


	}

	Created(_item) {
	
	}

	close() {
		if(this._update){
			this.dialogRef.close(true);
		} else {
			this.dialogRef.close();
		}
	}

	sttFocus(value) {
		this.idfocus = value;
	}

	sttFocusout(value, status) {

		this.idfocus = 0;
		if (!value) {
			return;
		}

		const item = new StatusModel();
		item.clear();
		item.Id_row = status.id_row;
		item.StatusName = value;
		item.Color = status.color;

		item.Description = status.description;
		// item.CategoryID = this.id_department? this.id_department:this.data._item.id_project_team;
		// item.CategoryType = this.id_department? 1:2;

    item.CategoryType = this.getCategoryType();
    item.CategoryID = this.getCategoryID();
    item.id_group = this.TempSelected;
		this.UpdateStatus(item);
	}

	UpdateStatus(item, withBack: boolean = true) {
		this._WorkwizardChungService.UpdateStatus(item).subscribe((res) => {
			if (res && res.status == 1) {
				if (withBack) {
					this.layoutUtilsService.showActionNotification(
						this.translate.instant("JeeWork.capnhatthanhcong"),
						MessageType.Read,
						3000,
						true,
						false,
						3000,
						"top",
						1
					);
					this.LoadDataTemp();
				}
				else {
					this.layoutUtilsService.showActionNotification(
						this.translate.instant("JeeWork.capnhatthanhcong"),
						MessageType.Read,
						3000,
						true,
						false,
						3000,
						"top",
						1
					);
					this.ngOnInit();
				}

			} else {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Read,
					9999999999,
					true,
					false,
					3000,
					"top",
					0
				);
			}
		});
	}

  getCategoryType(){
    if(this.data._item.id_department){
      return 1;
    }
    else if(this.data._item.id_project_team){
      return 2;
    }
    else
      return 0;
  }

  getCategoryID(){
    var type = this.getCategoryType();
    if(type == 1){
      return this.data._item.id_department;
    }
    else if (type == 2){
      return this.data._item.id_project_team;
    }
    else{
      return this.TempSelected;
    }
  }

	ChangeColor(value, status) {
		// const _item = new UpdateQuickModel();
		// _item.clear();
		// _item.id_row = status.id_row;
		// _item.columname = 'color';
		// _item.values = value;
		// _item.id_template = this.TempSelected;
		// this.UpdateQuick(_item);


		const item = new StatusDynamicModel();
		item.clear();
		item.Id_row = status.id_row;
		item.StatusName = status.title;
		item.Color = value;
		item.Description = status.description;
		item.Id_project_team = this.data._item.id_project_team;

    item.CategoryType = this.getCategoryType();
    item.CategoryID = this.getCategoryID();
    item.id_group = this.TempSelected;


		// if (this.data._item.Follower == null) {
		// 	item.Follower = undefined;
		// }
		// else
		// 	item.Follower = this.data._item.Follower;
		// item.Type = "1";
		if (item.Id_row > 0) {
			this.UpdateStatus(item);
		} else {
			item.Type = "2";
			// this.InsertStatus(item, withBack);
		}
		// if (this.TempSelected > 0 && !this.isStatusNow) {
		// 	const _item = new UpdateQuickModel();
		// 	_item.clear();
		// 	_item.id_row = status.id_row;
		// 	_item.columname = 'color';
		// 	_item.values = value;
		// 	_item.id_template = this.TempSelected;
		// 	this.UpdateQuick(_item);
		// } else {
		// 	const item = new StatusDynamicModel();
		// 	item.clear();
		// 	item.Id_row = status.id_row;
		// 	item.StatusName = status.StatusName;
		// 	item.Color = value;
		//
		// 	item.Description = status.Description;
		// 	item.Id_project_team = status.id_project_team;
		// 	//   item.Follower = status.Follower;
		// 	item.Type = status.Type ? status.Type : '2';
		// 	this.UpdateStatus(item);
		// }
	}
	_isSystem;
	ChangeTemplate(item) {
		// 
		this.TempSelected = item.id_row;
		this.TempSelectedItem=item;
		this._isSystem = item.IsSystem;
		if (this.isInput) {
			this.selectStatus.emit(item);
			this.refreshTemplate.emit(this.litsTemplateDemo);
		}
		this.LoadListSTT();
	}


	addTemplate() {
		this.isAddTemplate = true;
	}

	focusOutTemp(value, temp, isUpdate = false) {
		if (isUpdate) {
			this.updateTemp = 0;
			if (!value) {
				return;
			}
			temp.title = value;
			if (this.id_department) {
				const _item = new GroupModel();
				_item.clear();
				_item.id_row = temp.id_row;
				_item.title = value;
				_item.id = this.id_department;
				_item.Categorytype = 1;
				// if(this.isHeThong){
				// 	_item.Categorytype=0;
				// 	_item.IdGroupCopy=this.TempSelected;
				// }
				this.UpdateGroup(_item);
			}
			else {
				const _item = new GroupModel();
				_item.clear();
				_item.id_row = temp.id_row;
				_item.title = value;
				_item.id = this.data._item.id_project_team;
				this.UpdateGroup(_item);
			}
		} else {
			this.isAddTemplate = false;
			if (!value) {
				return;
			}
			const _item = new GroupModel();
			if (this.id_department && this.id_department != 0) {
				_item.clear();
				_item.id_row = 0;
				_item.title = value;
				_item.id = this.id_department;
				_item.IdGroupCopy = this.TempSelected;
				_item.Categorytype = 1;				
			}
			else if (this.data._item.id_project_team && this.data._item.id_project_team != 0) {
				_item.clear();
				_item.id_row = 0;
				_item.title = value;
				_item.id = this.data._item.id_project_team;
				_item.IdGroupCopy = this.TempSelected;
				_item.Categorytype = 2;
				_item.IdGroupCopy = this.TempSelected;

			}
			else {
				_item.clear();
				_item.id_row = 0;
				_item.title = value;
				_item.id = 0;
				_item.IdGroupCopy = this.TempSelected;
				_item.Categorytype = 0;
			}
			this.InserGroup(_item);
		}
	}

	InserGroup(item) {
		this._WorkwizardChungService.InsertGroup(item).subscribe((res) => {
			if (res && res.status == 1) {
				this.LoadDataTemp();
			} else {
				this.layoutUtilsService.showError(res.error.message);
			}
		});
	}
	UpdateGroup(item) {
		this._WorkwizardChungService.UpdateGroup(item).subscribe((res) => {
			if (res && res.status == 1) {
				let message = 'Cập nhật thành công';
				this.layoutUtilsService.showInfo(message);
				this.LoadDataTemp();
			}
		});
	}
	UpdateQuick(item) {

	}

	Delete_Templete(status, isDelStatus) {
		const _title = this.translate.instant("JeeWork.xoa");
		const _description = this.translate.instant(
			"JeeWork.bancochacchanmuonxoakhong"
		);
		const _waitDesciption = this.translate.instant(
			"JeeWork.dulieudangduocxoa"
		);
		const _deleteMessage = this.translate.instant("JeeWork.xoathanhcong");

		const dialogRef = this.layoutUtilsService.deleteElement(
			_title,
			_description,
			_waitDesciption
		);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			else {
				if (isDelStatus) {
					this._WorkwizardChungService.DeleteStatus(status.id_row).subscribe(res => {
						if (res && res.status === 1) {
							this._update = true;
							this.LoadDataTemp();
							 this.layoutUtilsService.showActionNotification(
								_deleteMessage,
								MessageType.Delete,
								4000,
								true,
								false
							);
						}
						else {
							this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 9999999, 'top', 0);
						}
					});
				}
				else {
					// if (this.id_department) {

					// }
					let isSystem: number = 0;
					if (this.isHeThong) {
						isSystem = 1;
					}
					this._WorkwizardChungService.DeleteGroupStatus(status.id_row, isSystem).subscribe(res => {
						if (res && res.status === 1) {
							this.LoadDataTemp();
							 this.layoutUtilsService.showActionNotification(
								_deleteMessage,
								MessageType.Delete,
								4000,
								true,
								false
							);
						}
						else {
							this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 9999999, 'top', 0);
						}
					});
				}
			}
		})

		
	}

	focusOutSTT(value, type) {
		if (type == 1) {
			this.isAddStatusNew = false;
		} else if (type == 2) {
			this.isAddStatus = false;
		} 
		else if (type == 3) {
			this.isAddStatusDeadline = false;
		} 
		else {
			this.isAddStatusDone = false;
		}
		this.isAddStatus = false;
		if (!value) {
			return;
		}


		const item = new StatusModel();
		item.clear();
		if(!this.isHeThong){

			item.Id_row = 0;
			item.StatusName = value;
			item.Type = type;
			item.CategoryID = this.id_department? this.id_department: this.data._item.id_project_team;
			item.CategoryType = this.id_department? 1:2;

		}
		else{
			item.Id_row = 0;
			item.StatusName = value;
      item.Type = type;
			// item.CategoryID = 0;
      item.CategoryID = this.TempSelected;
			item.CategoryType = 0;
		}

    item.id_group = this.TempSelected;

		// item.Id_project_team = this.data._item.id_project_team;
		this.InsertStatus(item);


	}

	onSubmit(_item) {
		this.TempSelected = _item;
		let x = this.litsTemplateDemo.find((x) => x.id_row == this.TempSelected);
		let _description = 'Bạn có chắc muốn chọn nhóm trạng thái ' + x.title + ' không?'
		const dialogRef = this.layoutUtilsService.deleteElement('Xác nhận chọn trạng thái', _description, '', 'Xác nhận');
		dialogRef.afterClosed().subscribe((res) => {
			if (res) {
				// this.loadDataList();
				this.updateNhomTrangThai();
			}
		});
		// const item = new StatusDynamicModel();
		// item.clear();
		// item.Id_row = _item.id_row;
		// item.StatusName = _item.statusname;
		// item.Color = _item.color;

		// item.Description = _item.Description;
		// item.Id_project_team = _item.id_project_team;
		// item.Follower = _item.Follower;
		// item.Type = '1';
		// // if (item.Id_row > 0) {
		// this.UpdateStatus(item);
		// } else {
		// 	this.InsertStatus(item);
		// }
	}
	IsSystem = true;
	updateNhomTrangThai() {
		let type = this.id_department? 1:2;
		let id = this.id_department? this.id_department:this.data._item.id_project_team;
		// if (this.id_department) {
		// 	type=1
		// 	this._WorkwizardChungService.UpdateNhomTrangThai(this.TempSelected, this.id_department, 1).subscribe((res) => {
		// 		if (res) {
		// 			if (res.status == 1) {
		// 				let message = 'Cập nhật thành công';
		// 				this.layoutUtilsService.showInfo(message);
		// 				this.dialogRef.close('thanhcong');
		// 			}
		// 		}
		// 	})
		// }
		this._WorkwizardChungService.UpdateNhomTrangThai(this.TempSelected, id, type).subscribe((res) => {
			if (res) {
				if (res.status == 1) {
					let message = 'Cập nhật thành công';
					this.layoutUtilsService.showInfo(message);
					this.dialogRef.close('thanhcong');
				}
			}
		})

	}

	InsertStatus(item) {

		this._WorkwizardChungService.InsertStatus(item).subscribe((res) => {
			if (res && res.status == 1) {
				
				this._update = true;
				this.LoadDataTemp();
			} else {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Read,
					9999999999,
					true,
					false,
					3000,
					"top",
					0
				);
			}
		});
	}


	@HostListener('document:keydown', ['$event'])
	onKeydownHandler1(event: KeyboardEvent) {
		if (event.keyCode == 27) {
			// phím ESC
		}
	}
}
