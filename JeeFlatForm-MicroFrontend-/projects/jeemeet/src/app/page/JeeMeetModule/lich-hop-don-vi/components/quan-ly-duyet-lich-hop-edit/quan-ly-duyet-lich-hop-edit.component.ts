
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DuyetCuocHopModel } from '../../_models/quan-ly-duyet-lich-hop.model';
import { LayoutUtilsService } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { CalendarService } from '../../_services/lich-hop-don-vi.service';

@Component({
  selector: 'app-quan-ly-duyet-lich-hop-edit',
  templateUrl: './quan-ly-duyet-lich-hop-edit.component.html',
  styleUrls: ['./quan-ly-duyet-lich-hop-edit.component.scss']
})
export class QuanLyDuyetCuocHopEditComponent implements OnInit {

  item: any;
  itemForm: FormGroup;
  NoiDungKetLuan: string;
  NoiDungTomTat: string
  noidung: string
  ShowEditorTomTat: boolean = false
  ShowEditorKetLuan: boolean = false
  ShowCongViec: boolean = false
  btnSend: boolean = false
  TenDuAn: string
  isLoader: boolean = false
  CuocHop: any[] = []
  ID_Meeting: number
  tinyMCE = {};
  Type: number
  labelFilter: string = 'Tất cả';
  tinhTrang: any = '0'
  listNguoiThamGia: any[] = [];
  listNguoiThamGiaRemove: any[] = [];
  isExist: boolean = true;
  idS: number = 0;
  R: any = {};
  public startDateHour = { hour: 0, minute: 0 };
  public nowDateHour = { hour: 0, minute: 0 };
  hasFormErrors: boolean = false;
  viewLoading: boolean = true;
  showForm: boolean = false;
  lstError: string = "";
  searchHH: string = '';
  searchCha: string = '';
  ListTask = [];
  IsXem: boolean = false;
  listTask: any[] = [];
  listCha: any[] = [];
  TypeTask: number = 0;
  NoiDungDienBien: string;
  idMR: number = 0;
  constructor(public dialogRef: MatDialogRef<QuanLyDuyetCuocHopEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    public DuyetCuocHopService: CalendarService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,) { }
  /** UI */

  ngOnInit() {

    this.item = this.data._item;
    this.DuyetCuocHopService.GetDetail_DuyetByIdCH(this.item._def.publicId).subscribe(res => {
      if (res.status == 1) {
        this.CuocHop = res.data;
        this.noidung = res.data[0].TomTatNoiDung
        this.idS = res.data[0] ? res.data[0].IdKhaoSat : this.idS;
        this.isExist = res.data[0] ? res.data[0].IsExist : this.isExist;
        this.NoiDungDienBien = res.data[0].NoiDungDienBienCuocHop
        this.idMR = res.data[0] ? res.data[0].IdPhongHop : 0;
      }
    });
  }

  f_convertHour2(v: any) {
    if (v != "" && v != null) {
      let a = new Date(v);
      return (
        ("0" + a.getHours()).slice(-2) + ":" + ("0" + a.getMinutes()).slice(-2)
      );
    }
  }
  converDate(v: any) {
    let a = new Date(v);
    return ("0" + a.getDate()).slice(-2) + " - " + ("0" + (a.getMonth() + 1)).slice(-2)
  }
  LayThu(v: any) {
    let day = new Date(v);
    switch (day.getDay()) {
      case 0:
        return this.translate.instant("QL_CUOCHOP.WEEKDAY.SUN")
      case 1:
        return this.translate.instant("QL_CUOCHOP.WEEKDAY.MON")
      case 2:
        return this.translate.instant("QL_CUOCHOP.WEEKDAY.TUE")
      case 3:
        return this.translate.instant("QL_CUOCHOP.WEEKDAY.WED")
      case 4:
        return this.translate.instant("QL_CUOCHOP.WEEKDAY.THU")
      case 5:
        return this.translate.instant("QL_CUOCHOP.WEEKDAY.FRI")
      case 6:
        return this.translate.instant("QL_CUOCHOP.WEEKDAY.SAT")
    }
  }
  checkClass1(item: any) {
    if (item == -1)
      return "date-edit"
    return "date"
  }
  checkClass2(item: any) {
    if (item == -1)
      return "w-edit"
    return "w"
  }
  copy(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  onLinkClick(selectedTab: any) {
    if (selectedTab == 0) {
      this.tinhTrang = "0";
      this.labelFilter = "Tất cả"
    } else if (selectedTab == 1) {
      this.tinhTrang = "1";
      this.labelFilter = "Tham gia"
    } else if (selectedTab == 2) {
      this.tinhTrang = "2";
      this.labelFilter = "Chờ xác nhận"
    } else if (selectedTab == 3) {
      this.tinhTrang = "3";
      this.labelFilter = "Từ chối"
    }
  }
  getTenTinhTrang(condition: number = 0, xacnhan: any): string {
    if (!xacnhan) return "Tham gia";
    switch (condition) {
      case 1:
        return "Tham gia";
      case 2:
        return "Từ chối tham gia";
    }
    return "Chờ xác nhận";
  }


  createForm() {
    this.IsXem = !this.data._item.allowEdit;
    this.itemForm = this.fb.group({
      MoTa: [this.item.MeetingContent, Validators.required],
    });

    if (this.IsXem)
      this.itemForm.disable();
    this.changeDetectorRefs.detectChanges();
  }



  /** ACTIONS */
  prepareData(): DuyetCuocHopModel {
    const controls = this.itemForm.controls;
    const _item = this.item;

    _item.id = this.item.meetid;
    _item.MoTa = controls['MoTa'].value;
    return _item;
  }
  getTitle(): string {
    if (this.item.meetid > 0) {
      if (!this.IsXem) {
        return this.translate.instant("OBJECT.UPDATE.TITLE", {
          name: this.translate
            .instant("MENU_KHOAHOP.NAME").toLowerCase()
        }) + " - " + this.item.title;
      } else {
        return this.translate.instant('OBJECT.DETAIL.TITLE', {
          name: this.translate
            .instant('MENU_KHOAHOP.NAME').toLowerCase()
        }) + " - " + this.item.title;
      }
    }
    return this.translate.instant("OBJECT.ADD.TITLE", {
      name: this.translate
        .instant("MENU_KHOAHOP.NAME").toLowerCase()
    });
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
