
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from "@angular/forms";
// Angular

import {
	Component,
	OnInit,
	Inject,
	ChangeDetectionStrategy,
	OnDestroy,
	ElementRef,
	ViewChild,
	ChangeDetectorRef,
} from "@angular/core";

// RxJS
import { BehaviorSubject, merge, Observable, of, Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { YeuCauService } from "../../_services/yeu-cau.services";
import { DynamicFormService } from "../dynamic-form/dynamic-form.service";
import { DynamicFormEditComponent } from "../dynamic-form/dynamic-form-edit/dynamic-form-edit.component";
import { DynamicFormComponent } from "../dynamic-form/dynamic-form.component";
import { DynamicFormCopyComponent } from "../dynamic-form/dynamic-form-copy/dynamic-form-copy.component";
import { TranslateService } from "@ngx-translate/core";
import { LayoutUtilsService } from "projects/jeerequest/src/modules/crud/utils/layout-utils.service";
import { QueryParamsModelNew } from "../../../models/query-models/query-params.model";


@Component({
	selector: "kt-tao-yeu-cau-dialog",
	templateUrl: "./tao-yeu-cau.component.html",
	changeDetection: ChangeDetectionStrategy.Default,
})
export class TaoYeuCauDialogComponent implements OnInit, OnDestroy {
	@ViewChild(DynamicFormEditComponent) DynamicFormEditComponent;
	@ViewChild(DynamicFormComponent) DynamicFormComponent;
	@ViewChild(DynamicFormCopyComponent) DynamicFormCopyComponent;
	// Public properties
	TenLoaiYeuCau:string;
	MoTa:string
	LoaiYeuCauForm: FormGroup;
	disthEdit: boolean = false;
	disthRead: boolean = false;
	Edit: boolean = false;
	Read: boolean = false;
	item: any;
	listQuyen: any[] = [];
	disabledBtn: boolean = false;
	itemForm: FormGroup
	loadingSubject = new BehaviorSubject<boolean>(false);
	tenYeuCau:string;
	Id_LoaiYeuCau: number;
	Loai:number
	dataConTrol:any
	MotaLoaiYeuCau:string
	nguoiDuyet:string=''
	id_YeuCau:any
	Id_QuyTrinh:number
	//=================PageSize Table=====================
	pageEvent: PageEvent;
	pageSize: number;
	listStatus: any[] = [];
	listData: any[] = [];
	fields : any[]=[];
	// Private properties
	private componentSubscriptions: Subscription;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
	 * @param store: Store<AppState>
	 */
	constructor(
		public dialogRef: MatDialogRef<TaoYeuCauDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		// private ChucDanhService: ChucDanhService,
		private fb: FormBuilder,
		private changeDetectorRefs: ChangeDetectorRef,
		// private tokenStorage: TokenStorage,
		private dynamicFormService:DynamicFormService,
		private layoutUtilsService: LayoutUtilsService,
		private YeuCauService: YeuCauService,
		private translate: TranslateService,
	) {
	}

	/**
	 * On init
	 */
	 ngOnInit(): void {
		this.Id_LoaiYeuCau = this.data._Id_LoaiYeuCau;
		this.id_YeuCau = this.data._id_YeuCau;
		this.Id_QuyTrinh = this.data._Id_QuyTrinh
		//mô tả yêu cầu
		this.MoTa = this.data._MoTa;
		this.TenLoaiYeuCau = this.data._tenLoai
		this.tenYeuCau = this.data._TenYeuCau
		//mô tả loại yêu cầu
		this.MotaLoaiYeuCau = this.data._MoTaLoaiYeuCau
		//Loai 1 là nhân bản, loại 2 là chỉnh sửa
		this.Loai = this.data._Loai
		this.dataConTrol = this.data._dataControl

		this.LoadList();


	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {

	}


	LoadList() {
		const queryParams1 = new QueryParamsModelNew(
			this.filterConfiguration()
		);
		this.YeuCauService.LoadControlList(queryParams1).subscribe((res) => {
			if (res && res.status === 1) {

				this.fields = res.data
				this.changeDetectorRefs.detectChanges();
			} else {
				return;
			}
		});
		if(this.Id_QuyTrinh == 0 ){
			this.YeuCauService.LayNguoiDuyetDauTien(this.Id_LoaiYeuCau).subscribe((res) => {
				let nd = "";
				if (res && res.status === 1) {
					if(res.data.length > 1){
						for (let index = 0; index <res.data.length; index++) {
							if(index == 2){
								nd +="..."
								break
							}
							nd +=", " + res.data[index].HoTen;
						}
						if(nd == ""){
							this.nguoiDuyet = "Không tìm thấy người duyệt"
							this.disabledBtn = true
						}
						this.nguoiDuyet = this.translate.instant('Yeucau.guicho') + " " +  nd.slice(2, nd.length) + " " + this.translate.instant('Yeucau.duyet')
						this.disabledBtn = false
					}else{
						if(res.data.length == 0){
							this.nguoiDuyet = "Không tìm thấy người duyệt"
							this.disabledBtn = true
						}
						this.nguoiDuyet =  this.translate.instant('Yeucau.guicho') + " " +  res.data[0].HoTen + " " + this.translate.instant('Yeucau.duyet')
						this.disabledBtn = false
					}
					this.changeDetectorRefs.detectChanges();
				} else {
					return;
				}
			});
		}else{
			this.YeuCauService.LayNguoiDuyetCuaQuyTrinh(this.Id_LoaiYeuCau).subscribe((res) => {
				let nd = "";
				if (res && res.status === 1) {
					if(res.data.length > 1){
						for (let index = 0; index <res.data.length; index++) {
							if(index == 2){
								nd +="..."
								break
							}
							nd +=", " + res.data[index].HoTen;
						}
						if(nd == ""){
							this.nguoiDuyet = "Không tìm thấy người duyệt"
							this.disabledBtn = true
						}
						this.nguoiDuyet = this.translate.instant('Yeucau.guicho') + " " + nd.slice(2, nd.length) + " " + this.translate.instant('Yeucau.duyet')
						this.disabledBtn = false
					}else{
						if(res.data[0].HoTen == ""){
							this.nguoiDuyet = "Không tìm thấy người duyệt"
							this.disabledBtn = true
						}
						this.nguoiDuyet =  this.translate.instant('Yeucau.guicho') + " " + res.data[0].HoTen + " " + this.translate.instant('Yeucau.duyet')
						this.disabledBtn = false
					}
					this.changeDetectorRefs.detectChanges();
				} else {
					return;
				}
			});
		}
		if(this.nguoiDuyet == ''){
			this.nguoiDuyet = 'Không tìm thấy người duyệt'
			this.disabledBtn = true
		}
	}
	filterConfiguration(): any {
		const filter: any = {};
		filter.Id_LoaiYeuCau = this.Id_LoaiYeuCau;
		return filter;
	}
	close() {
		this.disabledBtn = false
		// this.layoutUtilsService.OffWaitingDiv()
		this.dialogRef.close();
	}
	closeDynamic() {
		let _item = {item:0}
		this.disabledBtn = false
		// this.layoutUtilsService.OffWaitingDiv()
		this.dialogRef.close({
			_item
		});
	}
	getTitle(): string {
		if(this.Loai==1)
			return this.translate.instant('Yeucau.nhanbanyeucau');
		if(this.Loai==2){
			return this.translate.instant('Yeucau.chinhsuayeucau');
		}
		return this.translate.instant('Yeucau.taomoiyeucau');
	}


	TatKT() {
		this.disabledBtn = false
		// this.layoutUtilsService.OffWaitingDiv()
	}
	// ==========================================
	guiYeuCau(){
		this.disabledBtn = true
		// this.layoutUtilsService.showWaitingDiv()
		if(this.Loai == 1){
			this.DynamicFormCopyComponent.GuiYeuCau();
		}
		if(this.Loai == 2){
			this.disabledBtn = false
			// this.layoutUtilsService.OffWaitingDiv()
			const _title ="Lưu thay đổi";
		const _description = "Bạn có chắc chắn muốn lưu các thay đổi của yêu cầu này không?";
		const _waitDesciption = "Đang lưu";

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
			}else{
				this.DynamicFormEditComponent.GuiYeuCau();
			}
		})
		}
		if(this.Loai == 3){
			this.DynamicFormComponent.GuiYeuCau();
		}

	}

}
