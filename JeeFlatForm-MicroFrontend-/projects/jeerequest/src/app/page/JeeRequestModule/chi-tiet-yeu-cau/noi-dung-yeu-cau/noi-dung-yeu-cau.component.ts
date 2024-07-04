import { find } from 'lodash';

// Angular
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef, ViewRef, AfterViewInit, ViewChild } from '@angular/core';
	import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Params, Router } from '@angular/router';
// RxJS
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { PreviewFileImageYeuCauComponent } from '../../components/preview-file-image/preview-file-image.component';
import { TaoYeuCauDialogComponent } from '../../components/tao-yeu-cau/tao-yeu-cau.component';
import { TranslateService } from '@ngx-translate/core';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { YeuCauService } from "../../_services/yeu-cau.services";
import { catchError, filter, finalize, share, takeUntil, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { KTUtil } from '../../../../../assets/js/components/util';
import KTLayoutAsideMenu from '../../../../../assets/js/layout/base/aside-menu';
import { LayoutUtilsService, MessageType } from 'projects/jeerequest/src/modules/crud/utils/layout-utils.service';
import { JeeCommentStore } from '../../../JeeCommentModule/jee-comment/jee-comment.store';
@Component({
	selector: 'chi-tiet-noi-dung-yeu-cau',
	templateUrl: './noi-dung-yeu-cau.component.html',
	styleUrls: ["./noi-dung-yeu-cau.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoiDungYeuCauComponent implements OnInit, AfterViewInit {

  datawv2: any[]
  datawv1: any[]

	items: GalleryItem[];
	dataIMG : any[] = [];
    selectedTab: number = 0;
	asideMenuCSSClasses: string;
	asideMenuDropdown;
	asideMenuScroll = 1;
	ulCSSClasses: any;
	menuConfig:any = []
	status_dynamic: any[] = [];
	dataJeewofkflow: any[] = [];
	detailProcess:any[] = [];
    listStatus = [
		{Title:'Tất cả'},
		{Title:'Đã duyệt'},
		{Title:'Chờ duyệt'},
		{Title:'Không duyệt'},
		{Title:'Quá hạn'},
		{Title:'Đã đánh dấu'}];
	IDRow :any
	NodeID:number
	dataYeuCau:any[] = [];
	Values: any[] = [];
	Data_SaoChep_Update:any
	dataa: any;
	dataavl: any;
	datatuchoi:any
	choRender:Boolean = false
	trangthaitoiluot:any = []
	GuiHoacDuyet:string;
	anDuyet:Boolean = false
	dem:number = 0
	paramsSubscription : Subscription;
	obsCombined:any
	topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  @ViewChild('menuTrigger') trigger;
  options: any = {};
	private readonly componentName = 'comment-jeerequest';
	private readonly onDestroy = new Subject<void>();
	constructor(public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private activatedRoute: ActivatedRoute,
		private changeDetectorRefs: ChangeDetectorRef,
		public requestsService: YeuCauService,
		private router: Router,
		private translate: TranslateService,
		public gallery: Gallery,
		private store: JeeCommentStore) {
	}
	ngOnInit() {
		this.IDRow = this.activatedRoute.snapshot.paramMap.get('id');
		this.NodeID = this.getParams()
			this.loadThongTin(this.IDRow,this.NodeID);
			this.requestsService.getTopicObjectIDByComponentName(this.componentName +`-`+this.IDRow ).pipe(
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

	this.paramsSubscription = this.router.events.pipe(
			filter(ev => ev instanceof NavigationEnd))
			.subscribe((ev:NavigationEnd) => {
				if(this.checkParamType()){
					var nextParams = this.collectParams(this.router.routerState.snapshot.root)
					this.IDRow  = nextParams.id;
					this.NodeID = this.getParams()
					this.loadThongTin(this.IDRow,this.NodeID);
					this.requestsService.getTopicObjectIDByComponentName(this.componentName +`-`+this.IDRow ).pipe(
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
			})
		this.getParamType();
		this.activatedRoute.data.subscribe((v) => {
			this.GuiHoacDuyet = v.data;
			if(v.data == "gui"){
				this.anDuyet = true
			}
		});

		this.store.notifyrequest$.subscribe((res) => {
			if(res){
				this.requestsService.sendNotify(res).subscribe(response =>{
					this.store.notify = null
				})
			}
		})
	}
	private collectParams( root: ActivatedRouteSnapshot ) : Params {
		var params: Params = {};
		(function mergeParamsFromSnapshot( snapshot: ActivatedRouteSnapshot ) {
			Object.assign( params, snapshot.params );
			snapshot.children.forEach( mergeParamsFromSnapshot );
		})( root );
		return( params );
	}

	 getParams() {
		const url = window.location.href;
		let paramValue = undefined;
		if (url.includes('?')) {
		  const httpParams = new HttpParams({ fromString: url.split('?')[1] });
		  paramValue = httpParams.get('Node');
		}
		return paramValue;
	  }

	  getParamType() {

		const url = window.location.href;
		let paramValue = undefined;
		if (url.includes('?')) {
		  const httpParams = new HttpParams({ fromString: url.split('?')[1] });
		 	if(httpParams.get('Type') == "Gui"){
				this.anDuyet = true
				this.GuiHoacDuyet = 'gui'
				this.requestsService.data_shareActived$.next('Gui')
			}
			if(httpParams.get('Type') == "Duyet"){
				this.anDuyet = false
				this.GuiHoacDuyet = 'duyet'
				this.requestsService.data_shareActived$.next('Duyet')
			}
		}
	  }


	  checkParamType() {
		const url = window.location.href;
		let paramValue = undefined;
		if (url.includes('?')) {
		  const httpParams = new HttpParams({ fromString: url.split('?')[1] });
		 	if(httpParams.get('Type') == "Gui"){
				return true;
			}else
			if(httpParams.get('Type') == "Duyet"){
				return true;
			}else{
				return false;
			}
		}
	  }
	  LoadLienKet(ids:any){

      this.datawv1 = []
      ids.split(',').forEach((id) => {
        this.requestsService.GetChiTietCongViec(
          id
        ).subscribe((data) => {
          let parentMenu = {
            title: '' + data.data.title,
            id: '' + id,
            nguoigiao: data.data.createdby,
            createddate :data.data.createddate,
            deadline: data.data.deadline,
            department:data.data.department,
            Process:data.data.Process,
            status: data.data.status,
            Users:data.data.Users[0],
            Tags:data.data.Tags,
            project_team:data.data.project_team,
            start_date:data.data.start_date,
            submenu: [],
          };
          this.datawv1.push(parentMenu)
          this.changeDetectorRefs.detectChanges();


          this.requestsService
      .ListStatusDynamic(data.data.id_project_team)
      .subscribe((res) => {
        if (res && res.status === 1) {
          if(data.status == 1 && data.data){
            this.datawv1.forEach(element => {
              element.status = res.data.find(r => r.id_row == element.status)
            });
          this.changeDetectorRefs.detectChanges();
          }
        }
      });
          }
          )
      })

	}


  LoadLienKetV2(ids:string){

    this.datawv2 = []
    ids.split(',').forEach((id) => {
      this.requestsService.GetChiTietCongViecV2(
        id
      ).subscribe((data) => {
        if(data.status == 1 && data.data.length > 0 ){
          // this.fs_Assign(data.data,id)
          let parentMenu = {
            title: '' + data.data[0].title,
            id: '' + id,
            nguoigiao: data.data[0].createdby,
            createddate :data.data[0].createddate,
            deadline: data.data[0].deadline,
            department:data.data[0].department,
            Process:data.data[0].Process,
            status:data.data[0].StatusInfo.find(r => r.id_row == data.data[0].status),
            Users:data.data[0].Users,
            Tags:data.data[0].Tags,
            project_team:data.data[0].project_team,
            start_date:data.data[0].start_date,
            submenu: [],
          };
          this.datawv2.push(parentMenu)
          this.changeDetectorRefs.detectChanges();
        }})
    })


	}

	LoadLienKetflow(id:any){
		this.requestsService.GetChiTietNhiemVu(
			id
		).subscribe((data) => {
			if(data.status == 1){
				 this.detailProcess = data.data
			}})
	}
	async fs_Assign(data:any,id:any) {
		let config = {
			aside: {
				items: []
			}
		};
		this.requestsService
      .ListStatusDynamic(data.id_project_team)
      .subscribe((res) => {
        if (res && res.status === 1) {
          this.status_dynamic = res.data;
          this.changeDetectorRefs.detectChanges();
        }
      });
		let parentMenu = {
			title: '' + data.title,
			id: '' + id,
			nguoigiao: data.createdby,
			createddate :data.createddate,
			deadline: data.deadline,
			department:data.department,
			Process:data.Process,
			status:data.status,
			Users:data.Users,
			Tags:data.Tags,
			start_date:data.start_date,
			submenu: [],
		  };
		  await data.Childs.forEach(async (itemE, indexE) => {
            let child = {
              title: '' + itemE.title,
              id: '' + itemE.id_row,
			  createdby:itemE.createdby,
			  nguoigiao:itemE.createdby,
			  createddate:itemE.createddate,
			  deadline :itemE.deadline,
			  status:itemE.status,
			  size:data.Childs.length,
			  index:indexE,
			  start_date:itemE.start_date,
			  Users:itemE.Users,
			  Tags:itemE.Tags,
            };
            parentMenu["submenu"].push(child);
          });
		  config.aside.items.push(parentMenu);
		this.menuConfig = config.aside;
			setTimeout(() => {
			KTUtil.ready(() => {
				KTLayoutAsideMenu.init('kt_aside_menuChiTiet' + this.IDRow);
		});
		}, 1000);
	}
	ngAfterViewInit() {

	  }
	ngOnDestroy(){
		this.paramsSubscription.unsubscribe();
	}

	updateTinhTrang(tinhtrang: number) {
		if (tinhtrang == 1) {
			return true;
		} else if (tinhtrang == 2) {
			return true;
		} else return false;
	}
	loadThongTin(id:number,nodeID:number){
		this.getParamType();
		this.dem = 0
		this.dataIMG = []
		// this.layoutUtilsService.showWaitingDiv()
		this.requestsService.getDSChiTietYeuCau(
			id,nodeID
		).subscribe((data) => {
			if(data.status == 1){
				this.dataYeuCau = data.data;
				this.LoadLienKet(data.data[0].ID_Jeework);
				this.LoadLienKetflow(data.data[0].ID_Jeeworkflow);
        this.LoadLienKetV2(data.data[0].ID_JeeworkV2);
				this.Values = [];
				for (var j = 0;j < data.data[0].Value.length;j++) {
					let str: string = data.data[0].Value[j].Value;
					let control = data.data[0].Value[j].ControlID;
					if (
						control == 10 ||
						control == 12 ||
						control == 13 ||
						control == 14
					) {
						this.dataa = JSON.parse(str);
						if(this.dataa.length > 0){
							for (let index = 0; index < this.dataa.length; index++) {
								if(this.CheckType(this.dataa[index].type) == "image"){
									let dulieuimage = {
										srcUrl: this.dataa[index].src,
										previewUrl: this.dataa[index].src
									}
									this.dataa[index].index = this.dem
									this.dem++
									this.dataIMG.push(dulieuimage)
									this.changeDetectorRefs.detectChanges();
								}
							}
						}
					} else {
						this.dataa = data.data[0].Value[j].Value
					}
					let dulieutam = {
						Title: data.data[0].Value[j].Title,
						ControlID: data.data[0].Value[j].ControlID,
						Value: this.dataa
					};
					this.Values.push(dulieutam);
				}
				this.items = this.dataIMG.map(item =>
					new ImageItem({ src: item.srcUrl, thumb: item.previewUrl })
				  );
				this.basicLightboxExample();
				this.withCustomGalleryConfig();
				this.changeDetectorRefs.detectChanges();
				// this.layoutUtilsService.OffWaitingDiv()
			}else if( data.status == -1){
				// this.layoutUtilsService.OffWaitingDiv()
				this.layoutUtilsService.showActionNotification(data.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top');
				this.router.navigate(['/Request/']);
				return false;
			}else{
				this.layoutUtilsService.showActionNotification(data.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top',0);
			}
			// this.layoutUtilsService.OffWaitingDiv()
			this.changeDetectorRefs.detectChanges();
		});
		this.requestsService.getValueSaoChepHoacChinhSua(
			id
		).subscribe((val) => {
			if(val.status == 1){
				let Files = []
				this.Data_SaoChep_Update = []
				for (var j = 0;j < val.data.length;j++) {
					let str: string = val.data[j].Value;
					let control = val.data[j].ControlID;
					if (
						control == 10 ||
						control == 12 ||
						control == 13 ||
						control == 14 ||
						control == 6
					) {
						this.dataa = JSON.parse(str);
					}
					let dulieutam = {
						Title: val.data[j].Title,
						Value: val.data[j].Value,
						ControlID: val.data[j].ControlID,
						RowID :val.data[j].RowID,
						Files:[],
						Description:val.data[j].Description,
						IsRequired:val.data[j].IsRequired,
						APIData:val.data[j].APIData,
					};
					if (
						control == 10 ||
						control == 12 ||
						control == 13 ||
						control == 14 ||
						control == 6
					) {
						if(this.dataa.length > 0){
							for (let index = 0; index < this.dataa.length; index++) {
								dulieutam.Files.push(this.dataa[index])
							}
						}
					}
				this.Data_SaoChep_Update.push(dulieutam);
			}
		}
		})
	}

	getColor2(condition: number = 0): string {
		switch (condition) {
			case 1:
				return "#0A9562";
			case 2:
				return "#DC3545";
			case -1:
				return 'Gray';
		}
		return "#F48120";
	}
	getItemString(condition: number = 0): string {
		switch (condition) {
			case 1:
				return this.translate.instant('Yeucau.daduyet');
			case 2:
				return this.translate.instant('Yeucau.khongduyet');
			case -1:
				return 'Bị Hủy';
		}
		return this.translate.instant('Yeucau.choduyet');
	}

	//loại bằng 1 là nhân bản yêu cầu
	NhanBanYeuCau(item:any) {
		const dialogRef = this.dialog.open(TaoYeuCauDialogComponent, {disableClose: true,data: {_Id_QuyTrinh:item.ID_QuyTrinh,_Id_LoaiYeuCau: item.Id_LoaiYeuCau,_tenLoai:item.TenLoaiYeuCau,_MoTa:item.MoTa,_Loai:1,_dataControl:this.Data_SaoChep_Update,_TenYeuCau:item.TenYeuCau,_MoTaLoaiYeuCau:item.MoTaLoaiYeuCau},width:"700px",position: {top: '60px'},panelClass:'no-padding'
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				// this.ngOnInit()
			} else {
				this.ngOnInit()
				this.requestsService.data_shareLoad$.next(res)
			}
		});
	}
	//loại bằng 2 là chỉnh sửa yêu cầu
	ChinhSuaYeuCau(item:any) {
		const dialogRef = this.dialog.open(TaoYeuCauDialogComponent, {disableClose: true,data: {_Id_QuyTrinh:item.ID_QuyTrinh,_Id_LoaiYeuCau: item.Id_LoaiYeuCau,_tenLoai:item.TenLoaiYeuCau,_MoTa:item.MoTa,_Loai:2,_dataControl:this.Data_SaoChep_Update,_TenYeuCau:item.TenYeuCau,_id_YeuCau:this.IDRow,_MoTaLoaiYeuCau:item.MoTa},width:"700px",position: {top: '60px'},panelClass:'no-padding'
		});

		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				// this.ngOnInit()
			} else {
				this.ngOnInit()
				this.requestsService.data_shareLoad$.next(res)
			}
		});
	}
	DanhDauYeuCau(idDanhDau: number, idyeucau: number){
		if(this.anDuyet){
			this.requestsService.DanhDauYeuCauGui(
				idDanhDau,
				idyeucau
			).subscribe((res) => {
				if (!res) {
				} else {
					this.requestsService.data_shareGui$.next(res)
					this.LoadDataSauKhiDanhDau()

				}
			});
		}else{
			this.requestsService.DanhDauYeuCauDuyet(
				idDanhDau,
				idyeucau
			).subscribe((res) => {
				if (!res) {
				} else {
					this.requestsService.data_shareDuyet$.next(res)
					this.LoadDataSauKhiDanhDau()

				}
			});
		}
	}
	LoadDataSauKhiDanhDau(){
		this.requestsService.getDSChiTietYeuCau(
			this.IDRow,this.NodeID
		).subscribe((data) => {

			if(data.status == 1){
				this.dataYeuCau = data.data;
			}else if( data.status == -1){

				this.layoutUtilsService.showActionNotification(data.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top');
				this.router.navigate(['/']);
				return false;
			}
			if (
				this.changeDetectorRefs &&
				!(this.changeDetectorRefs as ViewRef).destroyed
			) {
				this.changeDetectorRefs.detectChanges();
			}
		});
	}
	InYeuCau(item:any){
		this.router.navigate(['/print/print-yeu-cau',this.IDRow],{state: {data:item}});
	}
	print(){
		// let printContents, popupWin;
		// printContents = document.getElementById('print-section').innerHTML;
		// popupWin = window.open("", "_blank", "top=0,left=0,height=100%,width=auto");
   		// popupWin.document.open();
    	// popupWin.document.write(`
    	// <body onload="window.print();window.close()">${printContents}</body>
       	// `);
    	// popupWin.document.close();


	}
	XoaYeuCau(item:any){
		const _title ="Xóa";
		const _description = "Bạn có chắc chắn muốn xóa";
		const _waitDesciption = "Dữ liệu đang được xóa";
		const _deleteMessage = "Xóa thành công";

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.requestsService.XoaYeuCua(this.IDRow).subscribe((res) => {
				if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top');
					if(this.GuiHoacDuyet == "gui"){
						this.router.navigate(['/Request/']);
					}
					if(this.GuiHoacDuyet == "duyet"){
						this.router.navigate(['/Request/']);
					}
					this.requestsService.data_shareLoad$.next(res)
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top',0);
				}
			});
		});
	}

	PheDuyet(item: number, ResultID:number,NodeID:number,ResultText:string) {
		const _title ="Thông báo";
		const _description = "Bạn có muốn thực hiện chức năng này?";
		const _waitDesciption = "Đang thực hiện";
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}else{
				if(ResultID==1){
					this.requestsService.PheDuyetYeuCau(item, ResultID,NodeID,ResultText).subscribe(
						(res) => {
							if (res && res.status === 1) {
								this.layoutUtilsService.showActionNotification("Đã duyệt thành công", MessageType.Delete, 4000, true, false, 3000, 'top');
								this.ngOnInit()
								this.requestsService.data_shareLoad$.next(res)
							} else {
								this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top',0);
							}
						}
					);
				}else if(ResultID==2){
					this.requestsService.PheDuyetYeuCau(item, ResultID,NodeID,ResultText).subscribe(
						(res) => {
							if (res && res.status === 1) {
								this.layoutUtilsService.showActionNotification("Đã từ chối thành công", MessageType.Delete, 4000, true, false, 3000, 'top');
								this.ngOnInit()
								this.requestsService.data_shareLoad$.next(res)
							} else {
								this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top',0);
							}
						}
					);
				}else{
					this.requestsService.PheDuyetYeuCau(item, ResultID,NodeID,ResultText).subscribe(
						(res) => {
							if (res && res.status === 1) {
								this.layoutUtilsService.showActionNotification("Đã duyệt thành công", MessageType.Delete, 4000, true, false, 3000, 'top');
								this.ngOnInit()
								this.requestsService.data_shareLoad$.next(res)
							} else {
								this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top',0);
							}
						}
					);
				}
			}
		});
	}
	Preview(_item: any) {
		const dialogRef = this.dialog.open(PreviewFileImageYeuCauComponent, {
			data: { _item },
			height: "535px",
			width:	"70%",
			 panelClass: "no-padding",
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
			} else {
				this.ngOnInit()
			}
		});
	}
	f_convertDateTime(date: string) {
		var componentsDateTime = date.split("/");
		var date = componentsDateTime[0];
		var month = componentsDateTime[1];
		var year = componentsDateTime[2];
		var formatConvert = year + "-" + month + "-" + date + "T00:00:00.0000000";
		return new Date(formatConvert);
	}
	f_convertDate(p_Val: any) {
		let a = p_Val === "" ? new Date() : new Date(p_Val);
		return a.getFullYear() + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + ("0" + (a.getDate())).slice(-2);
	}
	getFormatDate(v: string = '') {
		if (v != '' && v != null) {
			return v.includes('T') ? v.replace(/(\d{4})(-)(\d{2})(-)(\d{2})(T)(\d{2})(:)(\d{2})(:)(\d{2}).*$/g, "$5/$3/$1") : v.replace(/(\d{4})(-)(\d{2})(-)(\d{2})/g, "$5/$3/$1");
		}
		return '';
	}
	CheckType(type:string){
	var t = type.split("/", 1);
	return t[0];
	}


	basicLightboxExample() {
		this.gallery.ref().load(this.items);
	  }
	withCustomGalleryConfig() {

		// 2. Get a lightbox gallery ref
		const lightboxGalleryRef = this.gallery.ref('anotherLightbox');

		// (Optional) Set custom gallery config to this lightbox
		lightboxGalleryRef.setConfig({
		  imageSize: ImageSize.Cover,
		  thumbPosition: ThumbnailsPosition.Top
		});

		// 3. Load the items into the lightbox
		lightboxGalleryRef.load(this.items);
	  }

	  //----------Hàm kiểm tra input------------------
