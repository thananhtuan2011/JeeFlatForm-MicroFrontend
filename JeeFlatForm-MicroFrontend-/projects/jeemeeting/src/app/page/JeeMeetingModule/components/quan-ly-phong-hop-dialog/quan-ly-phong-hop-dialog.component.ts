import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'projects/jeemeeting/src/modules/crud/utils/layout-utils.service';
import { CuocHopModel, TaiSanModel } from '../../_models/DuLieuCuocHop.model';
import { DangKyCuocHopService } from '../../_services/dang-ky-cuoc-hop.service';
import { StateService } from '../../_services/state.service';

@Component({
  selector: 'app-quan-ly-phong-hop-dialog',
  templateUrl: './quan-ly-phong-hop-dialog.component.html',
  styleUrls: ['./quan-ly-phong-hop-dialog.component.scss']
})
export class QuanLyPhongHopDialogComponent implements OnInit {
	disabledBtn: boolean;
	options: any = {};
	itemForm: FormGroup;
	item: any;
	RoomID: number;
	UserID:number;
	state: CuocHopModel;
	stateEdit: CuocHopModel;
	TenPhong:string
	//====================Dropdown search============================
	  //====================Nhân viên====================
	  public bankFilterCtrl: FormControl = new FormControl();
	  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	  //====================Từ Giờ====================
	  public bankTuGio: FormControl = new FormControl();
	  public filteredBanksTuGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	  //====================Đến giờ====================
	  public bankDenGio: FormControl = new FormControl();
	  public filteredBanksDenGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

	GioNghi: any[] = [];
	  DenGio: any[] = [];
	constructor(public dialogRef: MatDialogRef<QuanLyPhongHopDialogComponent>,
		  @Inject(MAT_DIALOG_DATA) public data: any,private dangKyCuocHopService: DangKyCuocHopService,
		private changeDetectorRefs: ChangeDetectorRef,private itemFB: FormBuilder,private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService,private stateService: StateService,) {
		  // this.UserID = +localStorage.getItem("idUser");
		  this.UserID = Number(localStorage.getItem('staffID'))
		}

	ngOnInit(): void {
	  this.state = this.stateService.state$.getValue() || null;
	  this.stateEdit = this.stateService.stateEdit$.getValue() || null;
	  if(this.state == null){
		  const _item = new CuocHopModel();
		  _item.clear()
		  this.stateService.state$.next(_item);
		  this.state = this.stateService.state$.getValue();
	  }
	  this.RoomID = this.data._RoomID==""?0:this.data._RoomID;
	  this.TenPhong = this.data._TenPhong
	  this.XuLyDuLieuAdd(this.data._item);
	  this.createForm();
	  this.dangKyCuocHopService.Get_GioDatPhongHop('').subscribe(res => {
		this.GioNghi = res.data;
		this.DenGio = res.data;
		if (this.item.FromTime != "") {
		  this.itemForm.controls["FromTime"].setValue('' + this.item.FromTime);
		}
		if (this.item.ToTime != "") {
		  this.itemForm.controls["ToTime"].setValue('' + this.item.ToTime);
		}

		this.setUpDropSearchTuGio();
		this.setUpDropSearchDenGio()
		this.changeDetectorRefs.detectChanges();
	  });
	}

	XuLyDuLieuAdd(val: any) {
		  let tmp = Object.assign({}, this.item);
		  tmp.BookingDate = this.f_convertDate(val.start);
		  tmp.FromTime = this.f_convertHour(val.start);
		  tmp.ToTime = this.f_convertHour(val.end);
		  tmp.MeetingContent = val.extendedProps.reason;
		  this.item = tmp;
	  }
	createForm() {
		  this.itemForm = this.itemFB.group({
		BookingDate: [this.item.BookingDate, [Validators.required]],
			  MeetingContent: [this.item.MeetingContent, Validators.required],
			  FromTime: ['', Validators.required],
			  ToTime: ['', Validators.required],
			  // NVID:['',Validators.required],
		  });
		  this.itemForm.controls["BookingDate"].markAsTouched();
		  this.itemForm.controls["MeetingContent"].markAsTouched();
		  this.itemForm.controls["FromTime"].markAsTouched();
		  this.itemForm.controls["ToTime"].markAsTouched();
		  // this.itemForm.controls["NVID"].markAsTouched();
	  }
	goBack(){
	  this.dialogRef.close()
	}
	//=========================
	f_convertDate(v: any) {
		  if (v != "" && v != null) {
			  let a = new Date(v);
			  return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
		  }
	  }
	  f_convertHour(v: any) {
		  if (v != "" && v != null) {
			  let a = new Date(v);
			  return ("0" + (a.getHours())).slice(-2) + ":" + ("0" + (a.getMinutes())).slice(-2);
		  }
	  }
	  f_number(value: any) {
		  return Number((value + '').replace(/,/g, ""));
	  }

	  f_currency(value: any, args?: any): any {
		  let nbr = Number((value + '').replace(/,|-/g, ""));
		  return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	  }
	  setUpDropSearchTuGio() {
		  this.bankTuGio.setValue('');
		  this.filterBanksTuGio();
		  this.bankTuGio.valueChanges
			  .pipe()
			  .subscribe(() => {
				  this.filterBanksTuGio();
			  });
	  }

