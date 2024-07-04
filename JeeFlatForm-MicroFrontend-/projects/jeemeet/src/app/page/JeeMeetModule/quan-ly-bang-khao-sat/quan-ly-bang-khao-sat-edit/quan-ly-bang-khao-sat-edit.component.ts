
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
import { QuanLyCauHoiKhaoSatEditComponent } from '../../quan-ly-cau-hoi-khao-sat/quan-ly-cau-hoi-khao-sat-edit/quan-ly-cau-hoi-khao-sat-edit.component';
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
  selector: 'app-quan-ly-bang-khao-sat-edit',
  templateUrl: './quan-ly-bang-khao-sat-edit.component.html',
  styleUrls: ['./quan-ly-bang-khao-sat-edit.component.scss'],
})
export class QuanLyBangKhaoSatEditComponent implements OnInit {
  item: any= {};
  BangKhaoSatForm: FormGroup;
  hasFormErrors: boolean = false;
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;
  disabledBtn: boolean = false;
  // QuanLyKhaoSat: any = {};
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
  filteredThanhPhanThamDu: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	ListThanhPhanThamDu: any[] = [];
	ListThanhPhanThamDuDetail: any[] = [];
  // Private password
  selectIDCuocHop: string = '0';
  IdCuocHop: string = '0';
  doituong: number = 0;
  DSDanhGiaTam: any[] = [];
  dataSource: any[] = [];
  DSCauHoi: any[] = [];
  DSCauHoiTam: any[] = [];
  ListFileDinhKem: any[] = [];
  countNhomNguoiDung: number = 0;
  group_tam: any[] = [];
  list_remove_tam: any[] = [];
  searchThanhPhanThamDu: string = "";
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

  domain = environment.CDN_DOMAIN ;

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


  tuGio: any[] = [];
  denGio: any[] = [];

  @ViewChild('focusInput', { static: true }) focusInput: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<QuanLyBangKhaoSatEditComponent>,
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

