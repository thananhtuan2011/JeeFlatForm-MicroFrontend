
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuanLySoTayCuocHopService } from '../_services/quan-ly-so-tay-cuoc-hop.service';
import { TranslateService } from '@ngx-translate/core';
import { SoTayCuocHopModel } from '../_models/quan-ly-so-tay-cuoc-hop.model';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';


@Component({
  selector: 'app-quan-ly-so-tay-cuoc-hop-edit',
  templateUrl: './quan-ly-so-tay-cuoc-hop-edit.component.html',
  styleUrls: ['./quan-ly-so-tay-cuoc-hop-edit.component.scss']
})
export class QuanLySoTayCuocHopEditComponent implements OnInit {

  item: SoTayCuocHopModel;
  itemForm: FormGroup;
  hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
  disabledBtn: boolean = false;
  IsXem: boolean = false;
  lstCuocHop: any[] = [];
  @ViewChild("focusInput", { static: true }) focusInput: ElementRef;

  constructor(public dialogRef: MatDialogRef<QuanLySoTayCuocHopEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		public dialog: MatDialog,
		private changeDetectorRefs: ChangeDetectorRef,
		public soTayCuocHopService: QuanLySoTayCuocHopService,
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
    this.lstCuocHop = [];
    if (this.item.id > 0) {
      this.viewLoading = true;
      this.soTayCuocHopService.getQuanLySoTayGhiChuCuocHopById(

				this.item.id
			).subscribe((res) => {
				// this.viewLoading = false;
				if (res && res.status == 1) {
					this.item = res.data;
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
			MeetingContent: [this.item.MeetingContent],
      NoiDungGhiChu: [this.item.NoiDungGhiChu, Validators.required],
      FromTime:[this.item.FromTime]
		});
     this.itemForm.controls["NoiDungGhiChu"].markAsTouched();
    if (this.IsXem)
		this.itemForm.disable();
		this.changeDetectorRefs.detectChanges();
	}

  /** ACTIONS */
	prepareData(): SoTayCuocHopModel {

		const controls = this.itemForm.controls;
    // var data: any = {};
		// //gán lại giá trị id
    // if (this.item.id > 0) {
		// 	data.Id = this.item.id;
		// }
		// data.NoiDungGhiChu = controls["NoiDungGhiChu"].value;
    // return data;
		const _item = this.item;
		_item.id = this.item.id;
    _item.NoiDungGhiChu = controls['NoiDungGhiChu'].value;
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
          .instant("MENU_STCUOCHOP.NAME").toLowerCase()})+" - "+this.item.MeetingContent;
      } else {
        return this.translate.instant('OBJECT.DETAIL.TITLE',{
          name: this.translate
          .instant('MENU_STCUOCHOP.NAME').toLowerCase()})+" - "+this.item.MeetingContent;
      }
		}
    return this.translate.instant("OBJECT.ADD.TITLE", {
      name: this.translate
        .instant("MENU_STCUOCHOP.NAME").toLowerCase()});

	}
  Update(_item: SoTayCuocHopModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.disabledBtn = true;
		this.soTayCuocHopService.update(_item,'/Update_SoTayCuocHop').subscribe(res => {
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

	Create(_item: SoTayCuocHopModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.disabledBtn = true;
		this.soTayCuocHopService.create(_item,'/Add_SoTayCuocHop').subscribe((res:any) => {
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
    this.item = {} as SoTayCuocHopModel
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
