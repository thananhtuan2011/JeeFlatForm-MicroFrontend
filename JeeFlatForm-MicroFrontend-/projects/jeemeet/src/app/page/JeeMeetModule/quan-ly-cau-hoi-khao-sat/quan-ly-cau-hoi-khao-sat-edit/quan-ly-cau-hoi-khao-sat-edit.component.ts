import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuanLyCauHoiKhaoSatService } from '../_services/quan-ly-cau-hoi-khao-sat.service';
import { TranslateService } from '@ngx-translate/core';
import { CauHoiKhaoSatModel } from '../_models/quan-ly-cau-hoi-khao-sat.model';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';

@Component({
  selector: 'app-quan-ly-cau-hoi-khao-sat-edit',
  templateUrl: './quan-ly-cau-hoi-khao-sat-edit.component.html',
  styleUrls: ['./quan-ly-cau-hoi-khao-sat-edit.component.scss']
})
export class QuanLyCauHoiKhaoSatEditComponent implements OnInit {

  item: CauHoiKhaoSatModel;
  itemForm: FormGroup;
  hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
  disabledBtn: boolean = false;
  IsXem: boolean = false;
  QuanLyCauHoiKhaoSat: CauHoiKhaoSatModel;
	Type: number = 1;
  trangthai: number = 0;
	dataSource: any[] = [];
	displayedColumns: string[] = ["STT", "CauTraLoi", "action"];
	dscauhoi: any[] = [];
  @ViewChild("focusInput", { static: true }) focusInput: ElementRef;
	ask: number = 0;
  accs: any[] = [];
  constructor(public dialogRef: MatDialogRef<QuanLyCauHoiKhaoSatEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		public dialog: MatDialog,
		private changeDetectorRefs: ChangeDetectorRef,
		public cauhoiService: QuanLyCauHoiKhaoSatService,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,) { }

    /** UI */

