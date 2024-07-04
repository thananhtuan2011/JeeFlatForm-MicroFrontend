import { find } from 'lodash';

import { environment } from './../../../../../environments/environment';
import { ChangeDetectorRef, Component, Inject, Input, NgZone, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { QuanLyCuocHopService } from '../../_services/quan-ly-cuoc-hop.service';
import { DiagramComponent, DiagramTooltipModel } from '@syncfusion/ej2-angular-diagrams';
import { FormControl } from '@angular/forms';
import { tinyMCE_MT } from '../tinyMCE-MT';
import { QLCuocHopModel, QuanLyPhieuLayYKienModel, QuanLySoTayGhiChuCuocHopModel, ThongKeDangCauHoiModel } from '../../_models/quan-ly-cuoc-hop.model';
import { QuanLyCuocHopEditComponent } from '../quan-ly-cuoc-hop-edit/quan-ly-cuoc-hop-edit.component';
import { BehaviorSubject, Subject, Subscription, of } from 'rxjs';
import { CuocHopInfoComponent } from '../components/cuoc-hop-info/cuoc-hop-info.component';
// import { QuanLyBangKhaoSatListComponent } from '../../quan-ly-bang-khao-sat/quan-ly-bang-khao-sat-list/quan-ly-bang-khao-sat-list.component';
import { DanhSachPhatBieuComponent } from '../components/danh-sach-phat-bieu/danh-sach-phat-bieu.component';
import { QuanLyDiemDanhComponent } from '../components/quan-ly-diem-danh/quan-ly-diem-danh.component';
import { QuanLySoTayGhiChuCuocHopAddComponent } from '../components/ql-so-tay-ghi-chu-ch-add/ql-so-tay-ghi-chu-ch-add.component';
import { MeetingFeedbackAddComponent } from '../components/meeting-feedback-add/meeting-feedback-add.component';
import { MeetingSupportAddComponent } from '../components/meeting-support-add/meeting-support-add.component';
// import { QuanLySoTayCuocHopListComponent } from '../../quan-ly-so-tay-cuoc-hop/quan-ly-so-tay-cuoc-hop-list/quan-ly-so-tay-cuoc-hop-list.component';
// import { QuanLyYKienGopYListComponent } from '../../ql-ykien-gopy/ql-ykien-gopy-list/ql-ykien-gopy-list.component';
import { SurveyListComponent } from '../components/survey-list/survey-list.component';
// import { QuanLyPhieuLayYKienListDialogComponent } from '../../quan-ly-phieu-lay-y-kien/quan-ly-phieu-lay-y-kien-list-dialog/quan-ly-phieu-lay-y-kien-list.component';
import { DiagramViewAddComponent } from '../diagram-view/diagram-view.component';
import { CuocHopNotiFyComponent } from '../cuoc-hop-notify/cuoc-hop-notify.component';
import { UserViewDocumentListComponent } from '../user-view-document-list/user-view-document-list.component';
import { DienBienCuocHopComponent } from '../components/dien-bien-cuoc-hop/dien-bien-cuoc-hop.component';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { catchError, finalize, share, takeUntil, tap } from 'rxjs/operators';
import { JeeChooseMemberComponent } from '../jee-choose-member/jee-choose-member.component';
import { QuanLySoTayCuocHopListComponent } from '../../quan-ly-so-tay-cuoc-hop/quan-ly-so-tay-cuoc-hop-list/quan-ly-so-tay-cuoc-hop-list.component';
import { QuanLyYKienGopYListComponent } from '../../ql-ykien-gopy/ql-ykien-gopy-list/ql-ykien-gopy-list.component';
import { QuanLyBangKhaoSatListComponent } from '../../quan-ly-bang-khao-sat/quan-ly-bang-khao-sat-list/quan-ly-bang-khao-sat-list.component';
import { QuanLyPhieuLayYKienListDialogComponent } from '../../quan-ly-phieu-lay-y-kien/quan-ly-phieu-lay-y-kien-list-dialog/quan-ly-phieu-lay-y-kien-list.component';
import { HttpParams } from '@angular/common/http';
import { MeetingStore } from '../../_services/meeting.store';
import { MeetingFeedbackListComponent } from '../components/meeting-feedback-list/meeting-feedback-list.component';
import { ExportWordComponent } from '../components/export-word/export-word.component';
import Recorder from 'recorder-js';
import { ThemMoiCongViecComponent } from '../components/work-gov/them-moi-cong-viec/them-moi-cong-viec.component';
import { QuanLyDocumentAddComponent } from '../ql-add-document/ql-add-document.component';
import { KhongDuyetFileDialogComponent } from '../khong-duyet-file-dialog/khong-duyet-file-dialog.component';
import { InMaQRComponent } from '../components/in-ma-qr/in-ma-qr.component';
import { JeeCommentStore } from '../../../JeeCommentModule/jee-comment/jee-comment.store';
import { ChooseUserThemTaiLieuComponent } from '../components/choose-user-chuan-bi-tai-lieu/choose-user-chuan-bi-tai-lieu.component';
import { quillConfig } from '../components/editor/Quill_config';
import { DangKyCuocHopService } from '../../_services/dang-ky-cuoc-hop.service';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { QuanLySoTayCuocHopListV2Component } from '../../quan-ly-so-tay-cuoc-hop/quan-ly-so-tay-cuoc-hop-list-v2/quan-ly-so-tay-cuoc-hop-list-v2.component';
import { ChooseMemberV2Component } from '../jee-choose-member/choose-menber-v2/choose-member-v2.component';
import moment from 'moment';
import { ThemMoiCongViecVer2Component } from 'projects/jeework/src/app/page/jee-work/MenuWork/them-moi-cong-viec-ver2/them-moi-cong-viec-ver2.component';
@Component({
  selector: 'app-cuoc-hop-chi-tiet',
  templateUrl: './cuoc-hop-chi-tiet.component.html',
  styleUrls: ['./cuoc-hop-chi-tiet.component.scss'],
})
export class ChiTietCuocHopComponent implements OnInit {
  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  dataDetailTask: any;
  dataHitoryTaiLieu: any = []
  dataHitoryMeet: any = []
  listGroupDept: any = []
  private readonly componentName = 'comment-jeemeet';
  topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly onDestroy = new Subject<void>();
  Timer: any
  EDIT_FONT_EDITOR: string = '';
  EDIT_FONTSIZE_EDITOR: string = '';
  NoiDungKetLuan: string;
  NoiDungTomTat: string
  IsDuyet: number;
  noidung: string
  ShowEditorTomTat: boolean = false
  ShowEditorKetLuan: boolean = false
  ShowCongViec: boolean = false
  public quillConfig: {};
  editorStyles = {
    'min-height': '200px',
    'max-height': '200px',
    height: '100%',
    'font-size': '12pt',
    'overflow-y': 'auto',
    // 'width':'80pw'
  };
  btnSend: boolean = false
  TenDuAn: string
  isLoader: boolean = false
  Lstlengh: number = 0;
  CuocHop: any[] = []
  CuocHop_uyquyen: any[] = []
  ID_Meeting: number
  tinyMCE = {};
  isRecordingPaused = false;
  Type: number
  TypeTab: number
  labelFilter: string = 'Tất cả';
  tinhTrang: any = '0'
  listNguoiThamGia: any[] = [];
  listNguoiThamGiaRemove: any[] = [];
  isExist: number = 0;
  searchData: string = ""
  searchControl = new FormControl();
  NoiDungDienBien: string
  IsXacNhanViecUyQuyen: boolean = false;
  //lstFileDinhKem:any[]=[];
  idS: number = 0;
  ks: number = 0;
  IsDel: boolean = false;
  R: any = {};
  IdKhaoSat: any = {};
  idMR: number = 0;

  isExitsDiagram: boolean = false;
  isExistSurveyResult: boolean = false;

  isObligate: boolean = false;

  isFeedback: boolean = false;
  checkFeedBack: boolean = false;
  isOnOffFeeback: boolean = false;

  isSecretary: boolean = false;

  checkSupport: boolean = false;
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
  files: any[] = [{ data: {} }];
  //ListFileDinhKem: any[] = [];
  ListFileDK: any[] = [];
  file: string = "";
  file1: string = "";
  file2: string = "";
  IsKetThuc: number = 0;
  sizemaxfile: any = environment.DungLuong / 1048576;
  ExtensionImg = ["png", "gif", "jpeg", "jpg"];
  strExtensionImg = "png, .gif, .jpeg, .jpg";
  dataNotify: any[] = [];
  isCompleted: boolean = false;
  checkcountrow: boolean = false;
  TongSoThongBao: number = 0;
  record: number = 5;
  user_tam: any[] = [];
  @Input() dot: string;

  // Show pulse on icon
  @Input() pulse: boolean;

  @Input() pulseLight: boolean;
  private intervalId: any;
  // Set icon class name
  @Input() icon: string = 'flaticon2-bell-alarm-symbol';
  @Input() iconType: '' | 'success';

  // Set true to icon as SVG or false as icon class
  @Input() useSVG: boolean;
  showCancelBtn: boolean = false;
  // Set bg image path
  @Input() bgImage: string;

  // Set skin color, default to light
  @Input() skin: 'light' | 'dark' = 'light';

  @Input() type: 'brand' | 'success' = 'success';

  @ViewChild('diagram', { static: true })
  public diagram: DiagramComponent;
  public tooltip: DiagramTooltipModel;
  blobFile: string | ArrayBuffer | null;;
  recordAudio;
  sendObj = {
    audio: null
  };
  // audioContext = new (AudioContext)({ sampleRate: 16000 });
  // recorder = new Recorder(this.audioContext, {});
  private audioContext: AudioContext;
  private recorder: Recorder;
  start: any = 0;
  files_ghiam = [];
  file_ghiam: any = {
    strBase64: "",
    filename: "audio",
    extension: "mp4",
    isnew: true,
    type: 1
  }
  recordingTime: number = 0;
  recorddata: any = {};
  options: any = {};
  public isPlaying: boolean = false;
  myNumber = 3.14159;
  roundedNumber = Math.floor(this.myNumber);
  private isRecording: boolean = false;
  private isPaused: boolean = false;
  public shouldCountdown: boolean = true;
  isPopupOpen: boolean = false;
  isCancelled: boolean = false;
  isSaved: boolean = false;
  SetTimer: string = '00:00:00';
  domain: any
  IsXem: any
  checkAddDocument: boolean = false;
  hiddenwork: boolean = false
  listNguoiThamGiaDuocUyQuyen: any[] = [];
  sb: Subscription;
  constructor(public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: JeeCommentStore,
    private translate: TranslateService,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dangKyCuocHopService: QuanLyCuocHopService,
    public cuocHopService: DangKyCuocHopService,
    private storeMT: MeetingStore,
    private _ngZone: NgZone) {
  }

  /** LOAD DATA */
  ngOnInit() {
    let queryParams = new QueryParamsModel({});
    queryParams.more = true;
    this.dangKyCuocHopService.getDSNhanVien(queryParams).subscribe((res: any) => {
      if (res && res.status === 1) {
        this.options.data = res.data;
      };
    })
    this.quillConfig = quillConfig;

    this.activatedRoute.params.subscribe((params) => {
      this.ID_Meeting = +params.id;
      this.dangKyCuocHopService.connectToken(this.ID_Meeting + "");
      const url = window.location.href;
      let paramValue = undefined;
      if (url.includes('?')) {
        const httpParams = new HttpParams({ fromString: url.split('?')[1] });
        if (httpParams.get('Type') == "0") {
          this.storeMT.data_shareActived = ('1')
        }
        if (httpParams.get('Type') == "1") {
          this.storeMT.data_shareActived = ('0')
        }
        if (httpParams.get('Type') == "3") {
          this.storeMT.data_shareActived = ('3')
        }
        if (httpParams.get('Type') == "3") {
          this.TypeTab = 3
          this.dangKyCuocHopService.Get_ChiTietCuocHop_UyQuyen(this.ID_Meeting).subscribe((res: any) => {
            if (res.status == 1) {
              this.CuocHop = []
              this.CuocHop_uyquyen = res.data;
              this.checkAddDocument = true;
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
          });
        } else {
          this.TypeTab = 1
          this.Type = 1
          this.dangKyCuocHopService.Get_ChiTietCuocHop(this.ID_Meeting).subscribe((res: any) => {
            if (res.status == 1) {
              this.CuocHop_uyquyen = []
              this.CuocHop = res.data;
              //this.ListFileDinhKem = res.data.ListFileDinhKem;
              this.noidung = res.data[0].TomTatNoiDung;
              this.ListFileDK = res.data[0].ListFile;
              this.ks = res.data[0] ? res.data[0].IdKhaoSat : this.idS;
              this.idS = res.data[0] ? res.data[0].IdKhaoSat : this.idS;
              this.isExist = res.data[0] ? res.data[0].IsExist : this.isExist;
              this.NoiDungDienBien = res.data[0].NoiDungDienBienCuocHop
              this.idMR = res.data[0] ? res.data[0].IdPhongHop : 0;
              this.isExitsDiagram = res.data[0] ? res.data[0].IsExitsDiagram : false;
              this.isExistSurveyResult = res.data[0] ? res.data[0].IsExistSurveyResult : false;
              this.isFeedback = res.data[0] ? res.data[0].IsFeedback : false;
              this.checkFeedBack = res.data[0] ? res.data[0].CheckFeedBack : false;
              this.isOnOffFeeback = res.data[0] ? res.data[0].IsOnOffFeeback : false;
              this.isSecretary = res.data[0] ? res.data[0].IsThuKy : false;
              this.isCompleted = res.data[0] ? res.data[0].IsCompleted : false;
              this.checkSupport = res.data[0] ? res.data[0].CheckSupport : false;
              this.IsDuyet = res.data[0].IsDuyet;
              this.IsKetThuc = res.data[0].IsKetThuc;
              this.checkAddDocument = res.data[0].checkBoSungTaiLieuType5.length > 0 ? true : false;
              this.listGroupDept = this.GroupDept(res.data[0].ThanhPhan)
              this.loadHistoryTaiLieu()
              this.loadHistoryMeet()
              this.loadObjectIdComment()
              this.dangKyCuocHopService.Project_Detail(res.data[0].listid).subscribe((res) => {
                if (res && res.status === 1) {
                  // this.itemw = res.data;
                  this.changeDetectorRefs.detectChanges();
                  this.hiddenwork = false
                } else if (res && res.status === 0) {
                  this.hiddenwork = true
                }
              });
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
          });
        }
      }


    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const meetParamIndex = event.url.indexOf('/Meet/');
        if (meetParamIndex !== -1) {
          const slicedString = event.url.slice(meetParamIndex + '/Meet/'.length);
          const parts = slicedString.split('?Type=');

          if (parts.length === 2) {
            const number1 = parts[0]; // Số 1043
            const number2 = parts[1]; // Số 3

            if (number1 == this.ID_Meeting + '') {
              if (number2 == "3") {
                this.TypeTab = 3
                this.dangKyCuocHopService.Get_ChiTietCuocHop_UyQuyen(this.ID_Meeting).subscribe((res: any) => {
                  if (res.status == 1) {
                    this.CuocHop = []
                    this.CuocHop_uyquyen = res.data;
                    this.checkAddDocument = true;
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
                });
              } else {
                this.TypeTab = 1
                this.loadData()
              }
            }
          }
        }

      }
    });

    this.cuocHopService.data_shareLoadChiTiet$.subscribe((data: any) => {
      if (data && data != '') {
        this.loadData()
      }
    })
    this.sb = this.store.notifymeet$.subscribe((res) => {
      if (res) {
        this.dangKyCuocHopService.sendNotifyComment(res).subscribe(response => {
          this.store.notify = null
        })
      }
    })

    this.tinyMCE = tinyMCE_MT;
    this.activatedRoute.data.subscribe((v) => {
      this.Type = v.Type
    });
    this.searchControl.valueChanges.subscribe(() => {
      this.searchData = this.searchControl.value

    }
    )

    this.dangKyCuocHopService.NewMess$.subscribe((message: any) => {
      this._ngZone.run(() => {
        if (message) {
          if (message.type == 1) {
            this.NoiDungDienBien = message.data.noiDung;
          }
          if (message.type == 2) {
            let data = message.data
            const thanhPhan = this.CuocHop[0]?.ThanhPhan;
            if (data.userID !== 0 && thanhPhan) {
              const foundItem = thanhPhan.find((item) => item.idUser == data.userID);
              if (foundItem) {
                foundItem.XinPhatBieu = false;
              }
            }
          }
          if (message.type == 3) {
            this.CuocHop[0].KetLuan = message.data.noiDung;
            if (message.data.listFile) {
              if (message.data.listFile.lenght > 0) {
                this.loadData();
              }
            }
          }
          if (message.type == 4) {
            this.CuocHop[0].TomTatNoiDung = message.data.noiDung;
          }
          if (message.type == 5) {
            this.loadData();
          }
          if (message.type == 6) {
            this.loadData();
          }
          if (message.type == 7) {
            this.loadData();
          }
          if (message.type == 9) {
            this.loadData();
          }
          if (message.type == 8) {
            this.loadData();
          }
          if (message.type == 10) {
            this.loadData();
          }
          this.changeDetectorRefs.detectChanges()
        }
      });
    });
    this.recordAudio = () => {
      return new Promise(resolve => {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            const mediaRecorder = new MediaRecorder(stream, {
              mimeType: 'audio/webm',
              // numberOfAudioChannels: 1,
              audioBitsPerSecond: 16000,
            });
            const audioChunks = [];

            mediaRecorder.addEventListener("dataavailable", (event: any) => {
              audioChunks.push(event.data);
            });

            const start = () => {
              mediaRecorder.start();
            };


            const stop = () => {
              return new Promise(resolve => {
                mediaRecorder.addEventListener('stop', () => {
                  if (this.isRecordingPaused) {
                    const audioBlob = new Blob(audioChunks, { 'type': 'audio/mp3; codecs=MS_PCM' });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.addEventListener('load', () => {
                      const base64data = reader.result;
                      this.sendObj.audio = base64data;
                      let base64Str;
                      base64Str = reader.result as String;
                      var metaIdx = base64Str.indexOf(';base64,');
                      base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
                      this.file_ghiam.strBase64 = "";
                      this.file_ghiam.strBase64 = base64Str;
                    }, false);
                    const audioUrl = URL.createObjectURL(audioBlob);

                    const audio = new Audio(audioUrl);

                    reader.onload = function () { // this would give duration of the video/audio file
                      var media = new Audio(audioUrl);
                      media.onloadedmetadata = function () {
                        let duration = media.duration;
                      };
                    };
                    const play = () => {
                      audio.play();
                    };
                    resolve({ audioBlob, audioUrl, play });
                  } else {
                    resolve(null);
                  }
                });

                mediaRecorder.stop();
              });
            };
            resolve({ start, stop });
          });
      });
    };

  }

  loadObjectIdComment() {
    this.dangKyCuocHopService.getTopicObjectIDByComponentName(this.componentName + `-` + this.ID_Meeting).pipe(
      tap((res: any) => {
        this.topicObjectID$.next(res);
      }),
      catchError(err => {

        return of();
      }),
      finalize(() => { }),
      share(),
      takeUntil(this.onDestroy),
    ).subscribe();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    // clearInterval(this.Timer);
    // this.dangKyCuocHopService.disconnectToken(this.ID_Meeting + "")
  }

  loadData() {
    this.dangKyCuocHopService.Get_ChiTietCuocHop(this.ID_Meeting).subscribe((res: any) => {
      if (res.status == 1) {
        this.panelOpenState = true
        this.CuocHop = res.data;

        //this.ListFileDinhKem = res.data.ListFileDinhKem;
        this.noidung = res.data[0].TomTatNoiDung;
        this.ListFileDK = res.data[0].ListFile;
        this.ks = res.data[0] ? res.data[0].IdKhaoSat : this.idS;
        this.idS = res.data[0] ? res.data[0].IdKhaoSat : this.idS;
        this.isExist = res.data[0] ? res.data[0].IsExist : this.isExist;
        this.NoiDungDienBien = res.data[0].NoiDungDienBienCuocHop
        this.idMR = res.data[0] ? res.data[0].IdPhongHop : 0;
        this.isExitsDiagram = res.data[0] ? res.data[0].IsExitsDiagram : false;
        this.isExistSurveyResult = res.data[0] ? res.data[0].IsExistSurveyResult : false;
        this.isFeedback = res.data[0] ? res.data[0].IsFeedback : false;
        this.checkFeedBack = res.data[0] ? res.data[0].CheckFeedBack : false;
        this.isOnOffFeeback = res.data[0] ? res.data[0].IsOnOffFeeback : false;
        this.isSecretary = res.data[0] ? res.data[0].IsThuKy : false;
        this.isCompleted = res.data[0] ? res.data[0].IsCompleted : false;
        this.checkSupport = res.data[0] ? res.data[0].CheckSupport : false;
        this.IsDuyet = res.data[0].IsDuyet;
        this.IsKetThuc = res.data[0].IsKetThuc;
        this.checkAddDocument = res.data[0].checkBoSungTaiLieuType5.length > 0 ? true : false;
        this.listGroupDept = this.GroupDept(res.data[0].ThanhPhan)
        this.loadHistoryTaiLieu()
        this.loadHistoryMeet()
        this.loadObjectIdComment()
        this.dangKyCuocHopService.Project_Detail(res.data[0].listid).subscribe((res) => {
          if (res && res.status === 1) {
            // this.itemw = res.data;
            this.changeDetectorRefs.detectChanges();
            this.hiddenwork = false
          } else if (res && res.status === 0) {
            this.hiddenwork = true
          }
        });
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


  f_convertDate(v: any) {
    if (v != "" && v != null) {
      let a = new Date(v);
      return ("0" + (a.getDate())).slice(-2) + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + a.getFullYear();
    }
  }
  f_convertHour(v: any) {
    if (v != "" && v != null) {
      let a = new Date(v);
      return ("0" + (a.getHours())).slice(-2) + ":" + ("0" + (a.getMinutes())).slice(-2);
    }
  }
  DanhSachKetLuan() {
    // let _item = {
    // 	NoiDung: this.NoiDungTomTat,
    // 	meetingid: this.ID_Meeting,

    // }
    // const dialogRef = this.dialog.open(DanhSachFileKetLuanComponent, { data: { _item }, width: "800px", height: "400px" });
    // dialogRef.afterClosed().subscribe(res => {
    // });
  }
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
        this.isLoader = false
        this.TenDuAn = ""
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
        this.isLoader = false
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
        this.isLoader = false
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


  XacNhanThamGia(type: number) {
    var item = {
      meetingid: this.ID_Meeting,
      Note: "",
      Status: 1
    }
    if (type == 2) {
      const objData = new QLCuocHopModel();
      objData.Id = this.ID_Meeting;
      const dialogRef = this.dialog.open(CuocHopInfoComponent, { data: {}, width: '40%' });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        } else {
          item.Note = res._item
          item.Status = 2
          this.SaveXacNhan(item)
        }
      });
    } else {
      this.SaveXacNhan(item)
    }

  }

  SaveXacNhan(item: any) {
    this.dangKyCuocHopService.XacNhanThamGiaCuocHop(item).subscribe((res: any) => {
      if (res && res.status === 1) {
        this.layoutUtilsService.showActionNotification(
          this.translate.instant("QL_CUOCHOP.CUOCHOP.UPDATE_THANHCONG"),
          MessageType.Read,
          4000,
          true,
          false,
        );
        this.loadData()
        this.changeDetectorRefs.detectChanges()
      } else {
        this.isLoader = false
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Error,
          9999999999,
          true,
          false,
        );
        this.changeDetectorRefs.detectChanges()
      }
    });
  }

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
  new_row() {
    this.files.push({ data: {} });

  }
  remove(index) {
    this.files.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
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
          this.isLoader = false
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
    const _title: string = `Xác nhận ${item.Status == 3 ? 'mở hoãn' : 'hoãn'} cuộc họp `;
    const _description: string = 'Bạn có chắc muốn hoãn cuộc họp này?';
    const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, '', false);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dangKyCuocHopService.HoanCuocHop(this.ID_Meeting).subscribe((res: any) => {
        if (res && res.status === 1) {
          this.layoutUtilsService.showActionNotification(
            `${item.Status == 3 ? 'Mở hoãn' : 'Hoãn'} cuộc họp thành công`,
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
          this.isLoader = false
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
        this.dangKyCuocHopService.XoaCuocHop(this.ID_Meeting, this.IsDuyet).subscribe((res: any) => {
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
            if (this.Type == 1) {
              this.router.navigate(['/Meet']);
            } else {
              this.router.navigate(['/Meet']);
            }
            this.cuocHopService.data_shareLoad$.next(res)
            this.changeDetectorRefs.detectChanges()
          } else {
            this.isLoader = false
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
  chinhsua() {
    const QLCuocHop = new QLCuocHopModel();
    QLCuocHop.Id = this.ID_Meeting;
    QLCuocHop.IsDuyet = this.IsDuyet;

    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    saveMessageTranslateParam += QLCuocHop.Id > 0 ? 'UPDATE_MESSAGE' : 'ADD_MESSAGE';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = QLCuocHop.Id > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(QuanLyCuocHopEditComponent, { data: { QLCuocHop }, width: '60%' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.cuocHopService.data_shareLoad$.next(res)
      this.loadData();
    });
  }

  formatTime(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    this.SetTimer = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
    this.changeDetectorRefs.detectChanges();
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  async startPlay(startFrom: number = 0) {
    this.showCancelBtn = false; // Hiển thị nút Hủy
    //	this.isCancelled = false;
    this.recorder = await this.recordAudio();
    this.start = 1;
    this.changeDetectorRefs.detectChanges();
    setTimeout(() => {
      this.recorder.start();
    }, 1000)
    if (startFrom != 0) {
      this.intervalId = setInterval(() => {
        this.formatTime(this.recordingTime++);
      }, 1000);
    }
    else {
      //var recordingTime: number = 0;
      /// this.file_ghiam.strBase64 = '';
      this.resetRecording();
      this.intervalId = setInterval(() => {
        this.formatTime(this.recordingTime++);
      }, 1000);
    }


  }

  async stopPlay() {

    this.start = 2;
    this.isRecordingPaused = true;
    this.changeDetectorRefs.detectChanges();
    this.shouldCountdown = false;
    clearInterval(this.intervalId);
    const audio = await this.recorder.stop();

    audio.play();
    //stop();
    this.showCancelBtn = true; // Hiển thị nút Hủy
  }


  continue() {

    //this.isCancelled = true; // Đặt giá trị của biến isCancelled thành true
    //	clearInterval(this.intervalId); // Dừng đếm thời gian
    // this.start = 1;
    this.showCancelBtn = false; // Ẩn nút Hủy
    let startFrom: number = this.intervalId; // Lưu lại thời gian ghi âm hiện tại
    this.changeDetectorRefs.detectChanges();
    //this.startPlay(); // Gọi hàm startPlay để tiếp tục ghi âm từ thời gian đã lưu trữ được
    this.startPlay(startFrom);

  }
  cancel() {

    this.isCancelled = true; // Đặt giá trị của biến isCancelled thành true
    this.showCancelBtn = false; // Ẩn nút Hủy
    this.start = 0;
    let startFrom: number = this.recordingTime; // Lưu lại thời gian ghi âm hiện tại
    this.changeDetectorRefs.detectChanges();
    //this.startPlay();

  }
  prepareDataGhiAm() {

    const data: any = {};
    data.IdCuocHop = this.ID_Meeting;
    data.StrListFileDinhKems = this.file_ghiam.strBase64;
    data.NameFile = "audio";
    return data;
  }
  saveAudio() {
    // this.showCancelBtn = false;
    // const data = this.prepareDataGhiAm();
    // this.start = 0;
    // this.changeDetectorRefs.detectChanges();
    // this.dangKyCuocHopService.addaudio(data).subscribe(res => {
    //   if (res.status == 1) {
    //     this.dialogRef.close();
    //     this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Create, 2000, true, false);

    //   }
    //   else {
    //     this.dialogRef.close();
    //     this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 2000, true, false);
    //   }
    // });
    this.downloadBase64File(this.file_ghiam.strBase64, this.CuocHop[0].MeetingContent + '.mp3')
  }
  downloadBase64File(base64String, fileName) {
    var link = document.createElement('a');
    link.href = 'data:application/octet-stream;base64,' + base64String;
    link.download = fileName;
    link.click();
  }
  resetRecording() {
    this.recordingTime = 0;
    this.file_ghiam.strBase64 = '';
  }
  DanhSachThongKeDangCauHoi() {

    const ThongKeDangCauHoi = new ThongKeDangCauHoiModel();
    this.ThongKeDangCauHoi(ThongKeDangCauHoi);
  }
  ThongKeDangCauHoi(ThongKeDangCauHoi: any) {


    // const QLCuocHop = new QLCuocHopModel();
    // QLCuocHop.Id = this.ID_Meeting;
    // ThongKeDangCauHoi.IdCuocHop = QLCuocHop.Id
    // const dialogRef = this.dialog.open(ThongKeDangCauHoiListComponent, { data: { ThongKeDangCauHoi }, height: '60vh', width: '145vh' });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (!res) {
    //     return;
    //   }
    //   this.loadData();
    // });

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
  getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  ThamGiaPhongZoom(item: any) {

    if (item.LoginMeeting == true) {
      window.open(environment.DomainBackend + "/Meeting?id=" + item.RowID, '_blank');
    } else {
      if (item.TypeOpen == 1) {
        //nếu bằng 1 mở app desktop zoom
        if (item.isHost == true) {
          // nếu isHost = true sẽ gọi api update display name
          // this.dangKyCuocHopService.StartZoom(this.ID_Meeting).subscribe((res: any) => {
          // 	if (res == false) {
          // 		const _description =
          // 		this.translate.instant("QL_CUOCHOP.ERR_ZOOM_FAILED");
          // 		this.layoutUtilsService.showActionNotification(_description, MessageType.Read, 999999999);
          // 		return;
          // 	}else{
          // 		window.open(`https://zoom.us/s/${item.IdZoom}?zak=${item.TokenZak}`, '_blank');
          // 	}
          //   });
          window.open(`https://zoom.us/s/${item.IdZoom}?zak=${item.TokenZak}`, '_blank');
        } else {
          //nếu isHost = false sẽ join bằng role bình thường
          window.open(`zoommtg://zoom.us/join?confno=${item.IdZoom}&pwd=${item.PwdZoom}&zc=0&browser=${this.getBrowserName()}&uname=${item.HoTen}`);
        }
      }
      if (item.TypeOpen == 2) {
        //nếu bằng 2 mở sdk zoom
        window.open(`${environment.DomainBackend}zoom/` + this.ID_Meeting, '_blank');
      }
      if (item.TypeOpen == 3) {
        //nếu bằng 3 mở popup chọn hình thức join
      }
    }

  }
  ThamGiaPhongGoogle(url: any, item: any) {
    if (item.LoginMeeting == true && item.OtherMeet == false) {
      window.open(environment.DomainBackend + "/vi/Meeting?id=" + item.RowID, '_blank');
    } else {
      window.open(url, '_blank');
    }
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
        return "Chủ nhật";
      case 1:
        return "Thứ 2";
      case 2:
        return "Thứ 3";
      case 3:
        return "Thứ 4";
      case 4:
        return "Thứ 5";
      case 5:
        return "Thứ 6";
      case 6:
        return "Thứ 7";
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

  converFullDate(v: any) {
    let a = new Date(v);
    return ("0" + a.getDate()).slice(-2) + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + (a.getFullYear())
  }
  copy(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }
  QuayVe() {
    this.router.navigate(['/Meet']);
  }
  removeFile(index) {
    this.ListFileDK[index].IsDel = true;
    this.IsDel = this.ListFileDK[index].IsDel;

    this.changeDetectorRefs.detectChanges();

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
    if (!xacnhan) {
      switch (condition) {
        case 1:
          return "Tham gia";
        case 2:
          return "Từ chối tham gia";
        case 3:
          return "Không tham gia";
      }
      return "Tham gia";
    }
    switch (condition) {
      case 1:
        return "Tham gia";
      case 2:
        return "Từ chối tham gia";
      case 3:
        return "Không tham gia";
    }
    return "Chờ xác nhận";
  }

  getColorAction(condition: string): string {
    switch (condition) {
      case 'delete':
        return "#2209b7";
      case 'unapproved':
        return "red";
      case 'uploaded':
        return "rgb(35, 203, 209)";
      case 'approved':
        return "rgb(7, 126, 67)";
    }
  }
  getColor2(condition: number = 0, xacnhan: any): string {
    if (!xacnhan) {
      switch (condition) {
        case 1:
          return "#0A9562";
        case 2:
          return "#DC3545";
        case 3:
          return "#d3d3d3";
      }
      return "#0A9562";
    }
    switch (condition) {
      case 1:
        return "#0A9562";
      case 2:
        return "#DC3545";
      case 3:
        return "#d3d3d3";
    }
    return "#F48120";
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
  getTinhTrangClass1(condition: number = 0, xacnhan: any): string {
    if (!xacnhan) return "col-6 pd-0-tp";
    switch (condition) {
      case 1:
        return "col-6 pd-0-tp";
    }
    return "col-9 pd-0-tp";
  }
  getTinhTrangClass2(condition: number = 0, xacnhan: any): string {
    if (!xacnhan) return "col-5 pd-0-tp";
    switch (condition) {
      case 1:
        return "col-5 pd-0-tp";
    }
    return "col-2 pd-0-tp";
  }
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
    const dialogRef = this.dialog.open(ChooseMemberV2Component, { data: { _item, inputNodeId, meetingType_member, _type, private_meeet: true, meeet_type_nember: meeet_type_nember }, width: '40%' });
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

  chooseSurveyList(type) {

    this.dangKyCuocHopService.getIsObligate(this.ID_Meeting).subscribe(res => {
      let isObligate = res;
      const objData = new QLCuocHopModel();
      objData.Id = this.ID_Meeting;
      const dialogRef = this.dialog.open(QuanLyPhieuLayYKienListDialogComponent, { data: { objData, type }, width: '80vw' });
      dialogRef.afterClosed().subscribe(res => {
        this.loadData();
        if (!res) {
          return;
        }
        this.isExist = res.data;
        this.changeDetectorRefs.detectChanges;
      });
    });

  }

  Export() {
    const objData = new QLCuocHopModel();
    objData.Id = this.ID_Meeting;
    const dialogRef = this.dialog.open(ExportWordComponent, { data: { item: this.CuocHop[0] }, width: '80vh' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.loadData();
    });

  }


  viewNotify(id) {
    var type = 1;
    var objData = { Id: 0 };
    objData.Id = id;
    // const dialogRef = this.dialog.open(SurveyListComponent, { data: { objData, type }, height: '100vh', width: '80vw' });
    // dialogRef.afterClosed().subscribe(res => {
    //   this.loadData();
    //   if (!res) {
    //     return;
    //   }
    //   this.isExist = res.data;
    //   this.changeDetectorRefs.detectChanges;
    // });

  }


  isNullOrEmty(value: any) {
    if (value != null && value != undefined && value != '') {
      return true;
    } else {
      return false;
    }

  }

  chooseResuilt(type) {
    const QuanLyPhieuLayYKien = new QuanLyPhieuLayYKienModel();
    this.chooseResuiltWithIsObligate(type, QuanLyPhieuLayYKien);
  }
  chooseResuilt_(type, QuanLyPhieuLayYKien: any) {
    const objData = new QLCuocHopModel();
    objData.Id = this.ID_Meeting;

    //QuanLyPhieuLayYKien.IdKhaoSat = this.idS;
    QuanLyPhieuLayYKien.IdCuocHop = this.ID_Meeting;

    // const dialogRef = this.dialog.open(khaosatPhieuKhaoSatListComponent, {
    //   data: { type, QuanLyPhieuLayYKien },
    //   width: "1000px",
    // });
    // dialogRef.afterClosed().subscribe((res) => {
    //   if (!res) {
    //     return;
    //   }

    //   this.loadData();
    // });
  }


  chooseResuiltWithIsObligate(type, QuanLyPhieuLayYKien: any) {
    // this.dangKyCuocHopService.getIsObligate(this.ID_Meeting).subscribe(res => {
    // 	let isObligate = res;
    // QuanLyPhieuLayYKien.IdCuocHop = this.ID_Meeting;
    // const dialogRef = this.dialog.open(khaosatPhieuKhaoSatListComponent, {
    //   data: { type, QuanLyPhieuLayYKien },
    //   width: "1000px",
    // });
    // dialogRef.afterClosed().subscribe((res) => {
    //   if (!res) {
    //     return;
    //   }
    //   this.loadData();
    // });
    // });

  }

  // chooseResuilt(type) {
  // 	const objData = new QLCuocHopModel();
  // 	objData.Id = this.ID_Meeting;
  // 	const dialogRef = this.dialog.open(CauHoiDaTraLoiComponent, { data: { objData, type }, height: '100vh', width: '80vw' });
  // 	dialogRef.afterClosed().subscribe(res => {
  // 		if (!res) {
  // 			return;
  // 		}
  // 		this.loadData();
  // 	});

  // 	}


  chooseSurveyLists(type) {
    const objData = new QLCuocHopModel();
    objData.Id = this.ID_Meeting;
    const dialogRef = this.dialog.open(SurveyListComponent, { data: { objData, type }, width: "40%", });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.loadData();
    });

  }


  refreshSurveyList() {
    const _title: string = this.translate.instant('MENU_KHAOSAT.REFRESH', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') });
    const _description: string = this.translate.instant('MENU_KHAOSAT.DESCRIPTIONREFRESH', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') });
    const _waitDesciption: string = this.translate.instant('MENU_KHAOSAT.WAIT_DESCRIPTIONREFRESH', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') });
    const _deleteMessage: string = this.translate.instant('MENU_KHAOSAT.MESSAGEREFRESH', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') });
    const _deleteMessageno: string = this.translate.instant('MENU_KHAOSAT.MESSAGENOREFRESH', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') });
    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dangKyCuocHopService.refreshSurveyList(this.ID_Meeting, 0).subscribe(res => {
        if (res >= 0) {
          this.isExist = res;
          this.changeDetectorRefs.detectChanges();
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 2000, true, false);
        }
        else {
          this.layoutUtilsService.showActionNotification(_deleteMessageno, MessageType.Error, 2000, true, false);
        }
      });
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

  OpenQuanLyDiemDanh() {
    const objData = new QLCuocHopModel();
    objData.Id = this.ID_Meeting;
    const dialogRef = this.dialog.open(QuanLyDiemDanhComponent, { data: { _item: this.ID_Meeting }, width: '80%' });
    dialogRef.afterClosed().subscribe(res => {
      this.loadData();
    });

  }

  OpenDanhSachPhatBieu() {
    const objData = new QLCuocHopModel();
    objData.Id = this.ID_Meeting;
    const dialogRef = this.dialog.open(DanhSachPhatBieuComponent, { data: { _item: this.ID_Meeting }, width: '1000px' });
    dialogRef.afterClosed().subscribe(res => {
      this.loadData();
    });

  }

  public setupTinyMce(): any {
    if (this.EDIT_FONT_EDITOR == '' && this.EDIT_FONTSIZE_EDITOR == '') {
      return {
        plugins: 'paste print code preview  searchreplace autolink directionality  visualblocks visualchars fullscreen image link media  template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help powerpaste ',
        toolbar: 'undo redo |image| styleselect |  fontselect| fontsizeselect| bold italic underline | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | forecolor backcolor image link table  | removeformat preview ',
        toolbar_mode: 'wrap',
        image_uploadtab: true,
        paste_as_text: true,
        height: 400,
        fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",
        // font_formats: 'Helvetica=Helvetica;UTM Avo=UTMAvo;',
        font_formats: "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; UTM Avo=UTMAvo; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
        images_upload_url: environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop',
        automatic_uploads: true,
        images_upload_base_path: '/images',
        convert_urls: true,
        relative_urls: false,
        remove_script_host: false,
        images_upload_credentials: true,
        images_upload_handler: function (blobInfo, success, failure) {
          var xhr, formData;

          xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open('POST', environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop');

          xhr.onload = function () {
            var json;

            if (xhr.status < 200 || xhr.status >= 300) {
              failure('HTTP Error: ' + xhr.status);
              return;
            }
            json = JSON.parse(xhr.responseText);

            if (!json || typeof json.imageUrl != 'string') {
              failure('Invalid JSON: ' + xhr.responseText);
              return;
            }
            success(json.imageUrl);
          };
          formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());

          xhr.send(formData);
        },
        init_instance_callback: function () {
          var freeTiny = document.querySelector('.tox .tox-notification--in') as HTMLInputElement;
          freeTiny.style.display = 'none';
        },
        content_style: '.tox-notification--in{display:none};'
      };
    }
    else if (this.EDIT_FONT_EDITOR != '' && this.EDIT_FONTSIZE_EDITOR == '') {
      return {
        plugins: 'paste print code preview  searchreplace autolink directionality  visualblocks visualchars fullscreen image link media  template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help powerpaste ',
        toolbar: 'undo redo |image| styleselect |  fontselect| fontsizeselect| bold italic underline | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | forecolor backcolor image link table  | removeformat preview ',
        toolbar_mode: 'wrap',
        image_uploadtab: true,
        paste_as_text: true,
        height: 400,
        fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",
        font_formats: this.EDIT_FONT_EDITOR,
        images_upload_url: environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop',
        automatic_uploads: true,
        images_upload_base_path: '/images',
        convert_urls: true,
        relative_urls: false,
        remove_script_host: false,
        images_upload_credentials: true,
        images_upload_handler: function (blobInfo, success, failure) {
          var xhr, formData;

          xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open('POST', environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop');

          xhr.onload = function () {
            var json;

            if (xhr.status < 200 || xhr.status >= 300) {
              failure('HTTP Error: ' + xhr.status);
              return;
            }
            json = JSON.parse(xhr.responseText);

            if (!json || typeof json.imageUrl != 'string') {
              failure('Invalid JSON: ' + xhr.responseText);
              return;
            }
            success(json.imageUrl);
          };
          formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());

          xhr.send(formData);
        },
        init_instance_callback: function () {
          var freeTiny = document.querySelector('.tox .tox-notification--in') as HTMLInputElement;
          freeTiny.style.display = 'none';
        },
        content_style: '.tox-notification--in{display:none};'
      };
    }
    else if (this.EDIT_FONT_EDITOR == '' && this.EDIT_FONTSIZE_EDITOR != '') {
      return {
        plugins: 'paste print code preview  searchreplace autolink directionality  visualblocks visualchars fullscreen image link media  template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help powerpaste ',
        toolbar: 'undo redo |image| styleselect |  fontselect| fontsizeselect| bold italic underline | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | forecolor backcolor image link table  | removeformat preview ',
        toolbar_mode: 'wrap',
        image_uploadtab: true,
        paste_as_text: true,
        height: 400,
        fontsize_formats: this.EDIT_FONTSIZE_EDITOR,
        font_formats: "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; UTM Avo=UTMAvo; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
        images_upload_url: environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop',
        automatic_uploads: true,
        images_upload_base_path: '/images',
        convert_urls: true,
        relative_urls: false,
        remove_script_host: false,
        images_upload_credentials: true,
        images_upload_handler: function (blobInfo, success, failure) {
          var xhr, formData;

          xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open('POST', environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop');

          xhr.onload = function () {
            var json;

            if (xhr.status < 200 || xhr.status >= 300) {
              failure('HTTP Error: ' + xhr.status);
              return;
            }
            json = JSON.parse(xhr.responseText);

            if (!json || typeof json.imageUrl != 'string') {
              failure('Invalid JSON: ' + xhr.responseText);
              return;
            }
            success(json.imageUrl);
          };
          formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());

          xhr.send(formData);
        },
        init_instance_callback: function () {
          var freeTiny = document.querySelector('.tox .tox-notification--in') as HTMLInputElement;
          freeTiny.style.display = 'none';
        },
        content_style: '.tox-notification--in{display:none};'
      };
    }
    else {
      return {
        plugins: 'paste print code preview  searchreplace autolink directionality  visualblocks visualchars fullscreen image link media  template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help powerpaste ',
        toolbar: 'undo redo |image| styleselect |  fontselect| fontsizeselect| bold italic underline | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | forecolor backcolor image link table  | removeformat preview ',
        toolbar_mode: 'wrap',
        image_uploadtab: true,
        paste_as_text: true,
        height: 400,
        fontsize_formats: this.EDIT_FONTSIZE_EDITOR,
        font_formats: this.EDIT_FONT_EDITOR,
        images_upload_url: environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop',
        automatic_uploads: true,
        images_upload_base_path: '/images',
        convert_urls: true,
        relative_urls: false,
        remove_script_host: false,
        images_upload_credentials: true,
        images_upload_handler: function (blobInfo, success, failure) {
          var xhr, formData;
          xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open('POST', environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop');
          xhr.onload = function () {
            var json;

            if (xhr.status < 200 || xhr.status >= 300) {
              failure('HTTP Error: ' + xhr.status);
              return;
            }
            json = JSON.parse(xhr.responseText);

            if (!json || typeof json.imageUrl != 'string') {
              failure('Invalid JSON: ' + xhr.responseText);
              return;
            }
            success(json.imageUrl);
          };
          formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());

          xhr.send(formData);
        },
        init_instance_callback: function () {
          var freeTiny = document.querySelector('.tox .tox-notification--in') as HTMLInputElement;
          freeTiny.style.display = 'none';
        },
        content_style: '.tox-notification--in{display:none};'
      };
    }
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
          this.translate.instant("QL_CUOCHOP.CUOCHOP.UPDATE_THANHCONG"),
          MessageType.Read,
          4000,
          true,
          false,
        );
        this.loadData()
        this.changeDetectorRefs.detectChanges()
      } else {
        this.isLoader = false
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



  viewDiagram() {
    const DiagramView = new QLCuocHopModel();
    DiagramView.Id = this.ID_Meeting;
    const isSecretary = this.isSecretary;
    const dialogRef = this.dialog.open(DiagramViewAddComponent, {
      data: { DiagramView, isSecretary },
      width: '100vw', height: '90vh'
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.loadData();
    });

  }
  viewAudioRecord() {
    // const audioview = new QLCuocHopModel();
    // audioview.Id = this.ID_Meeting;
    // const isSecretary = this.isSecretary;
    // const dialogRef = this.dialog.open(RecordViewComponent, {
    //   data: { audioview, isSecretary }, disableClose: true,
    //   width: '700px', height: '300px'
    // });
    // dialogRef.afterClosed().subscribe((res) => {
    //   if (!res) {
    //     return;
    //   }
    //   this.loadData();
    // });

  }
  viewNotifyCH(status: number = 0) {
    if (status == 0) {
      this.record += 5;
    }
    else {
      this.record = 5;
    }
    this.dangKyCuocHopService.GetListThongBaoByIdCuocHop(this.ID_Meeting, this.record).subscribe(res => {
      if (!res.data) {
        return;
      }
      this.dataNotify = res.data
      this.TongSoThongBao = res.data[0].TongSoLuong;
      this.checkcountrow = res.data[0].checksoluong;// neu bang 1 thi co the load them
      this.changeDetectorRefs.detectChanges();
    });

  }
  backGroundStyle(): string {
    if (!this.bgImage) {
      return 'none';
    }

    return 'url(' + this.bgImage + ')';
  }
  onOffFeedback(isFeedback: boolean) {
    const _messageYes: string = this.translate.instant('ComMon.THANHCONG');
    const _messageNo: string = this.translate.instant('ComMon.THATBAI');
    this.dangKyCuocHopService.onOffFeedback(this.ID_Meeting, isFeedback).subscribe(res => {
      if (res.status = 1) {
        this.layoutUtilsService.showActionNotification(_messageYes, MessageType.Delete, 2000, true, false);
      }
      else {
        this.layoutUtilsService.showActionNotification(_messageNo, MessageType.Error, 2000, true, false);
      }
      this.loadData();
    });

  }

  selectFile(i) {
    let f = document.getElementById("FileUpLoad" + i);
    f.click();

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
      // this.loadData();
    });

  }


  getListFeedback() {
    const _data: any = {};
    _data.IdRow = 0;
    _data.IdM = this.ID_Meeting;
    _data.IsCompleted = this.isCompleted;
    const dialogRef = this.dialog.open(MeetingFeedbackListComponent, { data: { _data }, width: '60vw' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      // this.loadData();
    });

  }

  sendNotify() {

    const _data: any = {};
    _data.IdRow = 0;
    _data.IdM = this.ID_Meeting;
    _data.IsCompleted = this.isCompleted;
    const dialogRef = this.dialog.open(CuocHopNotiFyComponent, { data: { _data }, width: '700px' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      // this.loadData();
    });

  }
  settingsSurvey() {
    const _data: any = {};
    _data.IdM = this.ID_Meeting;
    _data.SettingsSurvey = true;
    const dialogRef = this.dialog.open(QuanLyBangKhaoSatListComponent, { data: { _data }, height: '90vh', width: '90vw' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.loadData();
    });

  }


  addPersonalTask() {
    // const _data = new PersonalTaskModel();
    // _data.clear(); // Set all defaults fields
    // this.savePersonalTask(_data);

  }


  savePersonalTask(_data: any) {
    // let idM = this.ID_Meeting;
    // const dialogRef = this.dialog.open(PersonalTaskEditComponent, { data: { _data, idM } });
    // dialogRef.afterClosed().subscribe(res => {
    // 	if (!res) {
    // 		return;
    // 	}
    // 	this.loadData();
    // });

  }



  //ủy quyền tham gia
  stopPropagation(event) {
    event.stopPropagation();
  }

  ItemSelected(event, item) {
    this.user_tam = []
    var dt = {
      idUser: event.idUser
    }
    this.user_tam.push(dt);
    let _item = this.user_tam;
    let _type = 5;
    this.listNguoiThamGia = _item
    let _field = {
      RowID: this.ID_Meeting,
      ListUser: this.listNguoiThamGia,
      Type: _type,
      UserUyQuyen: item.idUser
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
          this.IsXacNhanViecUyQuyen = false;
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
  }

  addRequireSupport() {
    const _data: any = {};
    _data.Id = 0;
    _data.IdM = this.ID_Meeting;
    const dialogRef = this.dialog.open(MeetingSupportAddComponent, {
      data: { _data },
      width: "800px",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      // this.loadData();
    });

  }


  getListRequireSupport() {
    // const _data: any = {};
    // _data.Id = 0;
    // _data.IdM = this.ID_Meeting;
    // const dialogRef = this.dialog.open(MeetingSupportListComponent, { data: { _data }, height: '90vh', width: '90vw' });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (!res) {
    //     return;
    //   }
    //   // this.loadData();
    // });

  }
  viewdetailnotify(item: any) {
    const _data: any = {};
    _data.IdThongBao = item.IdThongBao;
    _data.IdM = this.ID_Meeting;
    _data.IsXem = item.IsXem;
    if (item.IsXem == 0) {
      this.dangKyCuocHopService
        .XemThongBaoCuocHop(item.IdThongBao)
        .subscribe((res: any) => {
          var doc = document.getElementById("item" + item.IdThongBao);
          doc.style.backgroundColor = "";
          this.changeDetectorRefs.detectChanges();
        });
    }
    // const dialogRef = this.dialog.open(CuocHopNotiFyComponent, { data: { _data }, height: '450px', width: '700px' });
    // dialogRef.afterClosed().subscribe(res => {
    // 	this.dangKyCuocHopService.GetListThongBaoByIdCuocHop(this.ID_Meeting, this.record).subscribe(res => {
    // 		if (!res) {
    // 			return;
    // 		}
    // 		this.dataNotify = res.data;
    // 		this.TongSoThongBao = res.data[0].TongSoLuong;
    // 		this.checkcountrow = res.data[0].checksoluong;// neu bang 1 thi co the load them
    // 		this.changeDetectorRefs.detectChanges();
    // 	});
    // });

  }
  filterConfigurationFile(more = 1): any {
    const filter: any = {};
    filter.more = more == 1;
    return filter;
  }
  downFile(path: any) {

    // var params = {
    //   Id: path.Id,
    //   path: path.path

    // }
    this.TaiXuong(path);
    this.dangKyCuocHopService.DownloadFile(path.IdDocument).subscribe(res => {
      if (res && res.status == 1) {
        // if (res.Result.error.message != null) {
        // 	this.layoutUtilsService.showInfo(this.translate.instant(res.Result.error.message));
        // }
        // const linkSource = `data:application/octet-stream;base64,${res.data}`;
        // const downloadLink = document.createElement("a");
        // const fileName = res.data_FileName;
        // downloadLink.href = linkSource;
        // downloadLink.download = fileName;
        // downloadLink.click();
      }

      // var request = new XMLHttpRequest();
      // var link = environment.APIROOT + `/quanlycuochop/DownloadFile?path=${path.Path}&Id=${path.IdDocument}`;
      // request.open("POST", link);
      // // request.setRequestHeader("SysConfig",environment.sys_config);
      // // request.setRequestHeader("Token", this.TokenStorage.getAccessTokenString());
      // request.responseType = "arraybuffer";
      // request.onload = function (e) {
      //   var file;
      //   let name = "";
      //   if (this.status == 200) {
      //   file = new Blob([this.response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      //   name = path.TenFile;
      //   } else {
      //   file = new Blob([this.response], { type: 'text/plain' });
      //   name = "ErrorsLog.txt";		  }
      //   // if (navigator.msSaveBlob) {
      //   // return navigator.msSaveBlob(file);
      //   // }
      //   var df = document.getElementById("downloadFile");
      //   var url = window.URL.createObjectURL(file);
      //   df.setAttribute("href", url);
      //   df.setAttribute("download", name);
      //   df.click();
      //   window.URL.revokeObjectURL(url);
      // }
      // request.send();
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

  getlistViewerDocument(item: any, type = 0) {

    const _data: any = {};
    _data.Id = 0;
    _data.IdM = this.ID_Meeting;
    _data.IdDocument = item.IdDocument;
    const dialogRef = this.dialog.open(UserViewDocumentListComponent, { data: { _data, type }, width: '850px' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
    });

  }
  TaoDuAn(id: any) {
    if (this.TenDuAn == "") {
      this.layoutUtilsService.showActionNotification(
        'Tên danh sách không bỏ trống',
        MessageType.Read,
        9999999999,
        true,
        false,
        3000,
        "top",
        0
      );
      this.changeDetectorRefs.detectChanges()
      return;
    }
    let item = {
      title: this.TenDuAn,
      meetingid: id
    }
    if (this.isLoader) return;
    this.isLoader = true
    this.dangKyCuocHopService.TaoCongViec(item).subscribe(res => {
      if (res && res.status === 1) {
        this.isLoader = false
        this.TenDuAn = ""
        this.layoutUtilsService.showActionNotification(
          "Tạo dự án thành công",
          MessageType.Read,
          4000,
          true,
          false,
          3000,
          "top"
        );
        this.ngOnInit()
        // this.hidden = false;
        this.changeDetectorRefs.detectChanges()
      } else {
        this.isLoader = false
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          "top",
          0
        );
        this.changeDetectorRefs.detectChanges()
      }
    });
  }

  prenventInputNonNumber(item: any) {
    this.btnSend = true
    if (item == "") this.btnSend = false
  }


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
      dataDetailTask: this.dataDetailTask,
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
  openModal(
    title: string,
    message: string,
    yes: Function = null,
    no: Function = null
  ) {
    const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title,
      message: message,
      idMeeting: this.ID_Meeting
    };
    dialogConfig.disableClose = true;
    dialogConfig.width = '40vw';
    let dialogRef;
    dialogRef = this.dialog.open(ThemMoiCongViecVer2Component, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.ngOnInit();
      }
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
          this.IsXacNhanViecUyQuyen = true;
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
          this.IsXacNhanViecUyQuyen = true;
          this.changeDetectorRefs.detectChanges()
        }
      });
    });
  }
  sendNotifyremind(item) {
    let _item = item;
    let listUsser = []
    listUsser.push(_item);
    let _field = {
      RowID: this.ID_Meeting,
      ListUser: listUsser
    };


    this.dangKyCuocHopService.SendNotifyRemind(_field).subscribe(res => {
      //this.disabledBtn = false;
      this.changeDetectorRefs.detectChanges();
      if (res && res.status === 1) {
        this.layoutUtilsService.showInfo('Gửi thông báo nhắc nhở thành công');
      }
      else {
        this.layoutUtilsService.showError(res.error.message);;
      }
    });
  }

  UyQuyenThemTaiLieu(item: any) {
    let _item = this.CuocHop[0].ThanhPhanThemTaiLieu;
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
  chieucao(item) {
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
      return 'example-viewport'
    }
  }
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
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 80;
    return tmp_height + 'px';
  }

  getColor3(condition: number = 0): string {
    switch (condition) {
      case 1:
        return "#0A9562";
      case -2:
        return "#0A9562";
    }
    return "#ff6a00";
  }
  convertDateExpired(d: any, t: number) {
    if (d == null || d == "") return 0
    let now = new Date(new Date().toString());
    let date = new Date(moment(d).add(t, 'minutes').toString());
    let dateAdd = new Date(moment(now).add(t, 'minutes').toString());
    if (date >= now && date <= dateAdd) return 1;
    if (dateAdd > now) return 2;
    return 0
  }

  GroupDept(inputArray) {
    const resultArray = inputArray.reduce((acc, curr) => {
      if (curr.DeptId !== 0 && curr.DepartmentName) {
        const existingDept = acc.find(item => item.DeptId === curr.DeptId);
        if (existingDept) {
          existingDept.listUser.push(curr);
        } else {
          acc.push({ DeptId: curr.DeptId, DepartmentName: curr.DepartmentName, listUser: [curr] });
        }
      }
      return acc;
    }, []);
    return resultArray;
  }
}
