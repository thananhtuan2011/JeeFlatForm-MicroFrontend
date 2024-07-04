import { find } from 'lodash';

import { environment } from './../../../../../../environments/environment';
import { ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { QuanLyCuocHopService } from '../../../_services/quan-ly-cuoc-hop.service';
import { DiagramComponent, DiagramTooltipModel } from '@syncfusion/ej2-angular-diagrams';
import { FormControl } from '@angular/forms';
import { tinyMCE_MT } from '../../tinyMCE-MT';
import { QLCuocHopModel, QuanLyPhieuLayYKienModel, QuanLySoTayGhiChuCuocHopModel, ThongKeDangCauHoiModel } from '../../../_models/quan-ly-cuoc-hop.model';
import { QuanLyCuocHopEditComponent } from '../../quan-ly-cuoc-hop-edit/quan-ly-cuoc-hop-edit.component';
import { BehaviorSubject, Subject, Subscription, of } from 'rxjs';
import { CuocHopInfoComponent } from '../../components/cuoc-hop-info/cuoc-hop-info.component';
// import { QuanLyBangKhaoSatListComponent } from '../../quan-ly-bang-khao-sat/quan-ly-bang-khao-sat-list/quan-ly-bang-khao-sat-list.component';
import { DanhSachPhatBieuComponent } from '../../components/danh-sach-phat-bieu/danh-sach-phat-bieu.component';
import { QuanLyDiemDanhComponent } from '../../components/quan-ly-diem-danh/quan-ly-diem-danh.component';
import { QuanLySoTayGhiChuCuocHopAddComponent } from '../../components/ql-so-tay-ghi-chu-ch-add/ql-so-tay-ghi-chu-ch-add.component';
import { MeetingFeedbackAddComponent } from '../../components/meeting-feedback-add/meeting-feedback-add.component';
import { MeetingSupportAddComponent } from '../../components/meeting-support-add/meeting-support-add.component';
// import { QuanLySoTayCuocHopListComponent } from '../../quan-ly-so-tay-cuoc-hop/quan-ly-so-tay-cuoc-hop-list/quan-ly-so-tay-cuoc-hop-list.component';
// import { QuanLyYKienGopYListComponent } from '../../ql-ykien-gopy/ql-ykien-gopy-list/ql-ykien-gopy-list.component';
import { SurveyListComponent } from '../../components/survey-list/survey-list.component';
// import { QuanLyPhieuLayYKienListDialogComponent } from '../../quan-ly-phieu-lay-y-kien/quan-ly-phieu-lay-y-kien-list-dialog/quan-ly-phieu-lay-y-kien-list.component';
import { DiagramViewAddComponent } from '../../diagram-view/diagram-view.component';
import { CuocHopNotiFyComponent } from '../../cuoc-hop-notify/cuoc-hop-notify.component';
import { UserViewDocumentListComponent } from '../../user-view-document-list/user-view-document-list.component';
import { DienBienCuocHopComponent } from '../../components/dien-bien-cuoc-hop/dien-bien-cuoc-hop.component';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { catchError, finalize, share, takeUntil, tap } from 'rxjs/operators';
import { JeeChooseMemberComponent } from '../../jee-choose-member/jee-choose-member.component';
import { QuanLyBangKhaoSatListComponent } from '../../../quan-ly-bang-khao-sat/quan-ly-bang-khao-sat-list/quan-ly-bang-khao-sat-list.component';
import { QuanLyPhieuLayYKienListDialogComponent } from '../../../quan-ly-phieu-lay-y-kien/quan-ly-phieu-lay-y-kien-list-dialog/quan-ly-phieu-lay-y-kien-list.component';
import { HttpParams } from '@angular/common/http';
import { MeetingStore } from '../../../_services/meeting.store';
import { MeetingFeedbackListComponent } from '../../components/meeting-feedback-list/meeting-feedback-list.component';
import { ExportWordComponent } from '../../components/export-word/export-word.component';
import Recorder from 'recorder-js';
import { QuanLyDocumentAddComponent } from '../../ql-add-document/ql-add-document.component';
import { KhongDuyetFileDialogComponent } from '../../khong-duyet-file-dialog/khong-duyet-file-dialog.component';
import { InMaQRComponent } from '../../components/in-ma-qr/in-ma-qr.component';
import { JeeCommentStore } from '../../../../JeeCommentModule/jee-comment/jee-comment.store';
import { quillConfig } from '../../components/editor/Quill_config';
import { DangKyCuocHopService } from '../../../_services/dang-ky-cuoc-hop.service';
import { QueryParamsModel } from '../../../../models/query-models/query-params.model';
import { QuanLySoTayCuocHopListV2Component } from '../../../quan-ly-so-tay-cuoc-hop/quan-ly-so-tay-cuoc-hop-list-v2/quan-ly-so-tay-cuoc-hop-list-v2.component';
import { ChooseMemberV2Component } from '../../jee-choose-member/choose-menber-v2/choose-member-v2.component';
import moment from 'moment';
import { ThemMoiCongViecVer2Component } from 'projects/jeework/src/app/page/jee-work/MenuWork/them-moi-cong-viec-ver2/them-moi-cong-viec-ver2.component';
import { QuanLyDocumentAddStopMeetingComponent } from '../ql-add-document-stop-meet/ql-add-document.component';
import { QuanLyCuocHopEditV2Component } from '../quan-ly-cuoc-hop-edit/quan-ly-cuoc-hop-edit.component';

@Component({
  selector: 'app-meet-detail',
  templateUrl: './meet-detail.component.html',
  styleUrls: ['./meet-detail.component.scss']
})
export class MeetDetailComponent implements OnInit {

  ChiXem: boolean = false;
  //tab don vi tham gia
  @ViewChild('searchboxdonvi', { static: true }) searchboxdonvi: ElementRef;
  listNguoiThamGiaDuocUyQuyen: any[] = [];
  listGroupDept: any = []
  listGroupDeptOrigin: any = []
  user_tam: any[] = [];
  searchData: string = ''
  //countdown send notify
  showIconCountdown: boolean = false;
  countdown: number = 15;

  //them thanh vien
  listNguoiThamGia: any[] = [];
  listNguoiThamGiaRemove: any[] = [];
  dataCuocHop: any;
  ID_Meeting: number;
  sb: Subscription;

  dataHitoryMeet: any = []
  dataHitoryTaiLieu: any = []

  callReload: boolean = false;

  //option show
  ShowEditorTomTat: boolean = false
  ShowEditorKetLuan: boolean = false

  //field 
  NoiDungTomTat: string
  NoiDungKetLuan: string
  NoiDungDienBien: string
  //-phatbieu
  isPhatBieu: boolean = false

  //editor
  public quillConfig: {};
  editorStyles = {
    'min-height': '200px',
    'max-height': '200px',
    height: '100%',
    'font-size': '12pt',
    'overflow-y': 'auto',
  };
  files: any[] = [{ data: {} }];
  //ListFileDinhKem: any[] = [];
  ListFileDK: any[] = [];
  file: string = "";
  file1: string = "";
  file2: string = "";
  IsXem: any
  sizemaxfile: any = environment.DungLuong / 1048576;
  ExtensionImg = ["png", "gif", "jpeg", "jpg"];
  strExtensionImg = "png, .gif, .jpeg, .jpg";
  ExtensionVideo = [
    "mp4",
    "mov",
    "avi",
    "gif",
    "mpeg",
    "flv",
    "wmv",
    "divx",
    "mkv",
    "rmvb",
    "dvd",
    "3gp",
    "webm",
  ];
  strExtensionVideo =
    "mp4, .mov, .avi, .gif, .mpeg, .flv, .wmv, .divx, .mkv, .rmvb, .dvd, .3gp, .webm";
  ExtensionFile = [
    "xls",
    "xlsx",
    "doc",
    "docx",
    "pdf",
    "mp3",
    "zip",
    "7zip",
    "rar",
    "txt",
  ];
  strExtensionFile =
    "xls, .xlsx, .doc, .docx, .pdf, .mp3, .zip, .7zip, .rar, .txt";
  IsDel: boolean = false;

  constructor(public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    public cuocHopService: DangKyCuocHopService,
    public dangKyCuocHopService: QuanLyCuocHopService,
    private storeMT: MeetingStore,
    private _ngZone: NgZone) {
  }

  /** LOAD DATA */
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.ID_Meeting = +params.id;
      const url = window.location.href;
      let paramValue = undefined;
      if (url.includes('?')) {
        const httpParams = new HttpParams({ fromString: url.split('?')[1] });
        if (httpParams.get('Type') == '3') {
          this.ChiXem = true
        } else {
          this.ChiXem = false
        }
        this.dangKyCuocHopService.connectToken(this.ID_Meeting + "");
        this.dangKyCuocHopService.Get_ChiTietCuocHop(this.ID_Meeting, httpParams.get('Type')).subscribe((res: any) => {
          if (res.status == 1) {
            this.dataCuocHop = res.data[0];
            this.listGroupDept = this.GroupDept(res.data[0].ThanhPhan)
            this.listGroupDeptOrigin = this.GroupDept(res.data[0].ThanhPhan)
            this.changeDetectorRefs.detectChanges()
          } else {
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Error,
              4000,
              true,
              false,
              3000,
              "top"
            );

            this.router.navigate(['/Meet']);
          }
        })

        this.loadHistoryTaiLieu()
        this.loadHistoryMeet()
      }

    })

    this.quillConfig = quillConfig;

  }

  loadData() {
    this.dangKyCuocHopService.Get_ChiTietCuocHop(this.ID_Meeting).subscribe((res: any) => {
      if (res.status == 1) {
        this.dataCuocHop = res.data[0];
        this.listGroupDept = this.GroupDept(res.data[0].ThanhPhan)
        this.listGroupDeptOrigin = this.GroupDept(res.data[0].ThanhPhan)
        this.changeDetectorRefs.detectChanges()
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Error,
          4000,
          true,
          false,
          3000,
          "top"
        );

        this.router.navigate(['/Meet']);
      }
    })
    this.loadHistoryTaiLieu()
    this.loadHistoryMeet()
  }

  isActiveLayout: boolean = false;
  toggleRight() {
    this.isActiveLayout = !this.isActiveLayout;
  }

  //style, size ...

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 70;
    return tmp_height + 'px';
  }

  getHeightRight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 120;
    return tmp_height + 'px';
  }

  getHeightRight2(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 220;
    return tmp_height + 'px';
  }

  //tich hop jeework
  themMoiNhiemVu() {
    this.openModalChild(
      'Title1',
      'Message Test',
      () => {
      },
      () => {
      },
    );
  }

  openModalChild(
    title: string,
    message: string,
    yes: Function = null,
    no: Function = null,
  ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      title: title,
      message: message,
      idMeeting: this.ID_Meeting
    };
    dialogConfig.width = '40vw';
    dialogConfig.panelClass = 'meet-custom-dialog-class';
    let item;
    item = ThemMoiCongViecVer2Component;
    const dialogRef = this.dialog.open(item, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.ngOnInit();
      }
    });
  }

  //cai dat
  chinhsua() {
    const QLCuocHop = new QLCuocHopModel();
    QLCuocHop.Id = this.ID_Meeting;

    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    saveMessageTranslateParam += QLCuocHop.Id > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = QLCuocHop.Id > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(QuanLyCuocHopEditV2Component, { data: { QLCuocHop }, width: '60%' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.cuocHopService.data_shareLoad$.next(res)
      this.loadData();
    });
  }

  XoaCuocHop() {
    const _title = this.translate.instant("ComMon.BTN_CONFIRM");
    const _description =
      this.translate.instant("QL_CUOCHOP.NOTI_THUCHIEN_CHUCNANG");
    const _waitDesciption = this.translate.instant("QL_CUOCHOP.DANGTHUCHIEN");
    const dialogRef2 = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDesciption,
    );
    dialogRef2.afterClosed().subscribe((res) => {
      if (res) {
        this.dangKyCuocHopService.XoaCuocHop(this.ID_Meeting, this.dataCuocHop.IsDuyet).subscribe((res: any) => {
          if (res && res.status === 1) {
            this.layoutUtilsService.showActionNotification(
              this.translate.instant("QL_CUOCHOP.CUOCHOP.DELETE_THANHCONG"),
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
            this.router.navigate(['/Meet']);
            this.cuocHopService.data_shareLoad$.next(res)
            this.changeDetectorRefs.detectChanges()
          } else {
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Read,
              9999999999,
              true,
              false,
            );
            this.changeDetectorRefs.detectChanges()
          }
        });
      }
    });
  }

  XacNhanCuocHop() {
    const _title: string = 'Xác nhận hoàn tất chuẩn bị cuộc họp ';
    const _description: string = 'Bạn có chắc muốn xác nhận này?';
    const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, '', false);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dangKyCuocHopService
        .XacNhanCuocHop(this.ID_Meeting)
        .subscribe((res: any) => {
          if (res && res.status === 1) {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              "Xác nhận thành công",
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
            this.loadData()
            this.cuocHopService.data_shareLoad$.next("Load");
            this.changeDetectorRefs.detectChanges()
          } else {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
          }
        });
    });
  }

  DongCuochop() {
    const _title: string = 'Xác nhận đóng cuộc họp ';
    const _description: string = 'Bạn có chắc muốn đóng cuộc họp này?';
    const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, '', false);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dangKyCuocHopService.DongCuocHop(this.ID_Meeting).subscribe((res: any) => {
        if (res && res.status === 1) {
          this.layoutUtilsService.showActionNotification(
            this.translate.instant("QL_CUOCHOP.CUOCHOP.CLOSE_THANHCONG"),
            MessageType.Read,
            4000,
            true,
            false,
            3000,
            "top"
          );

          this.cuocHopService.data_shareLoad$.next(res)
          this.loadData()
          this.changeDetectorRefs.detectChanges()
        } else {
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Read,
            9999999999,
            true,
            false,
          );
          this.changeDetectorRefs.detectChanges()
        }
      });
    });
  }

  HoanCuochop(item: any) {
    const _title: string = `Xác nhận hoãn cuộc họp `;
    const _description: string = 'Bạn có chắc muốn hoãn cuộc họp này?';
    const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, '', false);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      // this.dangKyCuocHopService.HoanCuocHop(this.ID_Meeting).subscribe((res: any) => {
      //   if (res && res.status === 1) {
      //     this.layoutUtilsService.showActionNotification(
      //       `${item.Status == 3 ? 'Mở hoãn' : 'Hoãn'} cuộc họp thành công`,
      //       MessageType.Read,
      //       4000,
      //       true,
      //       false,
      //       3000,
      //       "top"
      //     );

      //     this.cuocHopService.data_shareLoad$.next(res)
      //     this.loadData()
      //     this.changeDetectorRefs.detectChanges()
      //   } else {
      //     this.layoutUtilsService.showActionNotification(
      //       res.error.message,
      //       MessageType.Read,
      //       9999999999,
      //       true,
      //       false,
      //     );
      //     this.changeDetectorRefs.detectChanges()
      //   }
      // });
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        title: 'Title1',
        message: 'Message Test',
        idMeeting: this.ID_Meeting
      };
      dialogConfig.disableClose = true;
      dialogConfig.width = '40vw';
      dialogConfig.panelClass = 'sky-padding-0';
      let dialogRef;
      dialogRef = this.dialog.open(QuanLyDocumentAddStopMeetingComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        if (result.status = 1) {
          this.layoutUtilsService.showActionNotification('Hoãn cuộc họp thành công', MessageType.Create, 2000, true, false);
        }
        else {
          this.layoutUtilsService.showActionNotification('Hoãn cuộc họp thất bại', MessageType.Error, 2000, true, false);
        }
        this.loadData();
        this.changeDetectorRefs.detectChanges()
      });
    });
  }

  QuayVe() {
    this.router.navigate(['/Meet']);
  }

  OpenPrintQR(item) {
    const dialogRef = this.dialog.open(InMaQRComponent, { data: { _item: this.ID_Meeting, QRCODE: item }, width: '40%' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.loadData();
    });
  }

  OpenPrintQRPH(item) {
    this.dangKyCuocHopService.GenQR(item.IdPhongHop).subscribe(res => {
      if (res && res.status === 1) {
        if (res.data) {
          this.OpenPrintQR(res.data)
        }
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 10000, true, false, 3000, 'top', 0);
      }
      this.loadData();
    });
  }

  addSoTayGhiChu() {
    const newSoTayGhiChu = new QuanLySoTayGhiChuCuocHopModel();
    newSoTayGhiChu.clear(); // Set all defaults fields
    this.editQuanLySoTayGhiChuCuocHop(newSoTayGhiChu);
  }

  editQuanLySoTayGhiChuCuocHop(QuanLySoTayGhiChuCuocHop: any) {

    let saveMessageTranslateParam = "ECOMMERCE.CUSTOMERS.EDIT.";

    const QLCuocHop = new QLCuocHopModel();
    QLCuocHop.Id = this.ID_Meeting;
    QuanLySoTayGhiChuCuocHop.IdCuocHop = QLCuocHop.Id
    saveMessageTranslateParam += QuanLySoTayGhiChuCuocHop.Id > 0 ? "UPDATE_MESSAGE" : "ADD_MESSAGE";
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = QuanLySoTayGhiChuCuocHop.Id > 0 ? MessageType.Update : MessageType.Create;
    if (QuanLySoTayGhiChuCuocHop.Id > 0) {
      QuanLySoTayGhiChuCuocHop.allowEdit = true;
    }
    const dialogRef = this.dialog.open(QuanLySoTayGhiChuCuocHopAddComponent, {
      data: { QuanLySoTayGhiChuCuocHop },
      width: "500px",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      this.loadData();
    });
  }

  DanhSachSoTayGhiChu() {

    const SoTayGhiChu = new QuanLySoTayGhiChuCuocHopModel();
    this.DanhSachGhiChu(SoTayGhiChu);
  }
  DanhSachGhiChu(QuanLySoTayGhiChuCuocHop: any) {
    const QLCuocHop = new QLCuocHopModel();
    QLCuocHop.Id = this.ID_Meeting;
    QuanLySoTayGhiChuCuocHop.IdCuocHop = QLCuocHop.Id
    const dialogRef = this.dialog.open(QuanLySoTayCuocHopListV2Component, { data: { QuanLySoTayGhiChuCuocHop }, width: '125vh' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.loadData();
    });
  }

  onOffFeedback(isFeedback: boolean) {
    const _messageYes: string = this.translate.instant('ComMon.THANHCONG');
    const _messageNo: string = this.translate.instant('ComMon.THATBAI');
    this.dangKyCuocHopService.onOffFeedback(this.ID_Meeting, isFeedback).subscribe(res => {
      // if (res.status = 1) {
      //   this.layoutUtilsService.showActionNotification(_messageYes, MessageType.Create, 2000, true, false);
      // }
      // else {
      //   this.layoutUtilsService.showActionNotification(_messageNo, MessageType.Error, 2000, true, false);
      // }
      this.loadData();
    });
  }

  addFeedback() {
    const _data: any = {};
    _data.IdRow = 0;
    _data.IdM = this.ID_Meeting;
    const dialogRef = this.dialog.open(MeetingFeedbackAddComponent, {
      data: { _data },
      width: "800px",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }

  sendNotify() {
    const _data: any = {};
    _data.IdRow = 0;
    _data.IdM = this.ID_Meeting;
    const dialogRef = this.dialog.open(CuocHopNotiFyComponent, { data: { _data }, width: '700px' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });

  }

  //tai lieu

  AddDocument() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Title1',
      message: 'Message Test',
      idMeeting: this.ID_Meeting
    };
    dialogConfig.disableClose = true;
    dialogConfig.width = '40vw';
    dialogConfig.panelClass = 'sky-padding-0';
    let dialogRef;
    dialogRef = this.dialog.open(QuanLyDocumentAddComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.loadData();
      this.changeDetectorRefs.detectChanges()
    });
  }

  duyetfile(item, status) {
    if (status == 1) {
      const _title: string = 'Cập nhật tài liệu file ';
      const _description: string = 'Bạn có chắc muốn duyệt tài liệu này?';
      const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

      const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
        this.dangKyCuocHopService
          .DuyetTaiLieu(item.IdDocument, 1, "")
          .subscribe((res: any) => {
            if (res && res.status === 1) {
              this.changeDetectorRefs.detectChanges();
              this.layoutUtilsService.showActionNotification(
                "Duyệt thành công",
                MessageType.Read,
                4000,
                true,
                false,
                3000,
                "top"
              );
              this.loadData()
              this.changeDetectorRefs.detectChanges()
            } else {
              this.changeDetectorRefs.detectChanges();
              this.layoutUtilsService.showActionNotification(
                "Duyệt thất bại",
                MessageType.Read,
                4000,
                true,
                false,
                3000,
                "top"
              );
            }
          });
      });
    }
    else {
      const dialogRef = this.dialog.open(KhongDuyetFileDialogComponent, {
        data: { item },
        width: "500px",
      });
      dialogRef.afterClosed().subscribe((res) => {
        this.loadData();
      });
    }
  }

  //xoa file dinh kem
  deletefile(item) {
    const _title: string = 'Xoá file ';
    const _description: string = 'Bạn có chắc muốn xóa file này?';
    const _waitDesciption: string = 'Dữ liệu đang được xóa...';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dangKyCuocHopService
        .DeleteFile(item.IdDocument, item.Path)
        .subscribe((res: any) => {
          if (res && res.status === 1) {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              "Xóa thành công",
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
            this.loadData()
            this.changeDetectorRefs.detectChanges()
          } else {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
          }
        });
    });
  }

  downFile(path: any) {
    this.TaiXuong(path);
    this.dangKyCuocHopService.DownloadFile(path.IdDocument).subscribe(res => {
      if (res && res.status == 1) {
      }
    });
  }

  TaiXuong(item) {
    this.dangKyCuocHopService.DocThuMoi(item.IdDocument).subscribe(res => {
      if (res && res.status == 1) {
      }
    })
    let obj = item.TenFile.split(".")[item.TenFile.split(".").length - 1];
    if (obj == "jpg" || obj == "png" || obj == "jpeg" || obj == "pdf" || obj == "xls" || obj == "xlsx" || obj == "doc" || obj == "docx" || obj == "txt" || obj == "mp3" || obj == "mp4") {
      const splitUrl = item.Link.split("/");
      const filename = item.TenFile;
      fetch(item.Link)
        .then((response) => {
          response.arrayBuffer().then(function (buffer) {
            const url = window.URL.createObjectURL(new Blob([buffer]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename); //or any other extension
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          });
        })
        .catch((err) => {

        });
    } else {
      window.open(item.Link);
    }
  }

  getlistViewerDocument(item: any, type = 0) {
    const _data: any = {};
    _data.Id = 0;
    _data.IdM = this.ID_Meeting;
    _data.IdDocument = item.IdDocument;
    const dialogRef = this.dialog.open(UserViewDocumentListComponent, { data: { _data, type }, width: '500px' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });
  }


  // cap nhat tom tat ket luan + noi dung
  chinhSuaNoiDungKetLuan(item: any) {
    this.ShowEditorKetLuan = true
    this.NoiDungKetLuan = item;

    this.changeDetectorRefs.detectChanges()
  }

  chinhSuaNoiDungTomTat(item: any) {
    this.ShowEditorTomTat = true
    this.NoiDungTomTat = item
    this.changeDetectorRefs.detectChanges()
  }

  //editor
  CapNhatTomTat() {
    if (this.NoiDungTomTat == undefined || this.NoiDungTomTat == "") {
      this.NoiDungTomTat == ""
    }
    let _item = {
      NoiDung: this.NoiDungTomTat,
      meetingid: this.ID_Meeting,
      type: 1
    }
    this.dangKyCuocHopService.CapNhatTomTatKetLuan(_item).subscribe((res: any) => {
      if (res && res.status === 1) {
        ""
        this.layoutUtilsService.showActionNotification(
          this.translate.instant("QL_CUOCHOP.CUOCHOP.UPDATE_THANHCONG"),
          MessageType.Read,
          4000,
          true,
          false,
          3000,
          "top"
        );
        this.ShowEditorTomTat = false
        this.loadData()
        this.changeDetectorRefs.detectChanges()
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
        );
        this.changeDetectorRefs.detectChanges()
      }
    });
  }


  // }
  CapNhatNoiDungKetLuan() {
    if (this.NoiDungKetLuan == undefined || this.NoiDungKetLuan == "") {
      this.NoiDungKetLuan == ""
    }

    let _item = {
      NoiDung: this.NoiDungKetLuan,
      meetingid: this.ID_Meeting,
      type: 2,
      ListFile: this.ListFileDK,

    }
    _item.ListFile = [];
    if (this.ListFileDK) {
      _item.ListFile = this.ListFileDK.filter(
        (x) => x.IsDel
      );
      for (var i = 0; i < this.files.length; i++) {
        if (this.files[i].data && this.files[i].data.strBase64) {
          _item.ListFile.push(
            Object.assign({}, this.files[i].data)
          );
          //_item.ListFile  = _item.ListFile;
        }
      }
    }


    this.dangKyCuocHopService.CapNhatTomTatKetLuan(_item).subscribe((res: any) => {
      if (res && res.status === 1) {
        this.layoutUtilsService.showActionNotification(
          this.translate.instant("QL_CUOCHOP.CUOCHOP.UPDATE_THANHCONG"),
          MessageType.Read,
          4000,
          true,
          false,
          3000,
          "top"
        );
        this.loadData()
        this.ShowEditorKetLuan = false
        this.changeDetectorRefs.detectChanges()
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
        );
        this.changeDetectorRefs.detectChanges()
      }
    });
  }

  OpenDienBienCuocHop() {
    const objData = new QLCuocHopModel();
    objData.Id = this.ID_Meeting;
    const dialogRef = this.dialog.open(DienBienCuocHopComponent, { data: { _item: this.ID_Meeting, noiDung: this.NoiDungDienBien }, width: '50%' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.loadData();
      }
      this.loadData();
    });

  }

  removeFile(index) {
    this.ListFileDK[index].IsDel = true;
    this.IsDel = this.ListFileDK[index].IsDel;

    this.changeDetectorRefs.detectChanges();
  }

  selectFile(i) {
    let f = document.getElementById("FileUpLoad" + i);
    f.click()
  }

  new_row() {
    this.files.push({ data: {} });

  }
  remove(index) {
    this.files.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
  }

  FileChoose(evt: any, index) {
    evt.stopPropagation();
    if (evt.target.files && evt.target.files.length) {
      let file = evt.target.files[0];
      var condition_type = file.type.split("/")[0];
      var condition_name = file.name.split(".").pop();
      if (condition_type == "image") {
        if (file.size > environment.DungLuong) {
          var a = environment.DungLuong / 1048576;
          const message =
            this.translate.instant(
              "MODULE_FEEDBACK.FileError",
              { file: this.file }
            ) + ` ${a} MB.`;
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Warning,
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
              "MODULE_FEEDBACK.ChooseFileExtension",
              { file: this.file }
            ) + ` (.${this.strExtensionImg})`;
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Warning,
            10000,
            true,
            false
          );
          return;
        }
      } else if (condition_type == "video") {
        if (file.size > environment.DungLuong) {
          var a = environment.DungLuong / 1048576;
          const message =
            this.translate.instant(
              "MODULE_FEEDBACK.FileError",
              { file: this.file1 }
            ) + ` ${a} MB.`;
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Warning,
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
              "MODULE_FEEDBACK.ChooseFileExtension",
              { file: this.file1 }
            ) + ` (.${this.strExtensionVideo})`;
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Warning,
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
            this.translate.instant(
              "MODULE_FEEDBACK.FileError",
              { file: this.file2 }
            ) + ` ${a} MB.`;
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Warning,
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
              "MODULE_FEEDBACK.ChooseFileExtension",
              { file: this.file2 }
            ) + ` (.${this.strExtensionFile})`;
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Warning,
            10000,
            true,
            false
          );
          return;
        }
      }
      var filename = `${evt.target.files[0].name}`;
      let extension = "";
      for (var i = 0; i < this.files.length; i++) {
        if (
          this.files[i].data &&
          this.files[i].data.filename == filename
        ) {
          const message =
            `"${filename}" ` +
            this.translate.instant("MODULE_FEEDBACK.Added");
          this.layoutUtilsService.showActionNotification(
            message,
            MessageType.Update,
            10000,
            true,
            false
          );
          evt.target.value = "";
          return;
        }
      }
      let reader = new FileReader();
      reader.readAsDataURL(evt.target.files[0]);
      let base64Str;
      reader.onload = function () {
        base64Str = reader.result as String;
        let lengName = evt.target.files[0].name.split(".").length;
        extension = `.${evt.target.files[0].name.split(".")[lengName - 1]
          }`;
        var metaIdx = base64Str.indexOf(";base64,");
        base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
      };
      setTimeout((res) => {
        var _file: any = {};
        _file.strBase64 = base64Str;
        _file.filename = filename;
        _file.extension = extension;
        _file.type = evt.target.files[0].type.includes("image") ? 1 : 2;
        _file.isnew = true;
        this.files[index].data = _file;
        this.changeDetectorRefs.detectChanges();
      }, 1000);
    }
  }

  //phat bieu
  checkPhatBieu(e) {
    this.isPhatBieu = e;
  }

  checkCallReload(e) {
    this.callReload = !this.callReload
  }

  XinPhatBieu(isPhatBieu: boolean) {
    var item = {
      meetingid: this.ID_Meeting,
      PhatBieu: !isPhatBieu,
      Status: isPhatBieu ? 0 : 1
    }
    this.dangKyCuocHopService.XinPhatBieuCuocHop(item).subscribe((res: any) => {
      if (res && res.status === 1) {
        this.layoutUtilsService.showActionNotification(
          !isPhatBieu ? 'Đã đăng ký phát biểu' : 'Đã hủy phát biểu',
          MessageType.Read,
          4000,
          true,
          false,
        );
        this.loadData()
        this.changeDetectorRefs.detectChanges()
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
        );
        this.changeDetectorRefs.detectChanges()
      }
    });
  }

  loadHistoryTaiLieu() {
    this.dangKyCuocHopService.gethistory_docs(this.ID_Meeting).subscribe(res => {
      if (!res.data) {
        return;
      }
      this.dataHitoryTaiLieu = res.data;
      this.changeDetectorRefs.detectChanges();
    });
  }

  loadHistoryMeet() {
    this.dangKyCuocHopService.gethistory_meet(this.ID_Meeting).subscribe(res => {
      if (!res.data) {
        return;
      }
      this.dataHitoryMeet = res.data;
      this.changeDetectorRefs.detectChanges();
    });
  }

  getColorAction(condition: string): string {
    switch (condition) {
      case 'delete':
        return "#2209b7";
      case 'unapproved':
        return "red";
      case 'uploaded':
        return "#03B3FF";
      case 'approved':
        return "rgb(7, 126, 67)";
    }
  }

  //them thanh vien
  AddThanhVien(item: any, Type: number = 1) {
    let _item = item;
    let _type = 2;
    const inputNodeId = item.map((obj) => {
      if (obj.DeptId != 0) {
        return obj.DeptId;
      }
      return obj.idUser + '##';
    }).join(',');
    let meetingType_member = 3
    let meeet_type_nember = 1
    if (Type == 1) {
      meeet_type_nember = 1
    }
    if (Type == 2) {
      meeet_type_nember = 2
    }
    if (Type == 3) {
      meeet_type_nember = 5
    }
    if (Type == 4) {
      meeet_type_nember = 3
    }
    if (Type == 6) {
      meeet_type_nember = 4
    }
    if (Type == 7) {
      meeet_type_nember = 7
    }
    const dialogRef = this.dialog.open(ChooseMemberV2Component, { data: { _item, inputNodeId, meetingType_member, _type, private_meeet: true, meeet_type_nember: meeet_type_nember }, width: '60%' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.listNguoiThamGia = res.data
      if (res.data2) {
        let data_user = []
        res.data2.forEach(element => {
          if (element.UserIdList && element.UserIdList.length > 0) {
            element.UserIdList.forEach(el => {
              let fields = {
                idUser: el.UserId,
                username: el.Username,
                DeptId: element.RowID,
                GroupId: 0,
              }
              data_user.push(fields)
            });
          }
        });
        this.listNguoiThamGia.push(...data_user);
      }

      let _field = {
        RowID: this.ID_Meeting,
        ListUser: this.listNguoiThamGia,
        Type: Type
      };
      this.dangKyCuocHopService
        .Insert_ThanhVien(_field)
        .subscribe((res: any) => {
          if (res && res.status === 1) {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              "Thêm thành công",
              MessageType.Read,
              4000,
              true,
              false
            );
            this.loadData()
            this.changeDetectorRefs.detectChanges()
          } else {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Warning,
              4000,
              true,
              false,
              3000,
              "top"
            );
          }
        });
    });
  }

  //xoa thanh vien
  RemoveThanhVien(item: any, Type: number = 1) {
    const _title: string = 'Xoá thành viên ';
    const _description: string = 'Bạn có chắc muốn xóa thành viên này ra khỏi cuộc họp không?';
    const _waitDesciption: string = 'Dữ liệu đang được xóa...';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      let _item = item;
      this.listNguoiThamGiaRemove.push(_item);
      let _field = {
        RowID: this.ID_Meeting,
        ListUser: this.listNguoiThamGiaRemove,
        Type: Type
      };
      this.dangKyCuocHopService
        .Delete_ThanhVien(_field)
        .subscribe((res: any) => {
          if (res && res.status === 1) {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              "Xóa thành công",
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
            this.listNguoiThamGiaRemove = []
            this.loadData()
            this.changeDetectorRefs.detectChanges()
          } else {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Error,
              4000,
              true,
              false,
              3000,
              "top"
            );
            this.listNguoiThamGiaRemove = []
          }
        });
    });

  }

  //chuyen chu tri
  ChuyenChuTri(item: any, Type: number = 1) {
    const _title: string = 'Chuyển giao chủ trì ';
    const _description: string = 'Bạn có chắc muốn chuyển giao quyền chủ trì cuộc họp này không?';
    const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dangKyCuocHopService
        .swapHost(this.ID_Meeting, item.idUser)
        .subscribe((res: any) => {
          if (res && res.status === 1) {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              "Chuyển thành công",
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
            this.listNguoiThamGiaRemove = []
            this.loadData()
            this.changeDetectorRefs.detectChanges()
          } else {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
            this.listNguoiThamGiaRemove = []
          }
        });
    });
  }

  UyQuyenThemTaiLieu(item: any) {
    let _item = this.dataCuocHop.ThanhPhanThemTaiLieu;
    const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item, removeable: false, type: 2, private: true, themtailieu: true }, width: '40%' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        var data: any = {};
        data.IdUser = res.data[0].idUser;
        data.IdMeeting = this.ID_Meeting;
        this.dangKyCuocHopService.UpdateNguoiThemTaiLieu(
          data
        ).subscribe((res) => {
          if (res.status == 1) {
            this.layoutUtilsService.showActionNotification(
              "Ủy quyền thành công",
              MessageType.Delete,
              2000,
              true,
              false
            );
            this.loadData();
          } else
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Delete,
              2000,
              true,
              false
            );
        });
      }
      this.changeDetectorRefs.detectChanges()
    });
  }

  sendNotifyremind(item, index) {
    let _item = item;
    let listUsser = []
    listUsser.push(_item);
    let _field = {
      RowID: this.ID_Meeting,
      ListUser: listUsser
    };
    this.dangKyCuocHopService.SendNotifyRemind(_field).subscribe(res => {
      this.changeDetectorRefs.detectChanges();
      if (res && res.status === 1) {
        this.layoutUtilsService.showInfo('Gửi thông báo nhắc nhở thành công');
        this.dataCuocHop.ThanhPhanThemTaiLieu[index].ShowIconCountDown = true;
        this.startCountdown(index);
      }
      else {
        this.layoutUtilsService.showError(res.error.message);;
      }
    });
  }

  startCountdown(index: number) {
    const countdownInterval = setInterval(() => {
      this.dataCuocHop.ThanhPhanThemTaiLieu[index].CountDown -= 1;
      if (this.dataCuocHop.ThanhPhanThemTaiLieu[index].CountDown <= 0) {
        clearInterval(countdownInterval);
        this.dataCuocHop.ThanhPhanThemTaiLieu[index].ShowIconCountDown = false;
        this.dataCuocHop.ThanhPhanThemTaiLieu[index].CountDown = 60; // Reset đếm ngược
      }
      this.changeDetectorRefs.detectChanges()
    }, 1000);
  }

  //tab don vi thanh vien

  chieucao2(item) {
    if (item.length == 0) {
      return ''
    }
    if (item.length == 1) {
      return 'viewport-h50'
    }
    if (item.length == 2) {
      return 'viewport-h100'
    }
    if (item.length == 3) {
      return 'viewport-h150'
    }
    if (item.length == 4) {
      return 'viewport-h200'
    }
    if (item.length > 4) {
      return 'viewport-h200'
    }
  }

  getTinhTrangClass(condition: number = 0, item: any): boolean {
    if (item.SapHoacDangDienRa == 0) return false;
    if (!item.XacNhanThamGia) return true;
    switch (condition) {
      case 1:
        return true;
    }
    return false;
  }

  XacNhanViecUyQuyen(item, status: number) {
    const _title: string = 'Xác nhận cho thành viên này ủy quyền ';
    const _description: string = status == 1 ? 'Bạn có chắc xác nhận cho thành viên này ủy quyền?' : 'Bạn có chắc muốn không xác nhận cho thành viên này ủy quyền?';
    const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      var data =
      {
        Id: this.ID_Meeting,
        IdThanhPhanCuocHop: item.idUser,
        UyQuyenUsers: item.UyQuyenUser,
        XacNhanThamGiaCuocHopThongQuaUyQuyen: status
      };
      this.dangKyCuocHopService.XacNhanNhieuThanhVienThamGiaThongQuaUyQuyenTuThuKyCuocHop(data).subscribe((res: any) => {
        if (res && res.status === 1) {
          this.layoutUtilsService.showActionNotification(
            "Cập nhật thành công",
            MessageType.Read,
            4000,
            true,
            false,
            3000,
            "top"
          );
          this.loadData()
          this.changeDetectorRefs.detectChanges()
        }
        else {
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Error,
            4000,
            true,
            false,
            3000,
            "top"
          );
          this.loadData()
          this.changeDetectorRefs.detectChanges()
        }
      });
    });
  }

  RemoveUyQuyen(item: any, obj: any) {
    const _title: string = 'Xoá ủy quyền ';
    const _description: string = 'Bạn có chắc muốn xóa ủy quyền thành viên này?';
    const _waitDesciption: string = 'Dữ liệu đang được xóa...';
    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.user_tam = []
      var dt = {
        idUser: item.idUser
      }
      this.user_tam.push(dt);
      let _field = {
        RowID: this.ID_Meeting,
        ListUser: this.user_tam,
        Type: 5,
        UserUyQuyen: obj.UyQuyenUser,
        TypeState: obj.Type,
        UserState: obj.idUser,
      };
      this.dangKyCuocHopService
        .Delete_NhieuThanhVien(_field)
        .subscribe((res: any) => {
          if (res && res.status === 1) {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              "Xóa thành công",
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
            this.listNguoiThamGiaRemove = []
            this.loadData()
            this.changeDetectorRefs.detectChanges()
          } else {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
            this.listNguoiThamGiaRemove = []
          }
        });
    });
  }

  AddThanhVienHoTro(item, thanhphanthamgia) {
    let _item = thanhphanthamgia;
    const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item, removeable: false, type: 2, private: true, hotro: true }, width: '60%' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.listNguoiThamGiaDuocUyQuyen = res.data;
      this.user_tam = []
      for (var i = 0; i < this.listNguoiThamGiaDuocUyQuyen.length; i++) {
        var index = thanhphanthamgia.findIndex(x => x.idUser == this.listNguoiThamGiaDuocUyQuyen[i].idUser)
        if (index < 0) {
          var dt =
          {
            idUser: this.listNguoiThamGiaDuocUyQuyen[i].idUser
          }
          this.user_tam.push(dt);
        }
      }
      let _item = this.user_tam;
      this.listNguoiThamGia = _item
      let _field = {
        RowID: this.ID_Meeting,
        ListUser: this.listNguoiThamGia,
        Type: 1,
        Status: 0,
        UserUyQuyen: item.idUser
      };
      this.dangKyCuocHopService
        .Insert_ThanhVien(_field)
        .subscribe((res: any) => {
          debugger
          if (res && res.status === 1) {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              "Thêm người hỗ trợ thành công",
              MessageType.Read,
              4000,
              true,
              false
            );
            this.loadData()
          } else {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Error,
              4000,
              true,
              false,
              3000,
              "top"
            );
          }
        });
      this.changeDetectorRefs.detectChanges();
    });
  }

  getHeightAvatar(ob: any) {
    if (ob.DuyetUyQuyen === 0 && ob.ThongTinUyQuyen > 0) {
      return '60px'
    }
    return ''
  }

  UyQuyenThamGia(item, thanhphanthamgia) {
    let _item = thanhphanthamgia;
    const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item, removeable: false, type: 2, private: true }, width: '60%' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.listNguoiThamGiaDuocUyQuyen = res.data;
      this.user_tam = []
      for (var i = 0; i < this.listNguoiThamGiaDuocUyQuyen.length; i++) {
        var index = thanhphanthamgia.findIndex(x => x.idUser == this.listNguoiThamGiaDuocUyQuyen[i].idUser)
        if (index < 0) {
          var dt =
          {
            idUser: this.listNguoiThamGiaDuocUyQuyen[i].idUser
          }
          this.user_tam.push(dt);
        }
      }
      let _item = this.user_tam;
      this.listNguoiThamGia = _item
      let _field = {
        RowID: this.ID_Meeting,
        ListUser: this.listNguoiThamGia,
        Type: 5,
        Status: 0,
        UserUyQuyen: item.idUser
      };
      this.dangKyCuocHopService
        .Insert_ThanhVien(_field)
        .subscribe((res: any) => {
          debugger
          if (res && res.status === 1) {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              "Ủy quyền thành công",
              MessageType.Read,
              4000,
              true,
              false
            );
            this.router.navigate(['/Meet']);
          } else {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Error,
              4000,
              true,
              false,
              3000,
              "top"
            );
          }
        });
      this.changeDetectorRefs.detectChanges();
    });
  }

  GroupDept(inputArray) {
    const resultArray = inputArray.reduce((acc, curr) => {
      if (curr.DepartmentID !== 0 && curr.DepartmentName) {
        const existingDept = acc.find(item => item.DepartmentID === curr.DepartmentID);
        if (existingDept) {
          existingDept.listUser.push(curr);
        } else {
          acc.push({ DepartmentID: curr.DepartmentID, DepartmentName: curr.DepartmentName, listUser: [curr] });
        }
      }
      return acc;
    }, []);
    return resultArray;
  }

  onKeydownHandler() {
    this.searchData = this.searchData.trim();

    // Nếu chuỗi tìm kiếm rỗng, trả về danh sách ban đầu
    if (this.searchData === '') {
      this.listGroupDept = [...this.listGroupDeptOrigin];
      return;
    }

    // Thực hiện tìm kiếm trong danh sách tạm thời và lọc các phần tử khớp
    this.listGroupDept = this.listGroupDeptOrigin.filter(item =>
      item.DepartmentName.toLowerCase().includes(this.searchData.toLowerCase())
    );

  }

  clearSearch() {
    this.searchData = '';
    if (this.searchData === '') {
      this.listGroupDept = [...this.listGroupDeptOrigin];
      return;
    }
  }

  OpenQuanLyDiemDanh() {
    const objData = new QLCuocHopModel();
    objData.Id = this.ID_Meeting;
    const dialogRef = this.dialog.open(QuanLyDiemDanhComponent, { data: { _item: this.ID_Meeting }, width: '80%' });
    dialogRef.afterClosed().subscribe(res => {
      this.loadData();
    });
  }

  danhDauDaXuLy() {
    const _title: string = 'Xác nhận đã xử lý cuộc họp ';
    const _description: string = 'Bạn có chắc muốn đưa cuộc họp này vào danh sách đã xử lý?';
    const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, '', false);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dangKyCuocHopService.danhDauDaXuLy(this.ID_Meeting).subscribe((res: any) => {
        if (res && res.status === 1) {
          this.layoutUtilsService.showActionNotification(
            'Lưu trữ thành công',
            MessageType.Read,
            4000,
            true,
            false,
            3000,
            "top"
          );
          this.loadData()
          this.changeDetectorRefs.detectChanges()
        } else {
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Read,
            9999999999,
            true,
            false,
          );
          this.changeDetectorRefs.detectChanges()
        }
      });
    });

  }
}
