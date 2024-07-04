import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  Input,
  HostListener,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BehaviorSubject, Subscription, ReplaySubject } from "rxjs";
import {
  CachgiaoviecCombo,
  LinhvucyeucauComboDTO,
  PhanloaihotroDTO,
  PhanloaihotroModel,
} from "./../Model/phan-loai-ho-tro-management.model";
import {
  LayoutUtilsService,
  MessageType,
} from "projects/wizard-platform/src/modules/crud/utils/layout-utils.service";

import { TranslateService } from "@ngx-translate/core";
import { TicKetService } from "../../ticket.service";

export enum KEY_CODE {
  ENTER = 13,
}
@Component({
  selector: "app-phan-loai-ho-tro-management-edit-dialog",
  templateUrl: "./phan-loai-ho-tro-management-edit-dialog.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhanloaihotroEditDialogComponent implements OnInit {
  item: PhanloaihotroModel;
  itemForm = this.fb.group({
    Code: [
      "",
      Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+$/),
        Validators.maxLength(50),
      ]),
    ],
    Title: ["", [Validators.required,Validators.maxLength(200)]],
    QuanLy: [""],
    ThanhVien: [""],
    CachGiaoViec: [""],
    LinhVucYeuCau: [""],
    ThoiGianHoTro: [
      ,
      Validators.compose([
        Validators.required,
        Validators.pattern(/^(0|[0-9]\d*)$/),
      ]),
    ],
  });

  @ViewChild("focus") focus: ElementRef;

  Quanlys: string[] = [];
  Quanlys_new: string[] = [];
  QuanlysDelete: string[] = [];

  thanhViens: string[] = [];
  thanhViens_new: string[] = [];

  LinhvucyeucauCombo: LinhvucyeucauComboDTO[] = [];
  cachgiaoviecCombo: CachgiaoviecCombo[] = [
    { value: 1, viewValue: "Người quản lý phân công xử lý" },
    {
      value: 2,
      viewValue: "Giao cho người ít việc nhất trong danh sách người hỗ trợ",
    },
    { value: 3, viewValue: "Nhân viên chủ động nhận công việc" },
    { value: 4, viewValue: "Tất cả thành viên đều có thể hỗ trợ" },
  ];
  // End
  @Input() options: any = {
    showSearch: true, //hiển thị search input hoặc truyền keyword
    keyword: "",
    data: [],
  };
  @Input() isNewView = false;

  selected: any[] = [];
  selected_Assign: any[] = [];
  listUser: any[] = [];
  public userFilterCtrl: FormControl = new FormControl();
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  IsChangeUser = false;
  UserId = localStorage.getItem("idUser");
  ListFollower: string = "";
  // ngx-mat-search area
  isLoadingSubmit$: BehaviorSubject<boolean>;
  isLoading$: BehaviorSubject<boolean>;
  private subscriptions: Subscription[] = [];

  // End
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PhanloaihotroEditDialogComponent>,
    private fb: FormBuilder,
    private TicKetService: TicKetService,
    private layoutUtilsService: LayoutUtilsService,
    public cd: ChangeDetectorRef,
    private translateService: TranslateService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.isLoadingSubmit$ = new BehaviorSubject(false);
    this.isLoading$ = new BehaviorSubject(true);
    this.item = this.data.item;
    this.itemForm.controls["Code"].markAsTouched();
    this.itemForm.controls["Title"].markAsTouched();
    this.itemForm.controls["ThoiGianHoTro"].markAsTouched();
    this.itemForm.controls["CachGiaoViec"].markAsTouched();
    this.itemForm.controls["LinhVucYeuCau"].markAsTouched();

    if (this.item.RowID > 0) {
      this.isLoading$.next(true);

      this.TicKetService.GetPhanloaihotro2(this.item.RowID).subscribe(res => {
        if(res){
          this.item = res;
          this.selected = res.NguoiQuanLy;
          this.selected_Assign = res.ThanhVienHoTro;

          this.thanhViens = res.ThanhVienHoTro;
          this.Quanlys = res.NguoiQuanLy;

          this.cd.detectChanges();
        }
      })




      
      
      
      this.initData();

      this.cd.detectChanges();
    } else {
      this.item = new PhanloaihotroModel();
    }

    //combo donvitinh
    const add2 = this.TicKetService
      .getLinhvucyeucauCombo()
      .subscribe(res => {
        if (res && res.status === 1) {
          this.LinhvucyeucauCombo = res.data;
        }
      });

    this.TicKetService.Get_List_Account().subscribe((res) => {
      if (res && res.status === 1) {
        this.listUser = res.data;
        var index = this.listUser.find((x) => x.userid == this.UserId);
        if (index && !(this.item.RowID > 0)) {
          this.selected.push(index);
        }
        this.options = this.getOptions();
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  getOptions() {
    var options: any = {
      showSearch: true,
      keyword: this.getKeyword(),
      data: this.listUser.filter(
        (x) => this.selected.findIndex((y) => x.userid == y.userid) < 0
      ),
    };
    return options;
  }
  getKeyword() {
    let i = this.ListFollower.lastIndexOf("@");
    if (i >= 0) {
      let temp = this.ListFollower.slice(i);
      if (temp.includes(" ")) return "";
      return this.ListFollower.slice(i);
    }
    return "";
  }

  initData() {
    this.selected.length = 0;
    this.selected_Assign.length = 0;
    this.itemForm.controls.Code.patchValue(this.item.Code);
    this.itemForm.controls.Title.patchValue(this.item.Title);
    this.itemForm.controls.CachGiaoViec.patchValue(this.item.AssignMethod);
    this.itemForm.controls.ThoiGianHoTro.patchValue(this.item.SLA);
    this.itemForm.controls.LinhVucYeuCau.patchValue(this.item.CategoryID1);
  }

  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
    if (event.keyCode === KEY_CODE.ENTER && event.ctrlKey) {
      this.onSubmit(true);
    }
  }

  onSubmit(check: boolean) {
    if (this.itemForm.valid) { 
      const phanloai = this.initDataFromFB();
      if(phanloai.SLA.toString().length < 6)
      {
              if (phanloai.NguoiQuanLy.length == 0) {
        this.layoutUtilsService.showActionNotification('Người quản lý bắt buộc nhập', MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        return;
      }
      if (phanloai.ThanhVienHoTro.length == 0) {
        this.layoutUtilsService.showActionNotification('Thành viên hỗ trợ bắt buộc nhập', MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        return;
      }
      if (this.item.RowID > 0) {
        this.update(phanloai, check);
      } else {
        this.create(phanloai, check); 
      }
      }
      else{
        this.layoutUtilsService.showActionNotification('Thời gian hỗ trợ tối đa 5 kí tự', MessageType.Read, 999999999, true, false, 3000, 'top', 0);

      }

      
    } else {
      this.validateAllFormFields(this.itemForm);
    }
  }
  check_maxtime(){
    if(this.itemForm.controls.ThoiGianHoTro.value.length>5){
      this.layoutUtilsService.showActionNotification('Thời gian hỗ trợ tối đa 5 kí tự', MessageType.Read, 999999999, true, false, 3000, 'top', 0);
    }
  }

  getTitle() {
    if (this.item.RowID > 0) {
      return this.translateService.instant(
        "Chỉnh sửa"
      );
    }
    return this.translateService.instant("Thêm mới");
  }

  update(depart: PhanloaihotroModel, check: boolean) {
    this.isLoadingSubmit$.next(true);
    this.TicKetService.UpdateDepart(depart).subscribe(
      (res) => {
        if(res && res.status ===1){
          this.isLoadingSubmit$.next(false);
          this.dialogRef.close(true);
        }
        else{
          this.isLoadingSubmit$.next(false);
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Read,
            999999999,
            true,
            false,
            3000,
            "top",
            0
          );
        }
        
      },
      (error) => {
        this.isLoadingSubmit$.next(false);
        this.layoutUtilsService.showActionNotification(
          error.error.message,
          MessageType.Read,
          999999999,
          true,
          false,
          3000,
          "top",
          0
        );
      }
    );
  }
  create(phanloaihotro: PhanloaihotroModel, check: boolean) {

    this.isLoadingSubmit$.next(true);
    this.TicKetService
      .CreatePhanloaihotro(phanloaihotro)
      .subscribe((res) => {
        if (res && res.status === 1) {
          this.isLoadingSubmit$.next(false);
          if (check == true) {
            this.layoutUtilsService.showActionNotification(
              "Thêm thành công",
              MessageType.Read,
              4000,
              true,
              false
            );
            this.initData();
            this.focus.nativeElement.focus();
          } else {
            this.dialogRef.close(true);
          }
        } else {
          this.isLoadingSubmit$.next(false);
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Read,
            999999999,
            true,
            false,
            3000,
            "top",
            0
          );
        }
      });
  }

  initDataFromFB(): PhanloaihotroModel {

    const phanloai = new PhanloaihotroModel();
    phanloai.clear();
    phanloai.Code = this.itemForm.controls.Code.value;
    phanloai.Title = this.itemForm.controls.Title.value;
    phanloai.AssignMethod = this.itemForm.controls.CachGiaoViec.value;
    phanloai.SLA = this.itemForm.controls.ThoiGianHoTro.value;
    phanloai.CategoryID1 = this.itemForm.controls.LinhVucYeuCau.value;
    if (this.item.RowID > 0) {
      phanloai.RowID = this.item.RowID;
    }
    //phanloai.NguoiQuanLyDelete = this.Quanlys;
    this.Quanlys.forEach((element: any) => {
      phanloai.NguoiQuanLyDelete.push(element.username);
    })
    //phanloai.ThanhVienHoTroDelete = this.thanhViens;
    this.thanhViens.forEach((element: any) => {
      phanloai.ThanhVienHoTroDelete.push(element.username);
    })

    // this.Quanlys.length = 0;
    // this.thanhViens.length = 0;
    this.Quanlys_new = [];
    let a = this.selected.forEach((element) =>
      this.Quanlys_new.push(element.username)
    );
    phanloai.NguoiQuanLy = this.unique(this.Quanlys_new);
    this.thanhViens_new = [];
    this.selected_Assign.forEach((element) =>
      this.thanhViens_new.push(element.username)
    );
    phanloai.ThanhVienHoTro = this.unique(this.thanhViens_new);
    return phanloai;
  }
  unique(arr) {
    return Array.from(new Set(arr));
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  goBack() {
    this.dialogRef.close(false);
  }

  stopPropagation(event) {
    event.stopPropagation();
  }
  ItemSelected(data) {
    this.IsChangeUser = true;
    if (data.userid == this.UserId && !(this.item.RowID > 0)) {
      return;
    }
    var index = this.selected.findIndex((x) => x.userid == data.userid);

    if (index >= 0) {
      this.selected.splice(index, 1);
    } else {
      // var index2 = this.selected_Assign.findIndex(
      //   (x) => x.userid == data.userid
      // );
      // if (index2 >= 0) {
      //   this.selected_Assign.splice(index2, 1);
      // }
      this.selected.push(data);
    }
  }
  ItemSelected_Assign(data) {
    this.IsChangeUser = true;
    if (data.userid == this.UserId && !(this.item.RowID > 0)) {
      return;
    }
    var index = this.selected_Assign.findIndex((x) => x.userid == data.userid);

    if (index >= 0) {
      this.selected_Assign.splice(index, 1);
    } else {
      // var index2 = this.selected.findIndex((x) => x.userid == data.userid);
      // if (index2 >= 0) {
      //   this.selected.splice(index2, 1);
      // }
      this.selected_Assign.push(data);
    }
  }


  getName(val) {
		var x = val.split(' ');
		return x[x.length - 1];
	}
	getColorNameUser(fullname) {
		var name = this.getNameUser(fullname).substr(0, 1);
		switch (name) {
			case 'A':
				return '#6FE80C';
			case 'B':
				return '#02c7ad';
			case 'C':
				return 'rgb(123, 104, 238)';
			case 'D':
				return '#16C6E5';
			case 'Đ':
				return '#959001';
			case 'E':
				return '#16AB6B';
			case 'G':
				return '#2757E7';
			case 'H':
				return '#B70B3F';
			case 'I':
				return '#390FE1';
			case 'J':
				return 'rgb(4, 169, 244)';
			case 'K':
				return '#2209b7';
			case 'L':
				return '#759e13';
			case 'M':
				return 'rgb(255, 120, 0)';
			case 'N':
				return '#bd3d0a';
			case 'O':
				return '#10CF99';
			case 'P':
				return '#B60B6F';
			case 'Q':
				return 'rgb(27, 188, 156)';
			case 'R':
				return '#6720F5';
			case 'S':
				return '#14A0DC';
			case 'T':
				return 'rgb(244, 44, 44)';
			case 'U':
				return '#DC338B';
			case 'V':
				return '#DF830B';
			case 'X':
				return 'rgb(230, 81, 0)';
			case 'W':
				return '#BA08C7';
			default:
				return '#21BD1C';
		}
	}
	CheckRule(val, id) {
		if (val.indexOf(id) !== -1) {
			return true;
		}
		return false;
	}
	getNameUser(val) {
		if (val) {
			var list = val.split(' ');
			return list[list.length - 1];
		}
		return '';
	}
}
