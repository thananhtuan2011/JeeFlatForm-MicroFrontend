import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { BehaviorSubject, Subject } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'projects/jeeadmin/src/modules/crud/utils/layout-utils.service';
import { CT_YeuCauVPP_Model, XacNhanYeuCauModel, XuLyDuyetModel, YeuCauVPPModel } from '../../Model/yeucau-vpp.model';
import { VanPhongPhamService } from '../../Services/van-phong-pham.service';
import { Moment } from 'moment';
import * as moment from 'moment';
import { JeeAdminService } from '../../Services/jeeadmin.service';
import { QueryParamsModel } from 'projects/jeeadmin/src/app/models/query-models/query-params.model';

@Component({
	selector: 'm-yeucau-vpp-edit',
	templateUrl: './yeucau-vpp-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class YeuCauVPP_EditComponent implements OnInit {

	displayedColumns = ['#', 'TenVPP', 'MaSo', 'DinhMuc', 'DaSuDung', 'ConLai', 'YeuCau', 'LyDo'];
	@ViewChild('thang', { static: true }) thang: ElementRef;
	@ViewChild('ngayGiao', { static: true }) ngayGiao: ElementRef;
	//===============================
	itemForm: FormGroup;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loadingControl = new BehaviorSubject<boolean>(false);
	item: YeuCauVPPModel;
	oldItem: YeuCauVPPModel;

	public datatree: BehaviorSubject<any[]> = new BehaviorSubject([]);
	title: string = '';
	selectedNode: BehaviorSubject<any> = new BehaviorSubject([]);
	tmpChiTietYC: CT_YeuCauVPP_Model[]=[]

	listPhongBan: any[] = [];
	hanMucPhongBan: any[] = [];
	isView: number = 0;
	chiTietYC: CT_YeuCauVPP_Model[] = [];
	tmpTreeData = [];
	enabledTree: boolean = false;
	btnDisabled: boolean = false;
	idTrangThai: number;
	_item: any;
	IsToiGui: boolean = true;
	IDPhieu: number;
	IsItem = false;
	
	constructor(
		public objectService: VanPhongPhamService,
		public dialog: MatDialog,
		private router: Router,
		private itemFB: FormBuilder,
		private changeDetectorRefs: ChangeDetectorRef,
		public datepipe: DatePipe,
		private translate: TranslateService,
		private activatedRoute: ActivatedRoute,
		public dungChungService: JeeAdminService,
		private layoutUtilsService: LayoutUtilsService) {
		}

	/** LOAD DATA */
	async ngOnInit() {
		this.title = this.translate.instant('vanphongpham.phongbanyc');
		this.loadingSubject.next(true);
		this.reset();
		this.getTreeValue();

		this.item = new YeuCauVPPModel();
		this.item.clear();

		this.activatedRoute.params.subscribe(async params => {
			this.IDPhieu = +params.id;
			if (this.IDPhieu && this.IDPhieu > 0) {
				this.isView = params.isView;
				var istoigui = params.isToiGui
				this.IsToiGui = (istoigui === 'true');
				this.objectService.tabSelected.next(this.IsToiGui ? "0" : "1");
				this.objectService.activeID$.next(this.IDPhieu.toString());
				
				await this.loadDetail();

				this.IsItem = true;
			}
			else { //TH tạo phiếu
				this.getIdPhongBan();
				this.IsItem = true;
			}
			
			this.changeDetectorRefs.detectChanges();
        });
	}

	async loadDetail() {
		var res = await this.objectService.getDetailById(this.IDPhieu).toPromise();
		if (res && res.status == 1) {
			this.item = res.data;
			this.hanMucPhongBan = res.data.listDetail;
			this.getListButton(res.data.infoDuyet);
		}
		else {
			let mess = "Phiếu không tồn tại";
			this.layoutUtilsService.showActionNotification(mess, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			return;
		}
	}

	tenphongban: string = "";
	getIdPhongBan() {
		this.objectService.getIdPhongBan().subscribe(res => {
			if(res && res.status == 1) {
				this.enabledTree = !res.data.IsSelect
				this.IdPB = res.data.IdPhongBan;
				this.tenphongban = res.data.TenPhongBan;
				this.itemForm.controls['idPhongBan'].setValue(this.IdPB);
				let Thang = this.date.value.format("MM/YYYY");
				this.loadHanMuc(this.IdPB, Thang); //load hạn mức cho tháng hiện tại của phòng ban user login
				this.changeDetectorRefs.detectChanges();
			}
		});
	}

	list_Button: any[] = []
	getListButton(node) {
		let nodes: any[] = node
		this.list_Button = []
		nodes.forEach(val => {
			if (val.NodeXuLy.NodeType == 2) { //node điều kiện
				val.NodeKQs.forEach(kq => {
					let item = {
						Title: kq.Title,
						Class: kq.Style.Class,
						RowID: kq.RowID,
						IdRef: kq.IdRef,
						NodeID: val.NodeXuLy.RowID,
						NodeType: 2,
						Loai: val.NodeXuLy.PhanLoaiID,
					}
					this.list_Button.push(item)
				});
			}
			if (val.NodeXuLy.NodeType == 1) {
				let item = {
					Title: val.NodeXuLy.TaskName,
					Class: "ja_button btn-duyet",
					RowID: val.NodeXuLy.RowID,
					IdRef: null,
					NodeID: 0,
					NodeType: 1,
					Loai: val.NodeXuLy.PhanLoaiID,
				}
				this.list_Button.push(item)
			}
		});
		this.changeDetectorRefs.detectChanges();
	}

	getTreeValue() {
		this.dungChungService.getList_PhongBan().subscribe(res => {
			if (res.data && res.data.length > 0) {
				this.tmpTreeData = res.data;
				this.datatree.next(res.data);
			}
		});
	}

	deletePhieuYC(){
		let _name = this.translate.instant("vanphongpham.phieuyeucau")
		let _type = this.translate.instant("COMMON.Huy")
		const _title: string = this.translate.instant("OBJECT.XACNHAN.TITLE", { name: '' });
		const _description: string = this.translate.instant("OBJECT.XACNHAN.DESCRIPTION", { type: _type, name: _name });
		const _waitDesciption: string = this.translate.instant("OBJECT.XACNHAN.WAIT_DESCRIPTION", { name: _name });
		const _checkMessage = this.translate.instant("COMMON.xnthanhcong");

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, '', false);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.objectService.deletePhieuYeuCau(this.item.IdPhieuYC).subscribe(res => {
				if (res && res.status === 1) {
					this.objectService.data_IsLoad$.next('Load');
					this.goBack();
					this.layoutUtilsService.showActionNotification(_checkMessage, MessageType.Delete, 5000, true, false);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
				}
			});		
		})
	}

	//SET FORMAT DATE PICKER
	date = new FormControl(moment()); //lấy tháng hiện tại
	chosenYearHandler(normalizedYear: Moment) {
		const ctrlValue = this.date.value;
		ctrlValue.year(normalizedYear.year());
		this.date.setValue(ctrlValue);
	}
	
	chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
		const ctrlValue = this.date.value;
		ctrlValue.month(normalizedMonth.month());
		this.date.setValue(ctrlValue);
		datepicker.close();

		let Thang = this.date.value.format("MM/YYYY");
		this.loadHanMuc(this.IdPB, Thang);
	}

	IdPB: number = 0;
	GetValueNode(val: any) {
		let IdPhongBan = Number(val.RowID);
		this.IdPB = IdPhongBan;

		let Thang = this.date.value.format("MM/YYYY");
		this.loadHanMuc(this.IdPB, Thang);
	}

	isXetHanMuc: number
	loadHanMuc(IdPhongBan: number = 0, Thang: string = '') {
		if (Thang == null || Thang == undefined || this.IdPB == null || this.IdPB == undefined) {
			const message = this.translate.instant("ThongBao.kocodata");
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			return;
		}

		this.chiTietYC = []
		let queryParams = new QueryParamsModel({});
		queryParams.filter.Id = IdPhongBan;
		queryParams.filter.Thang = Thang;
		this.objectService.getHanMucDetail(queryParams).subscribe(res => {
			if (res.status == 1) {
				this.hanMucPhongBan = res.data.listDetail;
				this.isXetHanMuc = res.data.IsXetHM;
				if (this.isXetHanMuc == 0) //ko xét hạn mức
					this.displayedColumns = ['#', 'TenVPP', 'MaSo', 'YeuCau', 'LyDo'];
				this.hanMucPhongBan.forEach(x => {
					this.chiTietYC.push(x);
				})
			}
			else {
				this.hanMucPhongBan = []
			}
			this.changeDetectorRefs.detectChanges();
		})
	}

	getWidthDetails(): any {
        let tmp = window.innerWidth - 350 - 70;
        return tmp + "px";
    }

	goBack() {
		this.loadingSubject.next(false);
		this.router.navigateByUrl("Admin/yeucau-vpp");
	}

	/** ACTIONS */
	initProduct() {
		this.createForm();
		this.loadingSubject.next(false);
		this.loadingControl.next(true);
	}

	createForm() {
		this.itemForm = this.itemFB.group({
			idPhongBan:[''],
			thangNam: [''],
			trangThai: [''],
			nguoiTao: [''],
			lyDo: [''],
			lyDoKhongDuyet: [],
			ngayGiao:[new Date()], //mặc định là ngày hiện tại
		});
	}

	reset() {
		this.item = Object.assign({}, this.oldItem);
		this.createForm();
		this.itemForm.markAsPristine();
		this.itemForm.markAsUntouched();
		this.itemForm.updateValueAndValidity();
	}

	getValue(item: any, id_row: any): string {
		if (item.Data || item.Data.length > 0) {
			var value = item.Data.find(x => {
				if (x.ID === id_row)
					return x;
				else
					return null;
			})
			if (value !== undefined && value !== null)
				return value.Value;
			else return "";
		}
		return "";
	}

	soLuongChanged(v: any) {
		var regex = /[a-zA-Z ]/g;
		var found = v.match(regex);
		if (found != null) {
			const message = this.translate.instant("ThongBao.inputkhacchu")
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			return;
		}
	}

	checkValue(e: any) {
		if (!((e.keyCode > 95 && e.keyCode < 106)
			|| (e.keyCode > 47 && e.keyCode < 58)
			|| e.keyCode == 8)) {
			e.preventDefault();
		}
	}

	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 190;
		return tmp_height + 'px';
	}

	onSubmit() {
		const item = new YeuCauVPPModel();
		item.clear();
		item.ThangNam = this.date.value.format("MM/YYYY");
		item.IdPhongBan = this.IdPB;
		var lyDo = this.itemForm.controls.lyDo.value;
		
		let tmpChiTietYC = [];
		let dem = 0;
		for (let i=0; i<this.chiTietYC.length; i++) {
			let val = new CT_YeuCauVPP_Model();
			val.clear();
			val = this.chiTietYC[i];
			if (this.isXetHanMuc == 1) {
				var han_muc = this.hanMucPhongBan[i];
				if (Number(val.SLYeuCau) > Number(han_muc.SLHanMuc) || Number(val.SLYeuCau) > Number(han_muc.SLConLai)) { //xét luôn TH SL còn lại
					val.IsVuotHM = 1;
					if ( (val.LyDoCT == "" || val.LyDoCT == undefined) && (lyDo == "" || lyDo == undefined) ){
						const message = 'Nhập lý do vượt hạn mức' // this.translate.instant("ThongBao.lydovuothm")
						this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
						return;
					}
				}
			}
			if (val.SLYeuCau == null || Number(val.SLYeuCau) <= 0) {
				dem++;
			}
			else {
				tmpChiTietYC.push(val) //chỉ add những val slYeuCau > 0
			}
		}
		if (dem == this.chiTietYC.length) {
			const message = this.translate.instant("ThongBao.nhapsoluong")
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			return;
		}
		item.LyDo = lyDo;
		item.listDetail = tmpChiTietYC;

		if (item.listDetail.length > 0) {
			this.addYeuCau(item)
		}
		else {
			const message = this.translate.instant("ThongBao.danhsachtrong")
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			return;
		}
	}

	addYeuCau(item: YeuCauVPPModel, withBack: boolean = false) {
		this.loadingSubject.next(true);
		this.btnDisabled = true;
		this.objectService.createPhieuYeuCau(item).subscribe(res => {
			this.btnDisabled = false;
			this.loadingSubject.next(false);
			if (res.status == 1) {
				this.objectService.data_IsLoad$.next('Load');
				if (withBack) {
					this.goBack();
				} else {
					this.itemForm.markAsUntouched();
					const message = this.translate.instant("COMMON.themthanhcong")
					this.layoutUtilsService.showActionNotification(message, MessageType.Create, 2000, true, false);
				}
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	prepareDuyet(duyet: any) {
		const _item = new XuLyDuyetModel();
		_item.clear()
		_item.IdPhieuYC = this.item.IdPhieuYC;
		if (duyet.IdRef == "0") {
			var lydo = this.itemForm.controls.lyDoKhongDuyet.value;
			if (lydo == "" || lydo == null) {
				const message = this.translate.instant("ThongBao.lydokoduyet")
				this.layoutUtilsService.showActionNotification(message, MessageType.Read, 1000, true, false, 3000, 'top', 0);
				this.itemForm.controls["lyDoKhongDuyet"].markAsTouched();
				return;
			}
			_item.LyDoKhongDuyet = lydo;
		}
		_item.IdRef = duyet.IdRef;
		_item.RowID = duyet.RowID;
		_item.NodeID = duyet.NodeID;
		_item.NodeType = duyet.NodeType;
		_item.Title = duyet.Title;
		_item.Loai = duyet.Loai;
		this.aprove(_item, duyet.Title);
	}

	aprove(item: XuLyDuyetModel, tieude: string) {
		const _title = tieude;
		const _description: string = this.translate.instant("OBJECT.XACNHAN.DESCRIPTION", { type: '', name: _title });
		const _waitDesciption: string = this.translate.instant("OBJECT.XACNHAN.WAIT_DESCRIPTION", { name: _title });
		const _checkMessage = tieude + " " + this.translate.instant("COMMON.thanhcong");

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.btnDisabled = true;
			this.objectService.processTask(item).subscribe(async res => {
				this.btnDisabled = false;
				if (res && res.status === 1) {
					this.objectService.data_IsLoad$.next('Load');
					await this.loadDetail();
					this.layoutUtilsService.showActionNotification(_checkMessage, MessageType.Delete, 5000, true, false);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Read, 1000, true, false, 3000, 'top', 0);
				}
			});
		})
	}

	prepareXacNhan() {
		const _item = new XacNhanYeuCauModel();
		_item.clear()
		_item.IdPhieuYC = this.IDPhieu;

		let ngayGiao = this.itemForm.controls.ngayGiao.value
		_item.NgayGiao = (ngayGiao) ? moment(ngayGiao).format('YYYY-MM-DD[T]HH:mm:ss.SSS'): 
			moment(new Date().toString()).format('YYYY-MM-DD[T]HH:mm:ss.SSS');;
		
		if (ngayGiao == "" || ngayGiao == null) {
			const message = this.translate.instant("ThongBao.chonngaygiao");
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999, true, false, 3000, 'top', 0);
			return;
		}

		this.xacNhan(_item)
	}
	
	xacNhan(item: XacNhanYeuCauModel) {
		let _name = this.translate.instant("vanphongpham.phieuyeucau")
		let _type = ''
		const _title: string = this.translate.instant("OBJECT.XACNHAN.TITLE", { name: _name });
		const _description: string = this.translate.instant("OBJECT.XACNHAN.DESCRIPTION", { type: _type, name: _name });
		const _waitDesciption: string = this.translate.instant("OBJECT.XACNHAN.WAIT_DESCRIPTION", { name: _name });
		const _checkMessage = this.translate.instant("COMMON.xnthanhcong");

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.btnDisabled = true;
			this.objectService.xacNhanYeuCau(item).subscribe(async res => {
				this.btnDisabled = false;
				if (res && res.status === 1) {
					this.objectService.data_IsLoad$.next('Load');
					await this.loadDetail();
					this.layoutUtilsService.showActionNotification(_checkMessage, MessageType.Delete, 5000, true, false);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Read, 1000, true, false, 3000, 'top', 0);
				}
			});		
		})
	}

	xacNhanDaNhan(item: YeuCauVPPModel) {
		let _name = this.translate.instant("vanphongpham.phieuyeucau")
		let _type = this.translate.instant("vanphongpham.received")
		const _title: string = this.translate.instant("OBJECT.XACNHAN.TITLE", { name: '' });
		const _description: string = this.translate.instant("OBJECT.XACNHAN.DESCRIPTION", { type: _type, name: _name });
		const _waitDesciption: string = this.translate.instant("OBJECT.XACNHAN.WAIT_DESCRIPTION", { name: _name });
		const _checkMessage = this.translate.instant("COMMON.xnthanhcong");

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, '', false);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				item.IsDaNhan = false;
				this.changeDetectorRefs.detectChanges();
				return;
			}
			this.objectService.xacNhanDaNhan(item.IdPhieuYC).subscribe(async res => {
				if (res && res.status === 1) {
					this.objectService.data_IsLoad$.next('Load');
					await this.loadDetail();
					this.layoutUtilsService.showActionNotification(_checkMessage, MessageType.Delete, 5000, true, false);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Delete, 0);
				}
			});		
		})
	}

	xacNhanDaGiao(item: YeuCauVPPModel) {
		let _name = this.translate.instant("vanphongpham.phieuyeucau")
		let _type = this.translate.instant("vanphongpham.dagiao")
		const _title: string = this.translate.instant("OBJECT.XACNHAN.TITLE", { name: '' });
		const _description: string = this.translate.instant("OBJECT.XACNHAN.DESCRIPTION", { type: _type, name: _name });
		const _waitDesciption: string = this.translate.instant("OBJECT.XACNHAN.WAIT_DESCRIPTION", { name: _name });
		const _checkMessage = this.translate.instant("COMMON.xnthanhcong");

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, '', false);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				item.IsDaGiao = false;
				this.changeDetectorRefs.detectChanges();
				return;
			}
			this.objectService.xacNhanDaGiao(item.IdPhieuYC).subscribe(res => {
				if (res && res.status === 1) {
					this.objectService.data_IsLoad$.next('Load');
					this.goBack();
					this.layoutUtilsService.showActionNotification(_checkMessage, MessageType.Delete, 5000, true, false);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Delete, 0);
				}
			});		
		})
	}

	f_convertDate(v: any) {
		if (v != "" && v != undefined) {
			let a = new Date(v);
			return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
		}
	}

	updateSL(item: any, event: any){
		var val = this.chiTietYC.find(x => x.IdVPP == item.IdVPP);
		val.SLYeuCau = event.target.value;
		val.IsVuotHM = 0; //có chỉnh lại sl thì gán isvuothm = 0 khi gửi sẽ xét lại
	}

	updateGhiChu(item: any, event: any){
		var val = this.chiTietYC.find(x => x.IdVPP == item.IdVPP);
		val.LyDoCT = event.target.value
	}

	f_date(value: any, args?: any): any {
		let latest_date = this.datepipe.transform(value, 'dd/MM/yyyy');
		return latest_date;
	}

	f_hour(value: any, args?: any): any {
		let latest_date = this.datepipe.transform(value, 'HH:mm');
		return latest_date;
	}

	getComponentTitle() {
		let _name = this.translate.instant("vanphongpham.title_request").toLowerCase()
		let result = "Thêm mới yêu cầu văn phòng phẩm";
		if (!this.item || !this.item.IdPhieuYC) {
			return result;
		}
		result = this.isView == 0 ? this.translate.instant("COMMON.UPDATE_NAME", { name: _name })
		 : 'Tháng ' + this.item.ThangNam + " - " + this.item.TenPhongBan;
		return result;
	}
}