	  protected filterBanksTuGio() {
		  if (!this.GioNghi) {
			  return;
		  }
		  // get the search keyword
		  let search = this.bankTuGio.value;
		  if (!search) {
			  this.filteredBanksTuGio.next(this.GioNghi.slice());
			  return;
		  } else {
			  search = search.toLowerCase();
		  }
		  // filter the banks
		  this.filteredBanksTuGio.next(
			  this.GioNghi.filter(bank => bank.Gio.toLowerCase().indexOf(search) > -1)
		  );
	  }
	  //===========================
	  setUpDropSearchDenGio() {
		  this.bankDenGio.setValue('');
		  this.filterBanksDenGio();
		  this.bankDenGio.valueChanges
			  .pipe()
			  .subscribe(() => {
				  this.filterBanksDenGio();
			  });
	  }

	  protected filterBanksDenGio() {
		  if (!this.DenGio) {
			  return;
		  }
		  // get the search keyword
		  let search = this.bankDenGio.value;
		  if (!search) {
			  this.filteredBanksDenGio.next(this.DenGio.slice());
			  return;
		  } else {
			  search = search.toLowerCase();
		  }
		  // filter the banks
		  this.filteredBanksDenGio.next(
			  this.DenGio.filter(bank => bank.Gio.toLowerCase().indexOf(search) > -1)
		  );
	  }


	  GuiDangKy(withBack: boolean = false) {
		  // this.hasFormErrors = false;
		  // this.loadingAfterSubmit = false;
		  const controls = this.itemForm.controls;
		  /* check form */
		  if (this.itemForm.invalid) {
			  Object.keys(controls).forEach(controlName =>
				  controls[controlName].markAsTouched()
			  );

			  // this.hasFormErrors = true;
			  return;
		  }
		  const item = this.prepareItem();
		  this.CreateRoom(item, withBack);
	  }

	  prepareItem(): any {
		  const controls = this.itemForm.controls;
		  const _item = new TaiSanModel();
		  _item.RoomID = this.RoomID;
		  _item.BookingDate = controls['BookingDate'].value;
		  _item.FromTime = controls['FromTime'].value;
		  _item.ToTime = controls['ToTime'].value;
		  _item.MeetingContent = controls['MeetingContent'].value;
		  _item.NVID = this.UserID;
		  _item.TenPhong = this.TenPhong
		  _item.chitiet = this.TenPhong + ', '
		  + this.LayThu(controls['BookingDate'].value) + ' '
		  + this.f_convertDate2(controls['BookingDate'].value)+ ', '
		  + controls['FromTime'].value +' - '+controls['ToTime'].value
		  return _item;
	  }

	  CreateRoom(_item: any, withBack: boolean) {
		  // this.loadingAfterSubmit = true;
		  this.disabledBtn = true;
		  let saveMessageTranslateParam = this.translate.instant('mt.themthanhcong');
		  const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		  const _messageType = MessageType.Create;
		  if(this.stateEdit){
			  if(this.stateEdit.LoaiTaiSan == 1){
				  this.stateEdit.SuDungPhongHopInput = _item
				  this.stateEdit.isEdit = 1
			  }else{
				  if(this.stateEdit.TaiSanKhac == null){
					  let taisan = []
					  taisan.push(_item)
					  this.stateEdit.TaiSanKhac = taisan
					  this.stateEdit.isEdit = 1
				  }else{
					  var index = this.stateEdit.TaiSanKhac.findIndex(x=>x.RoomID== this.RoomID)
					  if(index != -1){
						  this.stateEdit.TaiSanKhac.splice(index,1);
					  }
					  this.stateEdit.TaiSanKhac.push(_item)
					  this.stateEdit.isEdit = 1
				  }
			  }
		  }else{
			  if(this.state.LoaiTaiSan == 1){
				  this.state.SuDungPhongHopInput = _item
				  this.state.isAdd = 1
			  }else{
				  if(this.state.TaiSanKhac == null){
					  let taisan = []
					  taisan.push(_item)
					  this.state.TaiSanKhac = taisan
					  this.state.isAdd = 1
				  }else{
					  var index = this.state.TaiSanKhac.findIndex(x=>x.RoomID== this.RoomID)
					  if(index != -1){
						  this.state.TaiSanKhac.splice(index,1);
					  }
					  this.state.TaiSanKhac.push(_item)
					  this.state.isAdd = 1
				  }
			  }
		  }
		  this.dangKyCuocHopService.Insert_DatPhongHop(_item).subscribe(re => {
			this.disabledBtn = false;
			if (re && re.status == 1) {
				this.dialogRef.close({
					_item
				});
			} else {
				this.layoutUtilsService.showActionNotification(re.error.msg, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		})
	  }
	  f_convertDate2(v: any) {
		  if (v != "" && v != null) {
			  let a = new Date(v);
			  return ("0" + (a.getDate())).slice(-2) + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + a.getFullYear();
		  }
	  }
	  LayThu(v:any){
		  let day = new Date(v);
		  switch (day.getDay()) {
			  case 0:
				  return "Chủ nhật";
			  case 1:
				  return "Thứ 2";
			  case 2:
				  return "Thứ 3";
			  case 3:
				  return "Thứ 4";
			  case 4:
				  return "Thứ 5";
			  case 5:
				  return "Thứ 6";
			  case 6:
				  return "Thứ 7";
		  }
	  }
  }