    if (this.data._item.IdKhaoSat > 0) {
      if(!this.IsXem){
        return this.translate.instant("OBJECT.UPDATE.TITLE",{
          name: this.translate
          .instant("MENU_BANGKHAOSAT.NAME").toLowerCase()})+" - "+this.data._item.TieuDe;
      } else {
        return this.translate.instant('OBJECT.DETAIL.TITLE',{
          name: this.translate
          .instant('MENU_BANGKHAOSAT.NAME').toLowerCase()})+" - "+this.data._item.TieuDe;
      }
		}
    return this.translate.instant("OBJECT.ADD.TITLE", {
      name: this.translate
        .instant("MENU_BANGKHAOSAT.NAME").toLowerCase()});
  }
  ngOnInit() {


    this.type = this.data.type ? this.data.type : this.type;
    if (this.data._data) {
			this.idM = this.data._data.IdM;
      this.IdCuocHop = this.data._data.IdM == 0? "0" :this.data._data.IdM;
			this.settingsSurvey = this.data._data.SettingsSurvey
				? this.data._data.SettingsSurvey
				: false;
		}
    this.GetListThanhPhanThamDuCuocHop();
    this.item = this.data._item;
    this.IsXem=this.data._item.IsXem? this.data._item.IsXem : this.IsXem;
    this.GetListAllCauHoi();
    this.GetListThanhPhanThamDuCuocHop();
    this.createForm();
    this.item.IdCuocHop = this.IdCuocHop;
		this.lstCuocHop = [];
    this.getListCuocHop(
			!this.item || this.item.IdKhaoSat == 0
				? 0
				: this.item.IdCuocHop
		);
		if (this.item.IdKhaoSat > 0 && this.type == 1) {
			this.bangkhaosatService.getTitle(this.item).subscribe(
				(res) => {
					this.viewLoading = false;
					if (res && res.status == 1) {
						this.titleN = res.data;
						this.changeDetectorRefs.detectChanges();
					}
				}
			);
		}
    if (this.item.IdKhaoSat> 0 && this.type == 0) {
      this.idMOld = this.item.IdCuocHop;
      this.viewLoading = true;
			this.bangkhaosatService.getQuanLyKhaoSatById(this.item.IdKhaoSat).subscribe((res) => {
				if (res && res.status == 1) {
					if (res.data.IdCuocHop != "0")
          {
						this.IdCuocHop = res.data.IdCuocHop;
					}
					this.item = res.data;
         // this.QuanLyKhaoSat.TieuDe=res.data.TieuDe;
					this.IsTatCa = res.data.IsTatCa;
					this.doituong=res.data.Type;
					this.IdCuocHop=""+res.data.IdCuocHop;
					// this.changeDetectorRefs.detectChanges();
					this.listUser = res.data.ListThamGia;
          this.listUser.forEach((element) => {
						this.ListThanhPhanThamDuDetail.push(element.idUser);
					});
					this.countnguoidung=this.listUser.length;
					this.ListFileDinhKem = res.data.lstKhaoSatDinhKem;
					this.item.RowID = res.data.RowID;
					this.dataSource = res.data.ChiTietDG;
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
					this.IdCuocHop=res.data.IdCuocHop;
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

    // this.focusInput.nativeElement.focus();
  }

  createForm() {
    // this.BangKhaoSatForm = this.fb.group({
    // 	MoTa: [this.item.moTa, Validators.required],
    // });
    // setTimeout(() => this.myInput.nativeElement.focus());
    let checkIndex = false;
    const index = this.lstCuocHop.findIndex((ex) => ex.RowID == this.idM);
    if (index >= 0) {
      checkIndex = true;
      this.IdCuocHop = this.idM + "";
    }
    this.IsXem = !this.data._item.allowEdit;
    this.isCopy = this.data.isCopy ? this.data.isCopy : false;
    this.startDateHour = {
      hour: this.item.NgayBatDau
        ? moment(this.item.NgayBatDau, 'DD/MM/YYYY hh:mm')
            .toDate()
            .getHours()
        : 0,
      minute: this.item.NgayBatDau
        ? moment(this.item.NgayBatDau, 'DD/MM/YYYY hh:mm')
            .toDate()
            .getMinutes()
        : 0,
    };
    this.nowDateHour = {
      hour: this.item.NgayKetThuc
        ? moment(this.item.NgayKetThuc, 'DD/MM/YYYY hh:mm')
            .toDate()
            .getHours()
        : 0,
      minute: this.item.NgayKetThuc
        ? moment(this.item.NgayKetThuc, 'DD/MM/YYYY hh:mm')
            .toDate()
            .getMinutes()
        : 0,
    };
    if (this.IdCuocHop == '0') {
      if (this.settingsSurvey) {
        this.item.IdCuocHop = this.idM;
      } else {
        this.item.IdCuocHop = this.IdCuocHop;
      }
      this.BangKhaoSatForm = this.fb.group({
        TieuDe: [
          this.item.TieuDe,
          [Validators.required, Validators.pattern(/[\S]/)],
        ],
        IsBatBuoc: [this.item.IsBatBuoc?this.item.IsBatBuoc:false],
        IsActive: [this.item.IsActive],
        IsTatCa: [this.item.IsTatCa?this.item.IsTatCa:false],
        Type: [this.doituong],
        Id: [
          this.inputId ? this.inputId : '',
          Validators.compose([Validators.required]),
        ],
        IdCuocHop: [
          this.settingsSurvey
            ? checkIndex
              ? this.idM + ''
              : '0'
            : !this.item.IdCuocHop
            ? '0'
            : '' + this.item.IdCuocHop,
        ],
        TuNgayHour: [
          this.startDateHour,
          Validators.compose([Validators.required]),
        ],
        NgayBatDau: [
          this.item.NgayBatDau
            ? moment(this.item.NgayBatDau, "DD/MM/YYYY HH:mm").toDate()
            : '',
        ],
        IsVangLai: [this.item.IsVangLai?this.item.IsVangLai:false],
        DenNgayHour: [
          this.nowDateHour,
          Validators.compose([Validators.required]),
        ],
        NgayKetThuc: [
          this.item.NgayKetThuc
            ? moment(
                this.item.NgayKetThuc,
                'DD/MM/YYYY HH:mm'
              ).toDate()
            : '',
        ],
        IdChuTri: [this.item.IdChuTri],
      });
      this.changeDetectorRefs.detectChanges();
    } else if (this.IdCuocHop != '0') {
      if (this.settingsSurvey) {
        this.item.IdCuocHop = this.idM;
      } else {
        this.item.IdCuocHop = this.IdCuocHop;
      }
      this.BangKhaoSatForm = this.fb.group({
        TieuDe: [
          this.item.TieuDe,
          [Validators.required, Validators.pattern(/[\S]/)],
        ],
        IsBatBuoc: [this.item.IsBatBuoc?this.item.IsBatBuoc:false],
        IsActive: [this.item.IsActive],
        IsTatCa: [this.item.IsTatCa?this.item.IsTatCa:false],
        Type: [this.doituong?this.doituong:0],
        // Type: [this.item.Type],

        Id: [
          this.inputId ? this.inputId : '',
          Validators.compose([Validators.required]),
        ],
        IdThanhPhanThamDu: [
					this.ListThanhPhanThamDuDetail
						? this.ListThanhPhanThamDuDetail
						: "",
				],
        IdCuocHop: [
          this.settingsSurvey
            ? checkIndex
              ? this.idM + ''
              : '0'
            : !this.item.IdCuocHop
            ? '0'
            : '' + this.item.IdCuocHop,
        ],
        TuNgayHour: [this.startDateHour],
				NgayBatDau: [
					this.item.NgayBatDau
						? moment(
								this.item.NgayBatDau,
								"DD/MM/YYYY HH:mm"
						  ).toDate()
						: "",
				],

				DenNgayHour: [this.nowDateHour],
				NgayKetThuc: [
					this.item.NgayKetThuc
						? moment(
								this.item.NgayKetThuc,
								"DD/MM/YYYY HH:mm"
						  ).toDate()
						: "",
				],
      });
    }
    // if (this.IsXem) this.itemForm.disable();
    this.changeDetectorRefs.detectChanges();
  }
  // ngAfterViewInit() {
  //   if (this.item.IdKhaoSat == 0) {
  //     let currentdate = new Date();
  //     let minutes = currentdate.getMinutes();

  //     let phut;
  //     if (minutes % 5 == 0) {
  //       if (minutes == 60) {
  //         this.GioBatDau =
  //           ("0" + currentdate.getHours() + 1).slice(-2) +
  //           ":" +
  //           "00";
  //       } else {
  //         if (minutes < 10) {
  //           this.GioBatDau =
  //             ("0" + currentdate.getHours()).slice(-2) +
  //             ":" +
  //             "0" +
  //             minutes;
  //         } else {
  //           this.GioBatDau =
  //             ("0" + currentdate.getHours()).slice(-2) +
  //             ":" +
  //             minutes;
  //         }
  //       }
  //     } else {
  //       do {
  //         minutes = minutes + 1;
  //         if (minutes % 5 == 0) {
  //           phut = minutes;
  //         }
  //       } while (minutes % 5 !== 0);
  //       if (phut < 10) {
  //         phut = "0" + phut;
  //       }
  //       if (phut == 60) {
  //         this.GioBatDau =
  //           ("0" + currentdate.getHours() + 1).slice(-2) + ":" + 0;
  //       } else {
  //         this.GioBatDau =
  //           ("0" + currentdate.getHours()).slice(-2) + ":" + phut;
  //       }
  //     }
  //     this.GioKetThuc = moment(this.GioBatDau, "HH:mm")
  //       .add({
  //         hours: 0,
  //         minutes: 30,
  //       })
  //       .format("HH:mm");
  //     this.NgayBatDau = new Date();
  //     this.NgayKetThuc = new Date();
  //     this.QuanLyKhaoSatForm.controls["NgayBatDau"].setValue(
  //       this.NgayBatDau + ""
  //     );
  //     this.QuanLyKhaoSatForm.controls["NgayKetThuc"].setValue(
  //       this.NgayKetThuc + ""
  //     );
  //     this.changeDetectorRefs.detectChanges();
  //   }
  // }
  /** ACTIONS */
  prepareData(): BangKhaoSatModel {
    const controls = this.BangKhaoSatForm.controls;
		var data: any = {};

		//gán lại giá trị id
		if (this.item.IdKhaoSat > 0) {
			data.IdKhaoSat = this.item.IdKhaoSat;
			data.IdMOld = this.idMOld;
		}
		data.TieuDe = controls["TieuDe"].value;
		// data.IsActive = controls["IsActive"].value;
		data.IsActive = false;
		data.IsBatBuoc = controls["IsBatBuoc"].value;
		data.IsTatCa = controls["IsTatCa"].value;
		if(this.IdCuocHop=='0')
    {
      data.IsVangLai = controls["IsVangLai"].value;
    }
    else
    {
      data.IsVangLai = false;
    }


		data.Type = controls["Type"].value;
		data.CauHoiKhaoSat = this.dataSource;
		data.IdCuocHop = controls["IdCuocHop"].value;
		data.ListUser = this.listUser;
		data.lstKhaoSatDinhKem = [];
		if (this.item.IdKhaoSat > 0 && this.IdCuocHop=='0')
		{
			data.IdChuTri = +controls["IdChuTri"].value;
		}
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
  submit() {
		let _data = this.item;
		this.copySurvey(_data);
	}
  onSubmit(withBack: boolean = false) {
    this.hasFormErrors = false;
    this.loadingAfterSubmit = false;
    const controls = this.BangKhaoSatForm.controls;
    if (!controls["TieuDe"].value ||controls["TieuDe"].value == "") {
			const mes = this.translate.instant(
				"MENU_KHAOSAT.CQBH_NHAPTIEUDE"
			);
			this.layoutUtilsService.showActionNotification(
				mes,
				MessageType.Error,
				2000,
				true,
				false
			);
			return;
		}
		if (this.IdCuocHop == "0") {
			if (
				!controls["NgayBatDau"].value ||
				controls["NgayBatDau"].value == 0
			) {
				const mes = this.translate.instant(
					"MENU_KHAOSAT.VUILONGCHON_NGAYBATDAU"
				);
				this.layoutUtilsService.showActionNotification(
					mes,
					MessageType.Error,
					2000,
					true,
					false
				);
				return;
			}
			if (
				!controls["NgayKetThuc"].value ||
				controls["NgayKetThuc"].value == 0
			) {
				const mes = this.translate.instant(
					"MENU_KHAOSAT.VUILONGCHON_NGAYKT"
				);
				this.layoutUtilsService.showActionNotification(
					mes,
					MessageType.Error,
					2000,
					true,
					false
				);
				return;
			}
		}
    if (!controls["Id"].value || controls["Id"].value == 0) {
			const mes = this.translate.instant(
				"MENU_KHAOSAT.VUILONGCHON_NOIDUNGCAUHOI"
			);
			this.layoutUtilsService.showActionNotification(
				mes,
				MessageType.Error,
				2000,
				true,
				false
			);
			return;
		}
    /* check form */
    if (this.BangKhaoSatForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }
    const updatedegree = this.prepareData();
    if (updatedegree.IdKhaoSat > 0) {
      this.Update(updatedegree);
    } else {
      this.Create(updatedegree, withBack);
    }
  }

  copySurvey(_data: BangKhaoSatModel) {
		_data.TieuDe = this.titleN;
		this.viewLoading = true;
		this.bangkhaosatService.copySurvey(_data).subscribe((res) => {
			this.viewLoading = false;
			if (res.status == 1) {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Create,
					2000,
					true,
					false
				);
				this.dialogRef.close(true);
			} else
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Error,
					2000,
					true,
					false
				);
		});
	}
  Update(_item: BangKhaoSatModel) {
    this.loadingAfterSubmit = true;
    this.viewLoading = true;
    this.disabledBtn = true;
    this.bangkhaosatService.updateQuanLyKhaoSat(_item).subscribe((res) => {
      this.disabledBtn = false;
      this.changeDetectorRefs.detectChanges();
      if (res && res.status === 1) {
        this.layoutUtilsService.showInfo('Cập nhật thành công');
        this.dialogRef.close({
          _item,
        });
      } else {
        this.layoutUtilsService.showError(res.error.message);
      }
    });
  }

  Create(_item: BangKhaoSatModel, withBack: boolean) {
    this.loadingAfterSubmit = true;
    this.disabledBtn = true;
    _item.IdCuocHop = this.idM;
    this.bangkhaosatService.createQuanLyKhaoSat(_item).subscribe((res: any) => {
      this.disabledBtn = false;
      this.changeDetectorRefs.detectChanges();
      if (res && res.status === 1) {
        if (withBack == true) {
          this.layoutUtilsService.showInfo('Thêm thành công');
          this.dialogRef.close({
            _item,
          });
        } else {
          this.layoutUtilsService.showInfo('Thêm thành công');
          this.reset();
        }
      } else {
        this.viewLoading = false;
        this.layoutUtilsService.showError(res.error.message);
      }
    });
  }
  selectCauHoi(e: any) {
		let dataBeta = []
		e.value.forEach(element => {
			let input = this.ListCauHoi.filter((item) => item.Id == element);
			let inputDrop = {
				Id: input[0].Id,
				NoiDungCauHoi: input[0].NoiDungCauHoi,
			};
			dataBeta.push(inputDrop);
		});
		this.dataSource = dataBeta.filter((x) => !x.IsDel);
		if (this.dataSource && this.dataSource.length > 0) {
			var flags = [], outputId = [], l = this.dataSource.length, i;
			for (i = 0; i < l; i++) {
				if (flags[this.dataSource[i].Id]) continue;
				flags[this.dataSource[i].Id] = true;
				outputId.push(this.dataSource[i].Id);
			}
			this.inputId = outputId;
		}
		this.changeDetectorRefs.detectChanges();

	}

  reset() {
    this.item = {} as BangKhaoSatModel;
    this.createForm();
   // this.focusInput.nativeElement.focus();
    this.hasFormErrors = false;
    this.BangKhaoSatForm.markAsPristine();
    this.BangKhaoSatForm.markAsUntouched();
    this.BangKhaoSatForm.updateValueAndValidity();
  }

  close() {
    this.dialogRef.close();
  }
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

  new_row() {
    this.files.push({ data: {} });
  }

  selectFile(i) {
    let f = document.getElementById('FileUpLoad' + i);
    f.click();
  }

  FileChoose(evt: any, index) {
    evt.stopPropagation();
    if (evt.target.files && evt.target.files.length) {
      let file = evt.target.files[0];
      var condition_type = file.type.split('/')[0];
      var condition_name = file.name.split('.').pop();
      if (condition_type == 'image') {
        if (file.size > environment.DungLuong) {
          var a = environment.DungLuong / 1048576;
          const message =
            this.translate.instant('MODULE_FEEDBACK.FileError', {
              file: this.file,
            }) + ` ${a} MB.`;
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Read,
            10000,
            true,
            false
          );
          return;
        }
        condition_name = condition_name.toLowerCase();
        const index_ = this.ExtensionImg.findIndex(
          (ex) => ex === condition_name
        );
        if (index_ < 0) {
          const message =
            this.translate.instant(
              'MODULE_FEEDBACK.ChooseFileExtension',
              { file: this.file }
            ) + ` (.${this.strExtensionImg})`;
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Read,
            10000,
            true,
            false
          );
          return;
        }
      } else if (condition_type == 'video') {
        if (file.size > environment.DungLuong) {
          var a = environment.DungLuong / 1048576;
          const message =
            this.translate.instant('MODULE_FEEDBACK.FileError', {
              file: this.file1,
            }) + ` ${a} MB.`;
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Read,
            10000,
            true,
            false
          );
          return;
        }
        condition_name = condition_name.toLowerCase();
        const index_ = this.ExtensionVideo.findIndex(
          (ex) => ex === condition_name
        );
        if (index_ < 0) {
          const message =
            this.translate.instant(
              'ChooseFileExtension',
              { file: this.file1 }
            ) + ` (.${this.strExtensionVideo})`;
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Read,
            10000,
            true,
            false
          );
          return;
        }
      } else {
        if (file.size > environment.DungLuong) {
          var a = environment.DungLuong / 1048576;
          const message =
            this.translate.instant('MODULE_FEEDBACK.FileError', {
              file: this.file2,
            }) + ` ${a} MB.`;
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Read,
            10000,
            true,
            false
          );
          return;
        }
        condition_name = condition_name.toLowerCase();
        const index_ = this.ExtensionFile.findIndex(
          (ex) => ex === condition_name
        );
        if (index_ < 0) {
          const message =
            this.translate.instant(
              'MODULE_FEEDBACK.ChooseFileExtension',
              { file: this.file2 }
            ) + ` (.${this.strExtensionFile})`;
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Read,
            10000,
            true,
            false
          );
          return;
        }
      }
      var filename = `${evt.target.files[0].name}`;
      let extension = '';
      for (var i = 0; i < this.files.length; i++) {
        if (this.files[i].data && this.files[i].data.filename == filename) {
          const message =
            `"${filename}" ` +
            this.translate.instant('MODULE_FEEDBACK.Added');
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Update,
            10000,
            true,
            false
          );
          evt.target.value = '';
          return;
        }
      }
      let reader = new FileReader();
      reader.readAsDataURL(evt.target.files[0]);
      let base64Str;
      reader.onload = function () {
        base64Str = reader.result as String;
        let lengName = evt.target.files[0].name.split('.').length;
        extension = `.${evt.target.files[0].name.split('.')[lengName - 1]}`;
        var metaIdx = base64Str.indexOf(';base64,');
        base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
      };
      setTimeout((res) => {
        var _file: any = {};
        _file.strBase64 = base64Str;
        _file.filename = filename;
        _file.extension = extension;
        _file.type = evt.target.files[0].type.includes('image') ? 1 : 2;
        _file.isnew = true;
        this.files[index].data = _file;
        this.changeDetectorRefs.detectChanges();
      }, 1000);
    }
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  addAsk() {
    this.editAsk(EMPTY_CUSTOM_CAUHOI);
  }
  editAsk(_item: CauHoiKhaoSatModel) {
    let ask = 1;
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    saveMessageTranslateParam +=
    _item.Id > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
    _item.Id > 0 ? MessageType.Update : MessageType.Create;
    if (_item.Id > 0) {
      _item.allowEdit = true;
    }
    const dialogRef = this.dialog.open(QuanLyCauHoiKhaoSatEditComponent, {
      data: { _item, ask },
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      let dataTem = {
        Id: Number(res.res.data.Id),
        NoiDungCauHoi: res.res.data.NoiDungCauHoi,
      };
      this.dataTem = dataTem;
      this.GetListAllCauHoi();
      setTimeout(() => {
        this.detectChanges();
      }, 2500);
    });
  }

  selectEvent() {}
  GetListAllCauHoi() {

		this.IdCuocHop = this.IdCuocHop;
		this.bangkhaosatService.GetListAllCauHoi(this.IdCuocHop).subscribe(
			(res) => {
				if (res && res.status == 1) {
					this.ListCauHoi = res.data;
					this.filteredndchs.next(this.ListCauHoi);
					this.changeDetectorRefs.detectChanges();
				}
			}
		);

	}

  deleteCauHoi(_item: any, index) {
		this.DSDanhGiaTam = this.dataSource;
		if (!_item.IdKhaoSat) {
			this.DSDanhGiaTam.splice(index, 1);
			this.dataSource = this.DSDanhGiaTam.filter((x) => !x.IsDel);
			const index1: number = this.inputId.indexOf(_item.Id);
			this.inputId.splice(index1, 1);
			this.QuanLyKhaoSatForm.controls['Id'].setValue(this.inputId);
		}
		else {
			this.DSDanhGiaTam.forEach((x) => {
				if (x.Id == _item.Id) {
					x.IsDel = true;
				}
			});
			this.dataSource = this.DSDanhGiaTam.filter((x) => !x.IsDel);
			const index2: number = this.inputId.indexOf(_item.Id);
			this.inputId.splice(index2, 1);
			this.QuanLyKhaoSatForm.controls['Id'].setValue(this.inputId);
		}
		this.changeDetectorRefs.detectChanges();

	}

  CauHoiChange() {
    if (!this.ListCauHoi) {
      return;
    }
    let search = this.searchCauHoi;
    if (!search) {
      this.filteredndchs.next(this.ListCauHoi.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredndchs.next(
      this.ListCauHoi.filter((ts) =>
        ts.NoiDungCauHoi != null
          ? ts.NoiDungCauHoi.toLowerCase().indexOf(search) > -1
          : false
      )
    );
    this.changeDetectorRefs.detectChanges();
  }

  detectChanges() {
    this.inputId.push(this.dataTem.Id);
    this.dataSource.push(this.dataTem);
    this.DSDanhGiaTam = this.dataSource;
    this.dataSource = this.DSDanhGiaTam.filter((x) => !x.IsDel);
    this.QuanLyKhaoSatForm.controls['Id'].setValue(this.inputId);
    this.changeDetectorRefs.detectChanges();
  }

  remove(index) {
    this.files.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
  }
  removeFile(index) {
    this.ListFileDinhKem[index].IsDel = true;
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

    filterNguoiDung() {
      if (!this.listUser) {
        return;
      }
      let search = this.searchNguoiDung;
      if (!search) {
        this.filteredNguoiDungs.next(this.listUser.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      this.filteredNguoiDungs.next(
        this.listUser.filter((ts) =>
          ts.FullName != null
            ? ts.FullName.toLowerCase().indexOf(search) > -1
            : false
        )
      );
      this.changeDetectorRefs.detectChanges();
    }
    loadNguoiDung() {
      this.bangkhaosatService.getloainhan().subscribe((res) => {
        if (res.status == 1 && res.data) {
          this.listUser = res.data;
          this.filterNguoiDung();
          this.changeDetectorRefs.detectChanges();
        }
      });
    }
    GetListThanhPhanThamDuCuocHop() {
      this.IdCuocHop = this.IdCuocHop;
      this.bangkhaosatService.GetThanhPhanThamDuByIdCuocHop(this.idM ).subscribe((res) => {
        if (res && res.status == 1) {
          this.ListThanhPhanThamDu = res.data;
          this.filteredThanhPhanThamDu.next(this.ListThanhPhanThamDu);
          this.changeDetectorRefs.detectChanges();
        }
      });
    }
    selectThanhPhan(e: any) {
      let dataBeta = [];
      e.value.forEach((element) => {
        let input = this.ListThanhPhanThamDu.filter(
          (item) => item.UserID == element
        );
        let inputDrop = {
          idUser: input[0].UserID,
          username: input[0].FullName,
        };
        dataBeta.push(inputDrop);
      });
      this.listUser = dataBeta.filter((x) => !x.IsDel);
      if (this.listUser && this.listUser.length > 0) {
        var flags = [],
          outputId = [],
          l = this.listUser.length,
          i;
        for (i = 0; i < l; i++) {
          if (flags[this.listUser[i].idUser]) continue;
          flags[this.listUser[i].idUser] = true;
          outputId.push(this.listUser[i].idUser);
        }
        this.inputId = outputId;
      }
      this.changeDetectorRefs.detectChanges();
    }
    ThanhPhanThamDuChange() {
      if (!this.ListThanhPhanThamDu) {
        return;
      }
      let search = this.searchThanhPhanThamDu;
      if (!search) {
        this.filteredThanhPhanThamDu.next(this.ListThanhPhanThamDu.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      this.filteredThanhPhanThamDu.next(
        this.ListThanhPhanThamDu.filter((ts) =>
          ts.FullName != null
            ? ts.FullName.toLowerCase().indexOf(search) > -1
            : false
        )
      );
      this.changeDetectorRefs.detectChanges();
    }
    getListCuocHop(Id: number) {
      this.bangkhaosatService.listCuocHop(Id).subscribe(
        (res) => {
          if (res) {
            if (res.status == 1) {
              this.lstCuocHop = res.data;
              this.changeDetectorRefs.detectChanges();
              if (this.settingsSurvey) {
                this.createForm();
              }
            }
          } else {
            let message = res.error.message;
            this.layoutUtilsService.showActionNotification(
              message,
              MessageType.Warning,
              2000,
              true,
              false
            );
          }
        },
        (err) => {
          const message = err.message;
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Warning,
            2000,
            true,
            false
          );
        }
      );
    }
    deleteThanhPhan(user) {
      var index = this.listUser.findIndex((x) => x.IdGroup == user.IdGroup);
      if (index >= 0) {
        this.list_remove_tam.push(this.group_tam[index]);
        this.group_tam.splice(index, 1);
        for (let i = 0; i < this.list_remove_tam.length; i++) {
          this.ListThanhPhanThamDu.unshift(this.list_remove_tam[i]);
          this.filteredThanhPhanThamDu.next(
            this.ListThanhPhanThamDu.slice()
          );
          this.list_remove_tam.splice(i, 1);
        }
        this.listUser.splice(index, 1);
        this.countNhomNguoiDung--;
      }
    }
}
