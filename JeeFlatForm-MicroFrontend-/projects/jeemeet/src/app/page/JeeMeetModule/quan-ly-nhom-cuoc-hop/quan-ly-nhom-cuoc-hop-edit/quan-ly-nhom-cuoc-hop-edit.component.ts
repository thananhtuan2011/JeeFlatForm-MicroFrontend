
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuanLyNhomCuocHopService } from '../_services/quan-ly-nhom-cuoc-hop.service';
import { TranslateService } from '@ngx-translate/core';
import { NhomCuocHopModel } from '../_models/quan-ly-nhom-cuoc-hop.model';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { JeeChooseMemberComponent } from '../../components/jee-choose-member/jee-choose-member.component';
import { ChooseMemberV2Component } from '../../components/jee-choose-member/choose-menber-v2/choose-member-v2.component';


@Component({
  selector: 'app-quan-ly-nhom-cuoc-hop-edit',
  templateUrl: './quan-ly-nhom-cuoc-hop-edit.component.html',
  styleUrls: ['./quan-ly-nhom-cuoc-hop-edit.component.scss']
})
export class QuanLyNhomCuocHopEditComponent implements OnInit {

  item: NhomCuocHopModel;
  itemForm: FormGroup;
  hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
  disabledBtn: boolean = false;
  IsXem: boolean = false;
  lstCuocHop: any[] = [];
  listNguoi:any =  []
  listNguoi_dept:any =  []
  @ViewChild("focusInput", { static: true }) focusInput: ElementRef;

  constructor(public dialogRef: MatDialogRef<QuanLyNhomCuocHopEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		public dialog: MatDialog,
		private changeDetectorRefs: ChangeDetectorRef,
		public NhomCuocHopService: QuanLyNhomCuocHopService,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,) { }

  ngOnInit() {
    this.item = this.data._item;
    this.lstCuocHop = [];
    if (this.item.id > 0) {
      this.viewLoading = true;
      this.NhomCuocHopService.getQuanLyNhomGhiChuCuocHopById(
				this.item.id
			).subscribe((res) => {
				if (res && res.status == 1) {
					this.item = res.data[0];
          let data_user = []
          res.data.forEach(element => {
            if(element.listUsers && element.listUsers.length > 0){
                element.listUsers.forEach(el => {
                  let fields = {
                    idUser: el.UserId,
                    username: el.Username,
                    HoTen: el.FullName,
                    Image:el.AvartarImgURL,
                    ChucVu:el.Jobtitle,
                  }
                  data_user.push(fields)
                });
            }
          });
          this.listNguoi =  data_user;
          this.listNguoi_dept = res.data[0].listDepts
					this.createForm();
					this.changeDetectorRefs.detectChanges();
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
    else {
      this.viewLoading = false;
      this.reset()
    }
    this.createForm();
    this.focusInput.nativeElement.focus();
  }


  createForm() {
    this.IsXem = !this.data._item.allowEdit;
		this.itemForm = this.fb.group({
      TenNhom: [this.item.TenNhom, Validators.required],
		});
     if (this.IsXem){
      this.itemForm.disable();
     }
		this.changeDetectorRefs.detectChanges();
	}

  /** ACTIONS */
	prepareData(): NhomCuocHopModel {
		const controls = this.itemForm.controls;
		const _item = this.item;
		_item.id = this.item.id;
    _item.TenNhom = controls['TenNhom'].value;

    let data_user = []
          this.listNguoi_dept.forEach(element => {
            let fields = {
              idUser: 1111 + '|' + element.RowID,
              username: '',
              HoTen: '',
              Image: '',
              ChucVu: '',
            }
            data_user.push(fields)
          });
          this.listNguoi.push(...data_user);
    _item.listUsers = this.listNguoi;
		return _item;
	}

  onSubmit(withBack: boolean = false) {
    this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
    const controls = this.itemForm.controls;
    /* check form */
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

    const updatedegree = this.prepareData();
    if (updatedegree.id > 0) {
      this.Update(updatedegree);
    } else {
      this.Create(updatedegree, withBack);
    }
  }
	getTitle(): string {
    if ( this.item.id >0) {
      return 'Chỉnh sửa nhóm';
		}
    return 'Thêm nhóm';

	}
  Update(_item: NhomCuocHopModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.disabledBtn = true;
		this.NhomCuocHopService.update(_item,'/Update_NhomCuocHop').subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
        this.layoutUtilsService.showInfo('Cập nhật thành công');
				this.dialogRef.close({
          _item
        });
			}
			else {
				this.layoutUtilsService.showError(res.error.message);;
			}
		});
	}

	Create(_item: NhomCuocHopModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.disabledBtn = true;
		this.NhomCuocHopService.create(_item,'/Add_NhomCuocHop').subscribe((res:any) => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				if (withBack == true) {
          this.layoutUtilsService.showInfo('Thêm thành công');
					this.dialogRef.close({
						_item
					});
				}
				else {
          this.layoutUtilsService.showInfo('Thêm thành công');
					this.reset();
				}
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showError(res.error.message);
			}
		});
	}

  reset() {
    this.item = {} as NhomCuocHopModel
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
  close_ask() {
    const dialogRef = this.layoutUtilsService.deleteElement(this.translate.instant('COMMON.XACNHANDONG'), this.translate.instant('COMMON.CLOSED'));
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.dialogRef.close();
		});
  }

  deleteUser(user, doub = 0) {
    if(doub == 0){
    var index = this.listNguoi.findIndex((x:any) => x.idUser == user.idUser);
    this.listNguoi.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
    }
    if(doub == 1){
      var index = this.listNguoi_dept.findIndex((x) => x.RowID == user.RowID);
      this.listNguoi_dept.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
  }

  AddThanhVien(loai: number) {
    let _item = this.listNguoi;
    let meeet_type_nember = loai
    const list1 = this.listNguoi.map((obj) => obj.idUser+'##').join(',');
    const list2 = this.listNguoi_dept.map((obj) => obj.RowID).join(',');
    var inputNodeId = list1.concat(',', list2);
      const dialogRef = this.dialog.open(ChooseMemberV2Component, { data: { _item, inputNodeId,mprivate_meeet2:true, meeet_type_nember }, width: '60%' });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
        this.listNguoi = res.data
        this.listNguoi_dept = res.data2
        this.changeDetectorRefs.detectChanges();
      });
  }
}
