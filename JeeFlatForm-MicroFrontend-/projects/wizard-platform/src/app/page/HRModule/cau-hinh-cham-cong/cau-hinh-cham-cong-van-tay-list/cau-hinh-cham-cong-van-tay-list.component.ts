import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { fromEvent, merge, BehaviorSubject, Subscription } from 'rxjs';
// RXJS
// Services

// Models
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { CauHinhChamCongService } from '../Services/cau-hinh-cham-cong.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { QuanLyThietBiModel, TimeModel } from '../Model/cau-hinh-cham-cong.model';
import { QuanLyThietBiEditComponent } from './quan-ly-thiet-bi-edit/quan-ly-thiet-bi-edit.component';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { DanhMucChungService } from '../../hr.service';


@Component({
  selector: 'app-cau-hinh-cham-cong-van-tay-list',
  templateUrl: './cau-hinh-cham-cong-van-tay-list.component.html',
  styleUrls: ["./cau-hinh-cham-cong-van-tay-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CauHinhChamCongVanTayListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'STT',
    'Title',
    'IP',
    'KetNoi',
    'ThoiGian',
    'actions',
  ];
  sortOrder: string;
  sortField: string;
  page: number;
  record: number;
  more: boolean;
  AllPage: any;
  flag: boolean;
  //============================================================
  removable = true;
	addOnBlur = true;
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	selectable = true;
  listAuto: any[] = [];
	listNext: any[] = [];
  constructor(
    public _CauHinhChamCongService: CauHinhChamCongService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private changeDetectorRefs: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private router: Router,
    public _DanhMucChungService : DanhMucChungService,
  ) { }
  daTV: boolean = false;
  /** LOAD DATA */
  ngOnInit() {
    this.sortOrder = 'asc';
    this.sortField = '';
    this.page = 0;
    this.record = 50;
    this.more = false;
    this.flag = true;
    this.LoadData();

    this._DanhMucChungService.getStrConfig(1,"hr_chamtay").subscribe(res => {
			if (res && res.status == 1 && res.data.length > 0) {
				//Giới thiệu
				this._DanhMucChungService.textHR8_3_1 = res.data[0] ? res.data[0].Mota : "";
				this._DanhMucChungService.textHR8_3_2 = res.data[1] ? res.data[1].Mota : "";
			}
			this.changeDetectorRefs.detectChanges();
		})
  }

  getHeight(): any {
    let tmp_height = 600 - 133;
    return tmp_height + "px";
  }

  TroLai() {
    this.router.navigate([`/WizardHR/Timekeeping`]);
  }

  TiepTuc() {
    this.router.navigate([`/WizardHR/Complete`]);
  }

  Add() {
    const chucvuModels = new QuanLyThietBiModel();
    chucvuModels.clear(); // Set all defaults fields
    this.Edit(chucvuModels);
  }

  Edit(_item: QuanLyThietBiModel) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += _item.ID > 0 ? 'JeeHR.capnhatthanhcong' : 'JeeHR.themthanhcong';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = _item.ID > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(QuanLyThietBiEditComponent, { data: { _item }, panelClass: ['hr-padding-0', 'width600'] });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.LoadData();
      }
      else {
        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
        this.LoadData();
      }
    });
  }

  Delete(_item: QuanLyThietBiModel) {
    const _title = this.translate.instant('JeeHR.xoa');
    const _description = this.translate.instant('JeeHR.bancochacchanmuonxoakhong');
    const _waitDesciption = this.translate.instant('JeeHR.dulieudangduocxoa');
    const _deleteMessage = this.translate.instant('JeeHR.xoathanhcong');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this._CauHinhChamCongService.deleteItem(_item.ID).subscribe(res => {
        if (res && res.status === 1) {
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
        }
        else {
          this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
        }
        this.LoadData();
      });
    });
  }
  //==================================================================
  LoadData() {
    this._CauHinhChamCongService.getAllItems().subscribe(
      (res) => {
        if (res && res.status == 1) {
          this.dataSource.data = res.data;
          this.dataSource.data.forEach(res => {
            this.listAuto = [];
            this.listNext = [];
            res.StartReadTime.split(",").map((item, index) => {
              if (item != "") {
                this.listAuto.push(item);
              }
            });
            res.listAuto = this.listAuto;
            res.Time.split(",").map((item, index) => {
              if (item != "") {
                this.listNext.push(item);
              }
            });
            res.listNext = this.listNext;
          })
        } else {
          this.dataSource.data = [];
        }
        this.changeDetectorRefs.detectChanges();
      }
    );
  }

  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop + 110 >=
      event.target.scrollHeight
    ) {
      if (this.page + 1 < this.AllPage && this.flag) {
        this.flag = false;
        this.page++;
        // this.LoadDataLazy();
      }
    }
  }

  filter(): any {
    const filterNew: any = {};
    return filterNew;
  }

  //=================================================================
  add(item: any, event: MatChipInputEvent): void {

		const input = event.input;
		const value = event.value;

		// Add our fruit
		if ((value || '').trim()) {

			var regex = /[a-zA-Z ]/g;
			var reg = /(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)/g;
			var reg1 = /(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/g;
			var found = value.match(regex);
			var found1 = value.match(reg1);
	
			let a = value.split(":");
			if (a.length == 3 && value.length == 8) {
				if (+a[0] > 23 || +a[0] < 0) {
					let message = value + ' không hợp lệ';
					this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
					return;
				} else if (+a[1] > 59 || +a[1] < 0) {
					let message = value + ' không hợp lệ';
					this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
					return;
				} else if (+a[2] > 59 || +a[2] < 0) {
					let message = value + ' không hợp lệ';
					this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
					return;
				} else {
					const index = item.listAuto.indexOf(value.trim());
					if (index != -1) {
						let message = value + ' đã tồn tại';
						this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
						return;
					}
					item.listAuto.push(value.trim());
				}
			} else {
				let message = value + ' không hợp lệ';
				this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
				return;
			}
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}
	}

	remove(item: any, fruit: any): void {
		const index = item.listAuto.indexOf(fruit);
		if (index >= 0) {
			item.listAuto.splice(index, 1);
		}
	}

  LuuData(item: any) {
		let mod = new TimeModel();
		mod.ID = item.ID;
		if (item.listAuto.length > 0) {
			let timeAuto = '';
			item.listAuto.map((item, index) => {
				timeAuto += "," + item;
			})
			mod.StartReadTime = timeAuto.substring(1);
		}
		mod.Time = item.TimeNew;
		this._CauHinhChamCongService.Update_Field(mod).subscribe(res => {
			if (res && res.status === 1) {
				this.LoadData();
				let message = this.translate.instant("JeeHR.capnhatthanhcong");
				this.layoutUtilsService.showActionNotification(message, MessageType.Read, 4000, true, false)
			}
			else {
				this.LoadData();
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}
}