    ngOnInit()
    {
      this.item = this.data._item;
      if (this.data.ask) {
        this.ask = this.data.ask;
      }
      if (this.item.Id > 0) {
        this.viewLoading = true;
        this.createForm();
        this.cauhoiService.getQuanLyCauHoiKhaoSatById(this.item.Id).subscribe((res) => {
          if (res && res.status == 1) {
            this.QuanLyCauHoiKhaoSat = res.data;
            this.dataSource = res.data.DanhSachCauTraLoi;
            this.dscauhoi = res.data.DanhSachCauTraLoi;
            this.Type = res.data.Type;
            this.trangthai = this.Type;
            this.accs = res.data.accs;
            this.createForm(true);
            this.changeDetectorRefs.detectChanges();
          } else
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Read,
              2000,
              true,
              false
            );
        })
      }
      else {
        this.viewLoading = false;
        this.reset()
      }
    }

  createForm(flag: boolean = false) {
      // this.IsXem = !this.data.item.allowEdit;
      if(flag==false) {
        this.itemForm = this.fb.group({
          CauTraLoi: [""],
          NoiDungCauHoi: ["",[Validators.required, Validators.pattern(/[\S]/)],],
          Type: [this.Type,Validators.compose([Validators.required]),],
        });
        this.itemForm.markAsTouched();
		    this.changeDetectorRefs.detectChanges();
      }
      else
      {
        this.itemForm = this.fb.group({
          CauTraLoi: [""],
          NoiDungCauHoi: [this.QuanLyCauHoiKhaoSat.NoiDungCauHoi?this.QuanLyCauHoiKhaoSat.NoiDungCauHoi:"",[Validators.required, Validators.pattern(/[\S]/)],],
          Type: [this.Type,Validators.compose([Validators.required]),],
        });
        this.itemForm.markAsTouched();
	    	this.changeDetectorRefs.detectChanges();
      }

	}
  changeSelection($event) {
		this.trangthai = $event.value;
		this.Type = this.trangthai;
		this.dataSource = [];
		// this.createForm(true);
	}

  getTitle(): string {
    if ( this.item.Id >0) {
      if(!this.IsXem){
        return this.translate.instant("OBJECT.UPDATE.TITLE",{
          name: this.translate
          .instant("MENU_CAUHOIKHAOSAT.NAME").toLowerCase()})+" - "+this.item.NoiDungCauHoi;
      } else {
        return this.translate.instant('OBJECT.DETAIL.TITLE',{
          name: this.translate
          .instant('MENU_CAUHOIKHAOSAT.NAME').toLowerCase()})+" - "+this.item.NoiDungCauHoi;
      }
		}
    return this.translate.instant("OBJECT.ADD.TITLE", {
      name: this.translate
        .instant("MENU_CAUHOIKHAOSAT.NAME").toLowerCase()});

	}
  /** ACTIONS */
	prepareData(): CauHoiKhaoSatModel {
		const controls = this.itemForm.controls;
		var data: any = {};
		//gán lại giá trị id
		if (this.data._item.Id > 0) {
			data.Id = this.data._item.Id;
		}
		if (this.data._item.IdCauTraLoi > 0) {
			data.IdCauTraLoi = this.data._item.IdCauTraLoi;
		}

		//data.CauTraLoi = controls['CauTraLoi'].value;
		data.NoiDungCauHoi = controls["NoiDungCauHoi"].value;
		data.Type = this.Type;
		if (this.data._item.Id > 0) {
			data.NoiDungCauTraLoi = this.dscauhoi;
		} else {
			data.NoiDungCauTraLoi = this.dataSource;
		}
		return data;
	}

  onSubmit(withBack: boolean = false) {

    this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
    const controls = this.itemForm.controls;
    if (!controls['Type'].value) {
			const mes = this.translate.instant('MENU_CAUHOIKHAOSAT.VUILONGCHON_TYPE');
			this.layoutUtilsService.showActionNotification(
				mes,
				MessageType.Error,
				2000,
				true,
				false
			);
			return;
		}
    if (controls['NoiDungCauHoi'].value=='') {
			const mes = this.translate.instant('MENU_CAUHOIKHAOSAT.VUILONGNHAP_NOIDUNGCAUHOI');
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
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}
    let editedQuanLyCauHoiKhaoSat = this.prepareData();
		if (this.data._item.Id > 0) {
			this.updateQuanLyCauHoiKhaoSat(editedQuanLyCauHoiKhaoSat);
			return;
		}
		if (this.ask==1) {
			this.addAsk(editedQuanLyCauHoiKhaoSat);
		}
		else {
			this.addQuanLyCauHoiKhaoSat(editedQuanLyCauHoiKhaoSat);
		}
    // const updatedegree = this.prepareData();
    // if (updatedegree.id > 0) {
    //   this.Update(updatedegree);
    // } else {
    //   this.Create(updatedegree, withBack);
    // }
  }

  Update(item: CauHoiKhaoSatModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.disabledBtn = true;
		this.cauhoiService.update(item).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
        this.layoutUtilsService.showInfo('Cập nhật thành công');
				this.dialogRef.close({
          item
        });
			}
			else {
				this.layoutUtilsService.showError(res.error.message);;
			}
		});
	}

	Create(item: CauHoiKhaoSatModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.disabledBtn = true;
		this.cauhoiService.create(item).subscribe((res:any) => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				if (withBack == true) {
          this.layoutUtilsService.showInfo('Thêm thành công');
					this.dialogRef.close({
						item
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
  addCauTraLoi(
		_QuanLyCauHoiKhaoSat: CauHoiKhaoSatModel,
		withBack: boolean = false
	) {
		//
		this.viewLoading = true;
		this.cauhoiService.createQuanLyCauTraLoi(
			_QuanLyCauHoiKhaoSat
		).subscribe((res) => {
			this.viewLoading = false;
			if (res.status == 1) {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Delete,
					2000,
					true,
					false
				);
				this.dialogRef.close({ _QuanLyCauHoiKhaoSat, isEdit: false });
			} else
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Read,
					2000,
					true,
					false
				);
		});
	}

	updateCauTraLoi(
		_QuanLyCauHoiKhaoSat: CauHoiKhaoSatModel,
		withBack: boolean = false
	) {
		this.viewLoading = true;
		this.cauhoiService.updateCauTraLoi(
			_QuanLyCauHoiKhaoSat
		).subscribe((res) => {
			this.viewLoading = false;
			if (res.status == 1) {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Delete,
					2000,
					true,
					false
				);
				this.dialogRef.close({ _QuanLyCauHoiKhaoSat, isEdit: true });
			} else
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Read,
					20000,
					true,
					false
				);
		});
	}
  reset() {
    this.item = {} as CauHoiKhaoSatModel
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

  deleteCauTraLoi(_item: any,item:any=1) {
		if (_item.Id == 0||_item.Id==undefined) {
			const index1: number = this.dscauhoi.indexOf(_item);
			this.dscauhoi.splice(index1, 1);
			this.dataSource = this.dscauhoi;
			this.dataSource = this.dscauhoi.filter((x) => !x.IsDel);
		} else {
			this.dscauhoi.forEach((x) => {
				if (x.IdCauTraLoi == _item.IdCauTraLoi) {
					x.IsDel = true;
				}
			});
			this.dataSource = this.dscauhoi.filter((x) => !x.IsDel);
		}

		this.changeDetectorRefs.detectChanges();
	}


	addChiTiet() {
		const controls = this.itemForm.controls;
		if (controls["CauTraLoi"].value == "") {
			const mes = "Vui lòng nhập câu trả lời!";
			this.layoutUtilsService.showActionNotification(
				mes,
				MessageType.Read,
				2000,
				true,
				false
			);
			return;
		}
		let ch = {
			CauTraLoi: this.itemForm.controls["CauTraLoi"].value,
			IsDel: false,
		};
		this.dscauhoi.push(ch);
		this.itemForm.controls["CauTraLoi"].setValue("");

		this.dataSource = this.dscauhoi.filter((z) => !z.IsDel);
		this.changeDetectorRefs.detectChanges();
		this.data._item.CauTraLoi = this.dataSource;
	}
  addQuanLyCauHoiKhaoSat(
		_QuanLyCauHoiKhaoSat: CauHoiKhaoSatModel,
		withBack: boolean = false
	) {
		//
		this.viewLoading = true;
		this.cauhoiService.createQuanLyCauHoiKhaoSat(
			_QuanLyCauHoiKhaoSat
		).subscribe((res) => {
			this.viewLoading = false;
			if (res.status == 1) {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Delete,
					2000,
					true,
					false
				);
				this.dialogRef.close({ _QuanLyCauHoiKhaoSat , isEdit: false });
			} else
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Read,
					2000,
					true,
					false
				);
		});
	}
  updateQuanLyCauHoiKhaoSat(
		_QuanLyCauHoiKhaoSat: CauHoiKhaoSatModel,
		withBack: boolean = false
	) {
		this.viewLoading = true;
		this.cauhoiService.updateQuanLyCauHoiKhaoSat(
			_QuanLyCauHoiKhaoSat
		).subscribe((res) => {
			this.viewLoading = false;
			if (res.status == 1) {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Delete,
					2000,
					true,
					false
				);
				this.dialogRef.close({ _QuanLyCauHoiKhaoSat, isEdit: true });
			} else
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Read,
					20000,
					true,
					false
				);
		});
	}
  addAsk(
		_QuanLyCauHoiKhaoSat: CauHoiKhaoSatModel,
		withBack: boolean = false
	) {
		//
		this.viewLoading = true;
		this.cauhoiService.createQuanLyCauHoiKhaoSat(
			_QuanLyCauHoiKhaoSat
		).subscribe((res) => {
			this.viewLoading = false;
			if (res.status == 1) {
				// this.layoutUtilsService.showActionNotification(
				// 	res.error.message,
				// 	MessageType.Delete,
				// 	2000,
				// 	true,
				// 	false
				// );
				// var a:any={};
				// a={...res};
				this.dialogRef.close({ res });
			} else
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Read,
					2000,
					true,
					false
				);
		});
	}
}
