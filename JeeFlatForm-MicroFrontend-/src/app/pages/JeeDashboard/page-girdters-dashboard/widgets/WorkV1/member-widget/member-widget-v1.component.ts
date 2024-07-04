import { ChangeDetectorRef, EventEmitter, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { QueryParamsModelNew } from 'src/app/_metronic/core/models/pagram';
import { WidgetMembersService } from './services/member-widget.service';
import { JeeWorkLiteService } from '../services/wework.services';

@Component({
  selector: 'member-widget-v1',
  templateUrl: './member-widget-v1.component.html',
})
export class ListMembersWidgetV1Component
  implements
  OnInit,
  OnDestroy{
  isLoading: boolean = false;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  colorCrossbar = ['red', 'blue', '#ff9900', 'green', 'violet'];
  @Input() cssClass: '';
  list_widgets: any[] = [];
  @Input()
  
  btnThietlap: Subscription;
  btnDeleteFilterDK: Subscription;
  btnFilterSub: Subscription;
  btnFilterDK: Subscription;
  btnConfigTimeFilter: Subscription;
  Team = 0;
  ListProject: any = [];
  idDK = 0;
  ListDK: any = [];
  SQL_Custom: any;

  btnFilterEventMember_Widget37: EventEmitter<any> = new EventEmitter<any>();
  btnFilterEventCondition_Widget37: EventEmitter<any> = new EventEmitter<any>();
  filterDSTrangthaiMember_Widget37: EventEmitter<any> = new EventEmitter<any>();
  filterDieuKienLoc_Widget37: EventEmitter<any> = new EventEmitter<any>();
  btnDeleteFilterEventCondition_Widget37: EventEmitter<any> = new EventEmitter<any>();
  btnSetConfigTimeFilter: EventEmitter<any> = new EventEmitter<any>();
  btnThietlapFilter_Widget37: EventEmitter<any> = new EventEmitter<any>();

  public itemsUser$ = new BehaviorSubject<[]>([]);
  constructor(
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    public _WidgetMembersService: WidgetMembersService,
    private translate: TranslateService,
    public dialog: MatDialog,
    public _JeeWorkLiteService: JeeWorkLiteService

  ) { }
  ngOnInit() {
    this.btnFilterSub = this.btnFilterEventMember_Widget37.subscribe((res) => {
      if (res != this.Team) {
        this.Team = res;
        setTimeout(() => {
          this.loadList();
          this.changeDetectorRefs.detectChanges();
        }, 1000);
        var object = {
          list: this.ListProject,
          name: this.NameofTeam(),
        };
        this.filterDSTrangthaiMember_Widget37.emit(object);
      }
    });

    this.btnFilterDK = this.btnFilterEventCondition_Widget37.subscribe((res) => {
      if (res != this.idDK) {
        this.idDK = res.RowID;
        this.SQL_Custom = res.SQL_Custom;
        setTimeout(() => {
          this.loadList();
          this.changeDetectorRefs.detectChanges();
        }, 1000);
        var object = {
          list: this.ListDK,
          name: this.NameofDK(),
        };
        this.filterDieuKienLoc_Widget37.emit(object);
      }
    });
    this.btnDeleteFilterDK = this.btnDeleteFilterEventCondition_Widget37.subscribe((res) => {
      this.delete_dk(res);

    });
    this.btnThietlap = this.btnThietlapFilter_Widget37.subscribe((res) => {
      this.load_đk();

    });
    this.btnConfigTimeFilter = this.btnSetConfigTimeFilter.subscribe((res) => {


    });
    this._JeeWorkLiteService.lite_project_by_manager().subscribe(
      (res) => {
        if (res && res.status == 1) {

          this.ListProject = res.data;
          var object = {
            list: this.ListProject,
            name: this.NameofTeam(),
          };
          this.filterDSTrangthaiMember_Widget37.emit(object);
        }
      }
    );
    this.load_đk();


    this.loadList();
    this.changeDetectorRefs.detectChanges();
  }
  reset() {

  }
  load_đk() {
    this._JeeWorkLiteService.Get_listCustomWidgetByUser(37).subscribe(res => {
      if (res && res.status == 1) {

        this.ListDK = res.data;
        var object = {
          list: this.ListDK,
          name: this.NameofDK(),
        };
        this.filterDieuKienLoc_Widget37.emit(object);
      }
    })
  }
  delete_dk(id) {
    this._JeeWorkLiteService.Delete_Custom_Widget(id).subscribe(res => {
      if (res && res.status == 1) {
        this.load_đk();
      }
    })
  }
  loadList() {
    var resItems: any = [];
    var resTotalRow: number = 0;
    const query = new QueryParamsModelNew(this.filterConfiguration());
    this._WidgetMembersService.loadList(query).subscribe(res => {
      if (res && res.status == 1) {
        resItems = res.data;
        resTotalRow = res.page?.TotalCount;
      }
      this.itemsUser$.next(resItems);
    });
  }
  f_convertDate(p_Val: any) {
    let a = p_Val === "" ? new Date() : new Date(p_Val);
    return ("0" + (a.getDate())).slice(-2) + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + a.getFullYear();
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  filterConfiguration(): any {
    const filter: any = {};
    if (this.Team > 0)
      filter.id_project_team = this.Team;
    if (this.SQL_Custom) {
      filter.SQL_Custom = this.idDK;
    }
    else filter.SQL_Custom = 0;
    return filter;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  getClasses(val) {
    if (val == 2)
      return 'label label-lg label-light-warning label-inline';
    else {
      if (val == 3)
        return 'label label-lg label-light-danger label-inline';
      return 'label label-lg label-light-success label-inline';
    }
  }
  GetStringByStatus(status) {
    let result = "";
    if (status == 2)
      return result = this.translate.instant('projects.chamtiendo');
    else {
      if (status == 3)
        result = this.translate.instant('projects.ruirocao');
      else
        result = this.translate.instant('projects.dungtiendo');
    }
    return result;
  }
  GetColorProgress(status) {
    if (status > 75)
      return 'progress-bar bg-success';
    else {
      if (status < 25)
        return 'progress-bar bg-danger';
      else {
        if (status < 50)
          return 'progress-bar bg-primary';
        return 'progress-bar bg-info';
      }
    }
  }

  getHeight(): any {
    let tmp_height = document.getElementById("gridster-height37").clientHeight;
    tmp_height = tmp_height - 120;
    return tmp_height + 'px';
  }
  getWidth(): any {
    let tmp_width = document.getElementById("gridster-height37").clientWidth;
    return tmp_width > 500;
  }

  NameofTeam() {
    if (this.ListProject) {
      var team = this.ListProject.find(
        (element) => element.id_row == this.Team
      );
      if (team) return team.title;
    }
    return "";
  }
  NameofDK() {
    if (this.ListDK) {
      var team = this.ListDK.find(
        (element) => element.RowID == this.idDK
      );
      if (team) return team.Title;
    }
    return "Chọn điều kiện";
  }
  getMoreInformation(item): string {
    return item.hoten + ' \n ' + item.tenchucdanh;
  }
}
export interface DialogData {
  start: string;
  end: string;
}