f_number(value: any) {
	return Number((value + '').replace(/,/g, ""));
}

f_currency(value: any, args?: any): any {
	let nbr = Number((value + '').replace(/,|-/g, ""));
	return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

textPres(e: any, vi: any) {
	if (isNaN(e.key)
		&& e.keyCode != 32 // space
		&& e.keyCode != 189
		&& e.keyCode != 45
	) {// -
		e.preventDefault();
	}
}
text(e: any, vi: any) {
	if (!((e.keyCode > 95 && e.keyCode < 106)
		|| (e.keyCode > 45 && e.keyCode < 58)
		|| e.keyCode == 8)) {
		e.preventDefault();
	}
}
textNam(e: any, vi: any) {
	if (!((e.keyCode > 95 && e.keyCode < 106)
		|| (e.keyCode > 47 && e.keyCode < 58)
		|| e.keyCode == 8)) {
		e.preventDefault();
	}
}
getHeight(): any {
	let tmp_height = 0;
	tmp_height = window.innerHeight;
	return tmp_height + 'px';
	}
	convertDate(d:any){
		if(d == null|| d == "") return ""
		return moment(d + 'z').format("DD/MM/YYYY hh:mm");
	   }
	   convertDate2(d:any){
		if(d == null || d == "") return ""
		return moment(d + 'z').format("DD/MM/YYYY");
	   }
	   bindStatus(val) {
		const stt = this.status_dynamic.find((x) => +x.id_row == +val);
		if (stt) {
		  return stt.statusname;
		}
		return "";
	  }
	  getColorStatus(val) {
		const index = this.status_dynamic.find((x) => x.id_row == val);
		if (index) {
		  return index.color;
		} else {
		  return "gray";
		}
	  }
	  Opaciti_color(color){
		if(!color){
		  color = 'rgb(0,0,0)';
		}
		var result = color.replace(')',', 0.2)').replace('rgb','rgba');
		if(result == "#848E9E"){
			return "rgb(190 211 245)"
		}
		return result;
	  }

	  //jeeworkflow
	  getItemStatusString(status: number): string {
		switch (status) {
			case 0:
				return 'Đang tạm dừng';
			case 1:
				return 'Đang thực hiện';
			case 2:
				return 'Hoàn thành';
		}
		return 'Chưa thực hiện';
	}
	  DrawPie(point: number, item: any) {
		if (item.IsQuaHan) {
			return 'conic-gradient(#CC4444 ' + point + '%, #d1cbcb 0)';
		} else {
			if (item.Status == 1) {
				return 'conic-gradient(#5867dd ' + point + '%, #d1cbcb 0)';
			} else if (item.Status == 2) {
				return 'conic-gradient(#9acd32 ' + point + '%, #d1cbcb 0)';
			} else if (item.Status == 0) {
				return 'conic-gradient(#ff0000 ' + point + '%, #d1cbcb 0)';
			} else {
				return 'conic-gradient(#ffb822 ' + point + '%, #d1cbcb 0)';
			}
		}
	}




	convertTimeCreated(d:any){
		const cd = this.convertDateUTC(d);
		return this.convertHour(cd) + " " + this.LayThu(cd) + ", " + this.convertDayMonth(cd);
	}

	convertTimeExpired(d:any, t:number){
		const cd = this.convertDateUTCExpired(d, t);
		return this.convertHour(cd) + " " + this.LayThu(cd) + ", " + this.convertDayMonth(cd);
	}

	convertDateUTCExpired(d:any, t:number){
		if(d == null|| d == "") return ""
		return moment(d + 'z').add(t, 'hours');
	}


	convertDateUTC(d:any){
		if(d == null|| d == "") return ""
		return moment(d + 'z');
	}

	convertHour(v: any) {
		if (v != "" && v != null) {
		  let a = new Date(v);
		  return (
			("0" + a.getHours()).slice(-2) + ":" + ("0" + a.getMinutes()).slice(-2)
		  );
		}
	}

	convertDayMonth(v: any) {
		if (v != "" && v != null) {
		  let a = new Date(v);
		  return (
			("0" + (a.getDate())).slice(-2) + " Tháng " +  ("0" + (a.getMonth() + 1)).slice(-2)
		  );
		}
	}

	LayThu(v:any){
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

	TaiXuong(item) {
		let obj = item.filename.split(".")[item.filename.split(".").length - 1];
		if (obj == "jpg" || obj == "png" || obj == "jpeg" || obj == "pdf" || obj == "xls" || obj == "xlsx" || obj == "doc" || obj == "docx") {
			const splitUrl = item.src.split("/");
			const filename = splitUrl[splitUrl.length - 1];
			fetch(item.src)
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
					console.log(err);
				});
		} else {
			window.open(item.src);
		}
	}
	getWidth(){
		let tmp_width = 0;
		tmp_width = window.innerWidth - 770;
		return tmp_width + 'px';
	  }

	  ViewDetai(id:any) {
      this.router.navigate([
        '',
        { outlets: { auxNameV1: 'auxWorkV1/detailWork/' + id } },
      ]);


	  }

    ViewDetaiGov(id:any) {
      this.router.navigate([
        '',
        { outlets: { auxName: 'auxWork/DetailsGOV/' + id } },
      ]);

	  }
	  deleteEV(event) {
		event.stopPropagation();
		return false;
	  }

    stopPropagation(event) {
      event.stopPropagation();
    }


    ItemSelected(event, item) {
      this.trigger.closeMenu();
      let _field = {
        RowID: this.IDRow,
        UserUyQuyen: event.idUser,
        HoTen: event.HoTen
      };
      this.requestsService
        .chuyen_tiep_yeu_cau(_field)
        .subscribe((res: any) => {
          if (res && res.status === 1) {
            this.router.navigate(['/Request/']);
			this.requestsService.data_shareLoad$.next(res)
            this.layoutUtilsService.showActionNotification(
              "Chuyển tiếp thành công",
              MessageType.Read,
              4000,
              true,
              false
            );
            this.changeDetectorRefs.detectChanges()
          } else {
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Read,
              4000,
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
}
function getDeepestChildSnapshot(snapshot: ActivatedRouteSnapshot):ActivatedRouteSnapshot{
	let deepestChild = snapshot.firstChild;
	while(deepestChild?.children != null){
		deepestChild = deepestChild.firstChild;
	}
	return deepestChild || snapshot;

}
