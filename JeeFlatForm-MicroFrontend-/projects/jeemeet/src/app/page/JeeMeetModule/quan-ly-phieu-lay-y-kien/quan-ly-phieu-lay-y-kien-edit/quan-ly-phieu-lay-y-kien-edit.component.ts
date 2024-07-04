import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PhieuLayYKienService } from '../_services/quan-ly-phieu-lay-y-kien.service';
import { TranslateService } from '@ngx-translate/core';
import { PhieuLayYKienModel } from '../_models/quan-ly-phieu-lay-y-kien.model';
import { LayoutUtilsService } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';


@Component({
  selector: 'app-quan-ly-phieu-lay-y-kien-edit',
  templateUrl: './quan-ly-phieu-lay-y-kien-edit.component.html',
  styleUrls: ['./quan-ly-phieu-lay-y-kien-edit.component.scss']
})
export class QuanLyPhieuLayYKienEditComponent implements OnInit {

  item: PhieuLayYKienModel;
  itemForm: FormGroup;
  hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
  disabledBtn: boolean = false;
  IsXem: boolean = false;
  @ViewChild("focusInput", { static: true }) focusInput: ElementRef;

  constructor(public dialogRef: MatDialogRef<QuanLyPhieuLayYKienEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		public dialog: MatDialog,
		private changeDetectorRefs: ChangeDetectorRef,
		public  phieuLayYKienService: PhieuLayYKienService,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,) { }

    /** UI */


  //   if (!this.item || !this.item.id) {
  //     return this.translate.instant("OBJECT.ADD.TITLE",{
  //     name: this.translate
  //     .instant("MENU_PHONGHOP.NAME").toLowerCase(),
  // })
  // }
  // return this.translate.instant("OBJECT.UPDATE.TITLE", {
  //   name: this.translate
  //     .instant("MENU_PHONGHOP.NAME").toLowerCase(),
  // })+" - " + this.item.TenPhongHop;
	// }


  ngOnInit() {
    this.item = this.data._item;
    if (this.item.id > 0) {
      this.viewLoading = true;
      this.phieuLayYKienService.getPhongHopById(
				this.item.id
			).subscribe((res) => {
				// this.viewLoading = true;
				if (res && res.status == 1) {
					this.item = res.data;
					this.createForm();
					this.changeDetectorRefs.detectChanges();
			}});
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
			TenPhongHop: [this.item.TenPhongHop, Validators.required],
       GhiChu: [this.item.GhiChu]
		});
     this.itemForm.controls["TenPhongHop"].markAsTouched();
    if (this.IsXem)
		this.itemForm.disable();
		this.changeDetectorRefs.detectChanges();
	}

  /** ACTIONS */
	prepareData(): PhieuLayYKienModel {

		const controls = this.itemForm.controls;
		const _item = this.item;
		_item.id = this.item.id;
		_item.TenPhongHop = controls['TenPhongHop'].value;
   _item.GhiChu = controls['GhiChu'].value;
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
      if(!this.IsXem){
        return this.translate.instant("OBJECT.UPDATE.TITLE",{
          name: this.translate
          .instant("MENU_PHONGHOP.NAME").toLowerCase()})+" - "+this.item.TenPhongHop;
      } else {
        return this.translate.instant('OBJECT.DETAIL.TITLE',{
          name: this.translate
          .instant('MENU_PHONGHOP.NAME').toLowerCase()})+" - "+this.item.TenPhongHop;
      }
		}
    return this.translate.instant("OBJECT.ADD.TITLE", {
      name: this.translate
        .instant("MENU_PHONGHOP.NAME").toLowerCase()});

	}
  Update(_item: PhieuLayYKienModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.disabledBtn = true;
		this.phieuLayYKienService.update(_item,'/Update_PhongHop').subscribe(res => {
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

	Create(_item: PhieuLayYKienModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.disabledBtn = true;
		this.phieuLayYKienService.create(_item,'/Add_PhongHop').subscribe((res:any) => {
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
    this.item = {} as PhieuLayYKienModel
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
}
