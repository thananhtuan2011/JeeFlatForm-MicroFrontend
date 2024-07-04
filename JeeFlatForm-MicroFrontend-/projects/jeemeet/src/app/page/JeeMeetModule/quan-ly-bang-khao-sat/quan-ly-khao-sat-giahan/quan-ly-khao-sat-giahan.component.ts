
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { QuanLyBangKhaoSatService } from '../_services/quan-ly-bang-khao-sat.service';
import { TranslateService } from '@ngx-translate/core';
import { BangKhaoSatModel } from '../_models/quan-ly-bang-khao-sat.model';
import { ReplaySubject, Subscription } from 'rxjs';
import moment from 'moment';
import { JeeChooseMemberComponent } from '../components/jee-choose-member/jee-choose-member.component';
import { CauHoiKhaoSatModel } from '../../quan-ly-cau-hoi-khao-sat/_models/quan-ly-cau-hoi-khao-sat.model';
import { environment } from 'projects/jeemeet/src/environments/environment';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
const EMPTY_CUSTOM: BangKhaoSatModel = {
  id: '',
  IdKhaoSat: 0,
  TieuDe: '',
  allowEdit: false,
  CreatedDate: '',
  Id: 0,
  NoiDungCauHoi: '',
  RowID: 0,
  IsDel: 0,
  CauHoiKhaoSat: [],
  IsActive: 0,
  IsBatBuoc: 0,
  IdCuocHop: 0,
  IsAction: 0,
  Type: 0,
  NgayGiaHan: 0,
  DSDVXuLy: '',
  ChiTietDG: [],
  refresh_token: '',
};
const EMPTY_CUSTOM_CAUHOI: CauHoiKhaoSatModel = {
  id: '',
  Id: 0,
  NoiDungCauHoi: '',
  allowEdit: false,
  CreatedDate: '',
  IdCauTraLoi: 0,
  CauTraLoi: '',
  Type: 0,
  // DanhSachNguoiDung: [],
  // refresh_token: ''
};
@Component({
  selector: 'app-quan-ly-khao-sat-giahan',
  templateUrl: './quan-ly-khao-sat-giahan.component.html',
  styleUrls: ['./quan-ly-khao-sat-giahan.component.scss'],
})
export class QuanLyGiaHanKhaoSatComponent implements OnInit {
  item: BangKhaoSatModel;
  itemForm: FormGroup;
  hasFormErrors: boolean = false;
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;
  disabledBtn: boolean = false;
  QuanLyKhaoSat: any = {};
  QuanLyKhaoSatForm: FormGroup;
  ListCauHoi: any[] = [];
  isShowImage: boolean = false;
  IsXem: boolean = false;
  IsDel: boolean = false;
  IsTatCa: boolean = false;
  listUser: any[] = [];
  @ViewChild('inputSDT', { static: true }) inputSDT: ElementRef;
  @ViewChild('scrollMe', { static: true }) myScrollContainer: ElementRef;
  // accs: any[] = [];
  searchCauHoi: string = '';
  dataNguoiDung: any[] = [];
  searchNguoiDung: string = '';
  filteredNguoiDungs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredTieuChiPL3s: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredndchs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  // Private password
  selectIDCuocHop: string = '0';
  IdCuocHop: string = '0';
  doituong: number = 0;
  DSDanhGiaTam: any[] = [];
  dataSource: any[] = [];
  DSCauHoi: any[] = [];
  DSCauHoiTam: any[] = [];
  ListFileDinhKem: any[] = [];
  displayedColumns: string[] = ['STT', 'Id', 'action'];
  private componentSubscriptions: Subscription;
  sizemaxfile: any = environment.DungLuong / 1048576;
  ExtensionImg = ['png', 'gif', 'jpeg', 'jpg'];
  strExtensionImg = 'png, .gif, .jpeg, .jpg';
  public now = new Date();
  public startDateHour = { hour: 0, minute: 0 };
  public startDate = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate(),
    this.startDateHour.hour,
    this.startDateHour.minute
  );
  //public startDate=this.now.getFullYear()+"-"+(this.now.getMonth()>10?this.now.getMonth():"0"+this.now.getMonth())+"-"+(this.now.getDate()>10?this.now.getDate():"0"+this.now.getDate())+"T00:00:00";
  //2020-03-04T02:55:00 => 04/03.2020 02:55:00
  tabIndexValue = 0;
  @ViewChild('myInput', { static: true }) myInput: ElementRef;
  public nowDateHour = { hour: 0, minute: 0 };
  public nowDate = new Date(
    this.now.getFullYear(),
    this.now.getMonth(),
    this.now.getDate(),
    this.nowDateHour.hour,
    this.nowDateHour.minute
  );
  ExtensionVideo = [
    'mp4',
    'mov',
    'avi',
    'gif',
    'mpeg',
    'flv',
    'wmv',
    'divx',
    'mkv',
    'rmvb',
    'dvd',
    '3gp',
    'webm',
  ];
  strExtensionVideo =
    'mp4, .mov, .avi, .gif, .mpeg, .flv, .wmv, .divx, .mkv, .rmvb, .dvd, .3gp, .webm';
  ExtensionFile = [
    'xls',
    'xlsx',
    'doc',
    'docx',
    'pdf',
    'mp3',
    'zip',
    '7zip',
    'rar',
    'txt',
  ];
  strExtensionFile =
    'xls, .xlsx, .doc, .docx, .pdf, .mp3, .zip, .7zip, .rar, .txt';
  files: any[] = [{ data: {} }];
  ListFile: any[] = [];
  file: string = '';
  file1: string = '';
  file2: string = '';
  lstCuocHop: any[] = [];
  RowID: number = 1;

  dataTem = {
    Id: 0,
    NoiDungCauHoi: '',
  };

  inputId: any[] = [];

  domain = environment.APIROOT;

  idMOld: number = 0;

  type: number = 0;
  titleN: string = '';
  isCopy: boolean = false;

  idM: number = 0;
  settingsSurvey: boolean = false;
  NgayBatDau: any;
  NgayKetThuc: any;
  GioBatDau: string = '00:00';
  GioKetThuc: string = '00:00';
  chuTri: number = 0;
  ListAccount: any[] = [];
  selectIdAccount: string = '0';
  searchAccount: string = '';
  filteredAccounts: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  countnguoidung: number = 0;
  @ViewChild('focusInput', { static: true }) focusInput: ElementRef;
	NgayGiaHan:number=0;
  constructor(
    public dialogRef: MatDialogRef<QuanLyGiaHanKhaoSatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    public bangkhaosatService: QuanLyBangKhaoSatService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService
  ) {}

  /** UI */
  getTitle(): string {
		if (this.isCopy || this.type == 1) {
			return this.translate.instant("MENU_KHAOSAT.COPPY");
		}
		if (this.data._item.IdKhaoSat > 0) {
			if (!this.IsXem) {
				return this.translate.instant("OBJECT.UPDATE.TITLE", {
					name: this.translate
				.instant("MENU_KHAOSAT.NAME_OBJ")
				.toLowerCase(),
		})+" - "+this.data._item.TieuDe;
			} else {
				return this.translate.instant("OBJECT.DETAIL.TITLE", {
					name: this.translate
				.instant("MENU_KHAOSAT.NAME_OBJ")
				.toLowerCase(),
		})+" - "+this.data._item.TieuDe
			}
		}
		return this.translate.instant("OBJECT.ADD.TITLE", {
			name: this.translate
				.instant("MENU_KHAOSAT.NAME_OBJ")
				.toLowerCase(),
		});
	}

  ngOnInit() {
    this.item = this.data._item;
    this.createForm();
    if (this.item.IdKhaoSat> 0) {
      this.viewLoading = true;
			this.bangkhaosatService.getQuanLyKhaoSatById(this.item.IdKhaoSat).subscribe((res) => {
				if (res && res.status == 1) {
					if (res.data.IdCuocHop != "0")
          {
						this.IdCuocHop = res.data.IdCuocHop;
					}
					this.QuanLyKhaoSat = res.data;
					this.IsTatCa = res.data.IsTatCa;
					this.doituong=res.data.Type;
					this.IdCuocHop=""+res.data.IdCuocHop;
					this.changeDetectorRefs.detectChanges();
					this.listUser = res.data.ListThamGia;
					this.countnguoidung=this.listUser.length;
					this.ListFileDinhKem = res.data.lstKhaoSatDinhKem;
					this.QuanLyKhaoSat.RowID = res.data.RowID;
					this.dataSource = res.data.ChiTietDG;
					this.IdCuocHop=res.data.IdCuocHop;
					this.ListAccount = res.data.chutri;
					this.filteredAccounts.next(this.ListAccount);
					if (this.dataSource && this.dataSource.length > 0) {
						var flags = [], outputId = [], l = this.dataSource.length, i;
						for (i = 0; i < l; i++) {
							if (flags[this.dataSource[i].Id]) continue;
							flags[this.dataSource[i].Id] = true;
							outputId.push(this.dataSource[i].Id);
						}
						this.inputId = outputId;
					}
					this.createForm();
					this.changeDetectorRefs.detectChanges();
				} else
					this.layoutUtilsService.showActionNotification(
						res.error.message,
						MessageType.Read,
						2000,
						true,
						false
					);
			});
    } else {
      this.viewLoading = false;
      this.reset();
    }
  }

  createForm(flag: boolean = false) {
		this.isCopy = this.data.isCopy ? this.data.isCopy : false;
		this.startDateHour ={
			hour: this.QuanLyKhaoSat.NgayBatDau?moment(this.QuanLyKhaoSat.NgayBatDau, "DD/MM/YYYY hh:mm").toDate().getHours():0,
			minute: this.QuanLyKhaoSat.NgayBatDau?moment(this.QuanLyKhaoSat.NgayBatDau, "DD/MM/YYYY hh:mm").toDate().getMinutes():0,
		}
		this.nowDateHour ={
			hour: this.QuanLyKhaoSat.NgayKetThuc?moment(this.QuanLyKhaoSat.NgayKetThuc, "DD/MM/YYYY hh:mm").toDate().getHours():0,
			minute: this.QuanLyKhaoSat.NgayKetThuc?moment(this.QuanLyKhaoSat.NgayKetThuc, "DD/MM/YYYY hh:mm").toDate().getMinutes():0,
		}

		this.itemForm = this.fb.group({
			TieuDe: [
				this.QuanLyKhaoSat.TieuDe,
				[Validators.required, Validators.pattern(/[\S]/)],
			],
			IsBatBuoc: [""],
			IsActive: [""],
			Type:[""],
			Id:[""],
			IdCuocHop: [""],
			TuNgayHour: [this.startDateHour, Validators.compose([Validators.required]),],
			NgayBatDau: [this.QuanLyKhaoSat.NgayBatDau ? moment(this.QuanLyKhaoSat.NgayBatDau, "DD/MM/YYYY HH:mm").toDate() : ""],

			DenNgayHour: [this.nowDateHour, Validators.compose([Validators.required]),],
			NgayKetThuc: [this.QuanLyKhaoSat.NgayKetThuc ? moment(this.QuanLyKhaoSat.NgayKetThuc, "DD/MM/YYYY HH:mm").toDate() : ""],

		});

		// if (this.IsXem) this.QuanLyKhaoSatForm.disable();
		this.changeDetectorRefs.detectChanges();

	}

  /** ACTIONS */
  prepareData(): BangKhaoSatModel {
    const controls = this.itemForm.controls;
		var data: any = {};

		//gán lại giá trị id
		if (this.item.IdKhaoSat > 0) {
			data.IdKhaoSat = this.item.IdKhaoSat;
			data.IdMOld = this.idMOld;
		}
		data.TieuDe = controls["TieuDe"].value;
		// data.IsActive = controls["IsActive"].value;
		data.IsActive = false;
		data.IsBatBuoc = false;
		data.IsTatCa = this.IsTatCa;
    data.IsVangLai = false;
		data.Type = this.doituong;
		data.CauHoiKhaoSat = this.dataSource;
		data.IdCuocHop = 0;
		data.ListUser = this.listUser;
		data.lstKhaoSatDinhKem = [];
		data.FileDinhKem = [];
		if (this.ListFileDinhKem) {
			data.FileDinhKem = this.ListFileDinhKem.filter(x => x.IsDel);
		  for (var i = 0; i < this.files.length; i++) {
			if (this.files[i].data && this.files[i].data.strBase64) {
				data.FileDinhKem.push(Object.assign({}, this.files[i].data));
			}
		  }
		}
		data.NgayBatDau = moment(controls['NgayBatDau'].value).format("DD-MM-YYYY")+" "+ (controls['TuNgayHour'].value.hour>=10?controls['TuNgayHour'].value.hour:"0"+controls['TuNgayHour'].value.hour) +":" +(controls['TuNgayHour'].value.minute>=10?controls['TuNgayHour'].value.minute:"0"+controls['TuNgayHour'].value.minute)  ;

		data.NgayKetThuc = moment(controls['NgayKetThuc'].value).format("DD-MM-YYYY") +" "+ (controls['DenNgayHour'].value.hour>=10?controls['DenNgayHour'].value.hour:"0"+controls['DenNgayHour'].value.hour) +":"+(controls['DenNgayHour'].value.minute>=10?controls['DenNgayHour'].value.minute:"0"+controls['DenNgayHour'].value.minute) ;
		if(this.IdCuocHop!='0')
		{

			if(data.NgayBatDau=='Invalid date 00:00')
			{
				data.NgayBatDau=null;

			}
			if(data.NgayKetThuc=='Invalid date 00:00'){
				data.NgayKetThuc=null;
			}
		}
		return data;
  }

  onSubmit(withBack: boolean = false) {
    this.hasFormErrors = false;
    this.loadingAfterSubmit = false;
    const controls = this.itemForm.controls;
    /* check form */
    if (this.itemForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }
    const updatedegree = this.prepareData();
    if (updatedegree.IdKhaoSat > 0) {
      this.Update(updatedegree);
    }
  }

  Update(_item: BangKhaoSatModel) {
    this.loadingAfterSubmit = true;
    this.viewLoading = true;
    this.disabledBtn = true;
    this.bangkhaosatService.updateQuanLyKhaoSat(_item).subscribe((res) => {
      this.disabledBtn = false;
      this.changeDetectorRefs.detectChanges();
      if (res && res.status === 1) {
        this.layoutUtilsService.showInfo('Gia hạn thành công');
        this.dialogRef.close({
          _item,
        });
      } else {
        this.layoutUtilsService.showError(res.error.message);
      }
    });
  }

  reset() {
    this.item = {} as BangKhaoSatModel;
    this.createForm();
    this.focusInput.nativeElement.focus();
    this.hasFormErrors = false;
    this.itemForm.markAsPristine();
    this.itemForm.markAsUntouched();
    this.itemForm.updateValueAndValidity();
  }

  close() {
    this.dialogRef.close();
  }

  new_row() {
    this.files.push({ data: {} });
  }

  selectFile(i) {
    let f = document.getElementById('FileUpLoad' + i);
    f.click();
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  detectChanges() {
    this.inputId.push(this.dataTem.Id);
    this.dataSource.push(this.dataTem);
    this.DSDanhGiaTam = this.dataSource;
    this.dataSource = this.DSDanhGiaTam.filter((x) => !x.IsDel);
    this.QuanLyKhaoSatForm.controls['Id'].setValue(this.inputId);
    this.changeDetectorRefs.detectChanges();
  }


  valuechange(value: any) {
    if (value.target.value == '') {
      // if(value.target.ariaLabel=="Hours")
      // 	{
      if (this.QuanLyKhaoSatForm.controls['TuNgayHour'].value == null)
        this.QuanLyKhaoSatForm.controls['TuNgayHour'].setValue({
          hour: 0,
          minute: 0,
        });
      if (this.QuanLyKhaoSatForm.controls['DenNgayHour'].value == null)
        this.QuanLyKhaoSatForm.controls['DenNgayHour'].setValue({
          hour: 0,
          minute: 0,
        });
      // 	}
      // if(value.target.ariaLabel=="Minutes")
      // 	{
      // 		if(this.QuanLyKhaoSatForm.controls['TuNgayHour'].value==null)
      // 			this.QuanLyKhaoSatForm.controls['TuNgayHour'].setValue({hour:0,minute:0});
      // 		if(this.QuanLyKhaoSatForm.controls['DenNgayHour'].value==null)
      // 			this.QuanLyKhaoSatForm.controls['DenNgayHour'].setValue({hour:0,minute:0});
      // 	}
    }
  }

  changeDoiTuong(event:any)
	{
		this.doituong=event.value;
		this.changeDetectorRefs.detectChanges();

	}
	changeTatCa(event:any)
	{
		this.IsTatCa=event.checked;
		this.changeDetectorRefs.detectChanges();
	}
  AddThanhVien() {
		if(this.IsXem)
		{
			return;
		}
		  let _item = this.listUser;
		  const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item }, width: '60%' });
		  dialogRef.afterClosed().subscribe(res => {
		  if (!res) {
			return;
		  }
		  this.listUser = res.data;
		  this.countnguoidung=this.listUser.length;
		  this.changeDetectorRefs.detectChanges();
		  });
	  }

	  deleteUser(user) {
		var index = this.listUser.findIndex((x) => x.idUser == user.idUser);
		this.listUser.splice(index, 1);
		this.countnguoidung--;
	  }
    selectEvent() {}
    close_ask() {
      const dialogRef = this.layoutUtilsService.deleteElement(
        this.translate.instant('COMMON.XACNHANDONG'),
        this.translate.instant('COMMON.CLOSED')
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          return;
        }
        this.dialogRef.close();
      });
    }
}
