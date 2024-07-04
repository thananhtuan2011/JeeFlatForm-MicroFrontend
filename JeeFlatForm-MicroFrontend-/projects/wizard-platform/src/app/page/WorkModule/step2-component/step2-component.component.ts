import { catchError, finalize, share, tap } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { WorkwizardChungService } from '../work.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'projects/wizard-platform/src/modules/i18n/translation.service';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { MatDialog } from '@angular/material/dialog';
import { StatusDynamicDialogComponent } from '../status-dynamic-dialog/status-dynamic-dialog.component';
@Component({
  selector: 'app-step2-component',
  templateUrl: './step2-component.component.html',
  styleUrls: ['./step2-component.component.scss'],
})
export class Step2ComponentComponent implements OnInit {
  constructor(
    private _WorkwizardChungService: WorkwizardChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    private translationService: TranslationService,
    private translate: TranslateService,
    private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog,
  ) {
  }
  Data: any;
  displayedColumns = ['STT', 'TenTrangThai', 'PhanLoai', 'action'];
  ngOnInit(): void {
    this.loadData();
    this.loadNhomTrangThai();
    this._WorkwizardChungService.GetWizard(2).subscribe(res => {
      if (res && res.status == 1) {
        this.isLoad=true;
        this.Data = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  Delete(item) {
    const _title = this.translate.instant("JeeWork.xoa");
    const _description = this.translate.instant(
      "JeeWork.bancochacchanmuonxoakhong"
    );
    const _waitDesciption = this.translate.instant(
      "JeeWork.dulieudangduocxoa"
    );
    const _deleteMessage = this.translate.instant("JeeWork.xoathanhcong");

    const dialogRef = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDesciption
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      else {
        this._WorkwizardChungService.Delete_Status_Template_2023(item.id_row).subscribe(res => {
          if (res && res.status === 1) {
            this.loadData();
            this.layoutUtilsService.showActionNotification(
              _deleteMessage,
              MessageType.Delete,
              4000,
              true,
              false
            );
          }
          else {
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 9999999, 'top', 0);
          }
        });
      }
    })
  }
  dataTrangThai:any;
  isLoad:boolean=false;
  isLoadTrangThai:boolean=false;
  loadData(){
    this.layoutUtilsService.showWaitingDiv();
    this._WorkwizardChungService.NhomTrangThai().subscribe(res=>{
      if(res&& res.status==1){
        this.isLoadTrangThai=true;
        this.layoutUtilsService.OffWaitingDiv();
        this.dataTrangThai=res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  lstNhomTrangThai:any;
  loadNhomTrangThai(){
    const queryParams = new QueryParamsModel(
      "",
      "",
      "",
      0,
      10,
      false
    );
    this._WorkwizardChungService.ListStatusType(queryParams).subscribe(res=>{
      if(res&&res.status==1){
        this.lstNhomTrangThai=res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  getTypeTrangThai(item){
    if(this.lstNhomTrangThai.length>0){
      return this.lstNhomTrangThai.find(t=>t.RowID==item).Title;
    }
    else {
      return ''
    }
  }
  Themtrangthai(item,isThem) {
    let id_row=0;
    if(isThem){
      id_row = this.dataTrangThai[0].id_row;
    }
    
    const dialogRef = this.dialog.open(StatusDynamicDialogComponent, {
      width: "40vw",
      minHeight: "200px",
      data: {item,isThem,id_row},
      disableClose:true,
      panelClass:['sky-padding-0'],
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.loadData();      }
    });
  }
  UpdateStatusType(idstatus,typeid,loading=true){
    this._WorkwizardChungService.UpdateTypeStatus(idstatus,typeid).subscribe(res=>{
      if(res&&res.status==1){
      }
      else{
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          999999999,
          true,
          false,
          0,
          "top",
          0
        );
      }
    })
  }
  getHeight(): any {
    let tmp_height = 597 - 340;
    return tmp_height + "px";
  }
}
export class QueryParamsModel {
	// fields
	filter: any;
	sortOrder: string; // asc || desc
	sortField: string;
	pageNumber: number;
	pageSize: number;   
	more: boolean;
	filterGroup:any;
	// constructor overrides
	constructor(_filter: any,
		_sortOrder: string = 'asc',
		_sortField: string = '',
		_pageNumber: number = 0,
		_pageSize: number = 10,
		_more: boolean = false,
		_filterGroup:any = []) {
		this.filter = _filter;
		this.sortOrder = _sortOrder;
		this.sortField = _sortField;
		this.pageNumber = _pageNumber;
		this.pageSize = _pageSize;
		this.more = _more;
		this.filterGroup = _filterGroup;
	}
}