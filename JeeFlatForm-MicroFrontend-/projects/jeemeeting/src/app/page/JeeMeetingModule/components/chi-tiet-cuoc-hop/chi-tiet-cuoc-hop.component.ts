
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DangKyCuocHopService } from '../../_services/dang-ky-cuoc-hop.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tinyMCE_MT } from '../tinyMCE-MT';
import { BehaviorSubject, of, Subject, Subscription } from 'rxjs';
import { catchError, finalize, share, takeUntil, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { JeeChooseMemberComponent } from '../jee-choose-member/jee-choose-member.component';
import { HttpParams } from '@angular/common/http';
import { MeetingStore } from '../../_services/meeting.store';
import { ProjectTeamModel } from '../jeework-components/_model/department-and-project.model';
import { ProjectsTeamService } from '../jeework-components/_services/department-and-project.service';
import { TranslateService } from '@ngx-translate/core';
import { ProjectTeamEditComponent } from '../jeework-components/projects-team/project-team-edit/project-team-edit.component';
import { ProjectTeamEditStatusComponent } from '../jeework-components/projects-team/project-team-edit-status/project-team-edit-status.component';
import { UpdateStatusProjectComponent } from '../jeework-components/projects-team/update-status-project/update-status-project.component';
import { ClosedProjectComponent } from '../jeework-components/projects-team/closed-project/closed-project.component';
import { TaoCuocHopDialogComponent } from '../tao-cuoc-hop-dialog/tao-cuoc-hop-dialog.component';
import { JeeCommentStore } from '../../../JeeCommentModule/jee-comment/jee-comment.store';
import { environment } from 'projects/jeemeeting/src/environments/environment';
import { DepartmentModel } from '../../_models/DuLieuCuocHop.model';
import { LayoutUtilsService, MessageType } from 'projects/jeemeeting/src/modules/crud/utils/layout-utils.service';
import { ThemMoiCongViecVer2Component } from 'projects/jeework/src/app/page/jee-work/MenuWork/them-moi-cong-viec-ver2/them-moi-cong-viec-ver2.component';
import { ThemMoiCongViecKhongVanBanComponent } from 'projects/jeework/src/app/page/jee-work/MenuWork/them-moi-cong-viec-khong-van-ban/them-moi-cong-viec-khong-van-ban.component';

@Component({
	selector: 'app-chi-tiet-cuoc-hop',
	templateUrl: './chi-tiet-cuoc-hop.component.html',
	styleUrls: ['./chi-tiet-cuoc-hop.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChiTietCuocHopComponent implements OnInit {
	dataDetailTask: any;
	NoiDungKetLuan: string;
	NoiDungTomTat: string
	ShowEditorTomTat: boolean = false
	ShowEditorKetLuan: boolean = false
	ShowCongViec: boolean = false
	btnSend: boolean = false
	TenDuAn: string
	isLoader: boolean = false
	CuocHop: any[] = []
	ID_Meeting: number
	tinyMCE = {};
	topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>('');
	labelFilter: string = 'Tất cả';
	tinhTrang: any = '0'
	listNguoiThamGia: any[] = [];
	listNguoiThamGiaRemove: any[] = [];
	sb: Subscription;
	itemw: any;
	hidden: boolean = false
	public readonly componentName = 'comment-jeemeeting';
	private readonly onDestroy = new Subject<void>();
	constructor(private dangKyCuocHopService: DangKyCuocHopService,
		private activatedRoute: ActivatedRoute,
		private layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
		public jeemeetingservice: DangKyCuocHopService,
		private router: Router,
		public dialog: MatDialog,
		private store: JeeCommentStore,
		private storeMT: MeetingStore,
		// public socketioStore: SocketioStore,
		// private socketService: SocketioService,
		public _Services: ProjectsTeamService,
		private translate: TranslateService,
	) { }
	updateReadMenu() {
		let _item = {
			"appCode": "MEETING",
			"mainMenuID": 7,
		}
		// this.socketioStore.updateMain = false;
		// this.socketService.readNotification_menu(_item).subscribe(res => {
		// 	this.socketioStore.updateMain = true;
		// })
	}
	ngOnInit() {
		this.activatedRoute.params.subscribe((params) => {
			this.ID_Meeting = +params.id;
			this.getParamType()
			this.dangKyCuocHopService.Get_ChiTietCuocHop(this.ID_Meeting).subscribe(res => {
				if (res.status == 1) {
					this.CuocHop = res.data;
					this.loadObjectIdComment()
					this._Services.Project_Detail(res.data[0].listid).subscribe((res) => {
						if (res && res.status === 1) {
							this.itemw = res.data;
							this.changeDetectorRefs.detectChanges();
							this.hidden = false
						} else if (res && res.status === 0) {
							this.hidden = true
						}
					});
				} else {
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

				} this.changeDetectorRefs.detectChanges()
			});
		});
		this.getParamType()
		this.tinyMCE = tinyMCE_MT;
		this.sb = this.store.notify$.subscribe((res) => {
			if (res) {
				this.dangKyCuocHopService.sendNotify(res).subscribe(response => {
					this.store.notify = null
				})
			}
		})
		setTimeout(() => {
			this.updateReadMenu();
		}, 10000);
	}
	getParamType() {
		const url = window.location.href;
		let paramValue = undefined;
		if (url.includes('?')) {
			const httpParams = new HttpParams({ fromString: url.split('?')[1] });
			if (httpParams.get('Type') == "0") {
				this.storeMT.data_shareActived = ('0')
			}
			if (httpParams.get('Type') == "1") {
				this.storeMT.data_shareActived = ('1')
			}
			if (httpParams.get('Type') == "2") {
				this.storeMT.data_shareActived = ('2')
			}
		}
	}
	loadObjectIdComment() {
		this.dangKyCuocHopService.getTopicObjectIDByComponentName(this.componentName + `-` + this.ID_Meeting).pipe(
			tap((res) => {
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


	ngOnDestroy(): void {
		this.sb.unsubscribe();
		this.onDestroy.next();
	}
	loadData() {
		this.dangKyCuocHopService.Get_ChiTietCuocHop(this.ID_Meeting).subscribe(res => {
			if (res.data.length > 0) {
				this.CuocHop = res.data;
			} this.changeDetectorRefs.detectChanges()
		});
	}
	prenventInputNonNumber(item: any) {
		this.btnSend = true
		if (item == "") this.btnSend = false
	}
	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight;
		return tmp_height + 'px';
	}

	CheckCongViec(item: any) {
		if (item == null || item == undefined || item == "")
			this.ShowCongViec = false
		this.ShowCongViec = true
		return this.ShowCongViec
	}
	TaoDuAn(id: number) {
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
				this.loadData()
				this.hidden = false;
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
	CustomNamePhongHop(FromTime: any, ToTime: any) {
		let temp = this.f_convertHour(FromTime) + ' - ' + this.f_convertHour(ToTime)
		return temp
	}
	CapNhatTomTat() {
		if (this.NoiDungTomTat == undefined || this.NoiDungTomTat == "") return
		let _item = {
			NoiDung: this.NoiDungTomTat,
			meetingid: this.ID_Meeting,
			type: 1
		}
		this.dangKyCuocHopService.CapNhatTomTatKetLuan(_item).subscribe(res => {
			if (res && res.status === 1) {
				this.isLoader = false
				this.TenDuAn = ""
				this.layoutUtilsService.showActionNotification(
					"Cập nhật thành công",
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
					3000,
					"top",
					0
				);
				this.changeDetectorRefs.detectChanges()
			}
		});
	}
	CapNhatNoiDungKetLuan() {
		if (this.NoiDungKetLuan == undefined || this.NoiDungKetLuan == "") return
		let _item = {
			NoiDung: this.NoiDungKetLuan,
			meetingid: this.ID_Meeting,
			type: 2
		}
		this.dangKyCuocHopService.CapNhatTomTatKetLuan(_item).subscribe(res => {
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
					3000,
					"top",
					0
				);
				this.changeDetectorRefs.detectChanges()
			}
		});
	}
	XacNhanThamGia(type: number) {
		this.dangKyCuocHopService.XacNhanThamGia(this.ID_Meeting, type).subscribe(res => {
			if (res && res.status === 1) {
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

	chinhSuaNoiDungKetLuan(item: any) {
		this.ShowEditorKetLuan = true
		this.NoiDungKetLuan = item
		this.changeDetectorRefs.detectChanges()
	}
	chinhSuaNoiDungTomTat(item: any) {
		this.ShowEditorTomTat = true
		this.NoiDungTomTat = item
		this.changeDetectorRefs.detectChanges()
	}
	DongCuochop() {
		this.dangKyCuocHopService.DongCuocHop(this.ID_Meeting).subscribe(res => {
			if (res && res.status === 1) {
				this.layoutUtilsService.showActionNotification(
					"Đóng cuộc họp thành công",
					MessageType.Read,
					4000,
					true,
					false,
					3000,
					"top"
				);
				this.loadData()
				this.changeDetectorRefs.detectChanges()
				this.storeMT.data_shareLoad = (res)
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
	XoaCuocHop() {
		const _title = "Xác nhận";
		const _description =
			"Bạn có muốn thực hiện chức năng này?";
		const _waitDesciption = "Đang thực hiện";
		const dialogRef2 = this.layoutUtilsService.deleteElement(
			_title,
			_description,
			_waitDesciption,
			"",
			false
		);
		dialogRef2.afterClosed().subscribe((res) => {
			if (res) {
				this.dangKyCuocHopService.XoaCuocHop(this.ID_Meeting).subscribe(res => {
					if (res && res.status === 1) {
						this.layoutUtilsService.showActionNotification(
							"Xóa cuộc họp thành công",
							MessageType.Read,
							4000,
							true,
							false,
							3000,
							"top"
						);
						this.router.navigate(['/Meeting/']);
						this.storeMT.data_shareLoad = ('load')
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
		});
	}
	chinhsua() {
		//this.router.navigate(['/Meeting/edit/',`${this.ID_Meeting}`]);
		this.dangKyCuocHopService.Get_ChiTietCuocHopEdit(this.ID_Meeting).subscribe((res) => {
			if (res.status == 1) {
				const dialogRef = this.dialog.open(TaoCuocHopDialogComponent, {
					disableClose: true,
					panelClass: 'no-padding', data: { _item: res.data, listThamGia: [] }, width: '40%'
				});
				dialogRef.afterClosed().subscribe(res => {
					if (!res) {
						this.ngOnInit()
					}
				})
			}
		})
	}
	ThamGiaPhongZoom(item, type) {
		if (type == 2) {
			//nếu bằng 2 mở app desktop zoom
			if (item.isHost == true) {
				// nếu isHost = true sẽ gọi api update display name
				this.dangKyCuocHopService.StartZoom(this.ID_Meeting).subscribe((res: any) => {
					if (res == false) {
						const _description =
							"Có Lỗi gì đó xảy ra!";
						this.layoutUtilsService.showActionNotification(_description, MessageType.Read, 999999999,
							true,
							false,
							3000,
							"top",
							0);
						return;
					} else {
						window.open(`https://zoom.us/s/${item.IdZoom}?zak=${item.TokenZak}`, '_blank');

					}
				});
			} else {
				//nếu isHost = false sẽ join bằng role bình thường
				window.open(`zoommtg://zoom.us/join?confno=${item.IdZoom}&pwd=${item.PwdZoom}&zc=0&browser=${this.getBrowserName()}&uname=${item.HoTen}`);
			}
		}
		if (type == 1) {
			//nếu bằng 1 mở sdk zoom
			window.open(environment.HOST_JEEMEETING + '/zoom/' + this.ID_Meeting, '_blank');
			// this.dialogRef.close();
		}
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

	ThamGiaPhongGoogle(url: any) {
		window.open(url, '_blank');
	}

	convertDate(d: any) {
		return moment(d + 'z').format("DD/MM/YYYY hh:mm");
	}

	convertDate_TaiSan(d: any) {
		return moment(d + 'z').format("hh:mm DD/MM/YYYY");
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
	copy(inputElement) {
		inputElement.select();
		document.execCommand('copy');
		inputElement.setSelectionRange(0, 0);
	}

	QuayVe() {
		this.router.navigate(['/Meeting/']);
		this.storeMT.data_shareLoad = ('load')

	}

	taoMoiCuocHop() {
		this.router.navigate(['/Meeting/create/', 0]);
		this.storeMT.data_shareLoad = ('load')
	}
	activeTabId:
		| 'kt1'
		| 'kt2'
		| 'kt3'
		| 'kt4' = 'kt1';
	setActiveTabId(tabId, type) {
		this.activeTabId = tabId;
	}
	getActiveCSSClasses(tabId) {
		if (tabId !== this.activeTabId) {
			return '';
		}
		return 'soluong-active active show chieucao';
	}

	getActiveCSSClasses2(tabId) {
		if (tabId !== this.activeTabId) {
			return '';
		}
		return 'active show chieucao';
	}

	getColor2(condition: number = 0, xacnhan: any): string {
		if (!xacnhan) return "#0A9562";
		switch (condition) {
			case 1:
				return "#0A9562";
			case 2:
				return "#DC3545";
		}
		return "#F48120";
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

	getWidth() {
		let tmp_width = 0;
		tmp_width = window.innerWidth - 770;
		return tmp_width + 'px';
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
	AddThanhVien(item: any, Type: number = 1) {
		let _item = item;
		let _type = 2;
		const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item, _type }, width: '40%' });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.listNguoiThamGia = res.data
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
							MessageType.Read,
							9999999999,
							true,
							false,
							3000,
							"top",
							0
						);
					}
				});
		});
	}

	RemoveThanhVien(item: any, Type: number = 1) {
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
						false
					);
					this.listNguoiThamGiaRemove = []
					this.loadData()
					this.changeDetectorRefs.detectChanges()
				} else {
					this.changeDetectorRefs.detectChanges();
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
					this.listNguoiThamGiaRemove = []
				}
			});
	}
	RoiCuocHop() {

	}


	AddProject(is_project: boolean) {
		const _project = new ProjectTeamModel();
		_project.clear(); // Set all defaults fields
		_project.is_project = is_project;
		this.UpdateProject(_project, is_project);
	}

	UpdateProject(_item: ProjectTeamModel, is_project: boolean) {
		_item = this.itemw;
		let saveMessageTranslateParam = '';
		saveMessageTranslateParam +=
			_item.id_row > 0
				? 'GeneralKey.capnhatthanhcong'
				: 'GeneralKey.themthanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType =
			_item.id_row > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(ProjectTeamEditComponent, {
			disableClose: true,
			panelClass: 'no-padding', data: { _item, _IsEdit: _item.IsEdit, is_project: _item.is_project },
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			} else {
				this.ngOnInit();
				this.layoutUtilsService.showActionNotification(
					_saveMessage,
					_messageType,
					4000,
					true,
					false
				);
				// this.changeDetectorRefs.detectChanges();
			}
		});
	}
	UpdateStatus() {
		const dialogRef = this.dialog.open(ProjectTeamEditStatusComponent, {

			disableClose: true,
			panelClass: 'no-padding', data: this.itemw,
			minWidth: '800px',
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			} else {
				this.ngOnInit();
			}
		});
		this.changeDetectorRefs.detectChanges();
	}

	//updateStage(_item: ProjectTeamModel) {
	updateStage(_item: any) {
		// // this.layoutUtilsService.showActionNotification("Updating");
		let saveMessageTranslateParam = '';
		_item = this.itemw;
		saveMessageTranslateParam +=
			_item.id_row > 0
				? 'GeneralKey.capnhatthanhcong'
				: 'GeneralKey.themthanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType =
			_item.id_row > 0 ? MessageType.Update : MessageType.Create;

		const dialogRef = this.dialog.open(UpdateStatusProjectComponent, {
			disableClose: true,
			panelClass: 'no-padding', data: { _item, _IsEdit: _item.IsEdit },
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			} else {
				this.ngOnInit();
				this.layoutUtilsService.showActionNotification(
					_saveMessage,
					_messageType,
					4000,
					true,
					false
				);
				// this.changeDetectorRefs.detectChanges();
			}
		});
	}

	ClosedProject() {
		const model = new ProjectTeamModel();
		model.clear(); // Set all defaults fields
		this.Update_ClosedProject(model);
	}

	Update_ClosedProject(_item: ProjectTeamModel) {
		let saveMessageTranslateParam = '';
		_item = this.itemw;
		saveMessageTranslateParam +=
			_item.id_row > 0
				? 'GeneralKey.capnhatthanhcong'
				: 'GeneralKey.themthanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType =
			_item.id_row > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(ClosedProjectComponent, {
			disableClose: true,
			panelClass: 'no-padding', data: { _item },
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				// this.router.navigateByUrl("/project/"+this.ID_Project).then(()=>{
				this.ngOnInit();
				// });
			} else {
				this.layoutUtilsService.showActionNotification(
					_saveMessage,
					_messageType,
					4000,
					true,
					false
				);
				this.ngOnInit();
			}
		});
	}


	Deleted() {
		const ObjectModels = new DepartmentModel();
		ObjectModels.clear();
		this.Delete(ObjectModels);
	}

	Delete(_item: DepartmentModel) {
		_item.RowID = this.CuocHop[0].listid;
		const _title = this.translate.instant('GeneralKey.xoa');
		const _description = this.translate.instant('projects.confirmxoa');
		const _waitDesciption = this.translate.instant(
			'GeneralKey.dulieudangduocxoa'
		);
		const _deleteMessage = this.translate.instant('GeneralKey.xoathanhcong');
		const dialogRef = this.layoutUtilsService.deleteElement(
			_title,
			_description,
			_waitDesciption
		);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			this._Services.DeleteProject(_item.RowID).subscribe((res) => {
				if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(
						_deleteMessage,
						MessageType.Delete,
						4000,
						true,
						false,
						3000,
						'top',
						1
					);
					this.ngOnInit()
				} else {
					this.layoutUtilsService.showActionNotification(
						res.error.message,
						MessageType.Read,
						9999999999,
						true,
						false,
						3000,
						'top',
						0
					);
					this.ngOnInit();
				}
			});
			this.dangKyCuocHopService.XoaCongViec(_item.RowID).subscribe(res => {
			});
		});
	}


	//=-----------------------------------jeework v2
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

		item = ThemMoiCongViecKhongVanBanComponent;
		const dialogRef = this.dialog.open(item, dialogConfig);

		dialogRef.afterClosed().subscribe((result) => {
			if (result != undefined) {
				this.ngOnInit();
			}
		});
	}
}
