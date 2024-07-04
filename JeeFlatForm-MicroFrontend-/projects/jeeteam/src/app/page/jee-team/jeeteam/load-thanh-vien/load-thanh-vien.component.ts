import { MemberService } from './../services/member.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddMemberChanelComponent } from '../add-member-chanel/add-member-chanel.component';
import { TranslateService } from '@ngx-translate/core';
import { JeeTeamService } from '../services/jeeteam.service';
import { LayoutUtilsService, MessageType } from 'projects/jeeteam/src/modules/crud/utils/layout-utils.service';
import { PaginatorState } from '../model/paginator.model';
import { SortState } from '../model/sort.model';
import { GroupingState } from '../model/grouping.model';

@Component({
  selector: 'app-load-thanh-vien',
  templateUrl: './load-thanh-vien.component.html',
  styleUrls: ['./load-thanh-vien.component.scss']
})
export class LoadThanhVienComponent implements OnInit {

  constructor(public service: JeeTeamService,
    private translate: TranslateService,
    private layoutUtilsService: LayoutUtilsService,
    private member_service: MemberService, private dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef,) { }
  paginator: PaginatorState;
  keymenu: any
  idmenu: any;
  idSubmenu: any;
  searchtext: string;
  isprivate: any;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  ngOnInit(): void {
    this.keymenu = localStorage.getItem("KeyIdMenu");
    var dt = JSON.parse(this.keymenu)
    this.idmenu = dt[0].Idmenu;
    this.idSubmenu = dt[0].idSubmenu;
    this.isprivate = dt[0].isprivate;
    console.log("this.Idmenu", this.idmenu)

    this.LoadThanhvien(this.idmenu, this.isprivate);


    this.grouping = this.service.grouping;
    this.paginator = this.service.paginator;
    this.sorting = this.service.sorting;
    const sb = this.service.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);

  }
  saverange(value) {



    this.search(value)

  }

  search(value) {
    // filter.HOTEN =filter;
    //  this.accountManagementService.patchState({ filter }

    if (value != "") {


      const filter = {};
      filter['FullName'] = value

      this.service.patchStatethanhvien({ filter }, this.service.rt_loadUserinteam, this.idmenu, this.isprivate);
    }
    else {

      const filter = {};


      this.service.patchStatethanhvien({ filter }, this.service.rt_loadUserinteam, this.idmenu, this.isprivate);
    }

  }

  LoadThanhvien(idmenu: number, isprivate: any) {

    this.service.fetch_Thanhvien(this.service.rt_loadUserinteam, "", idmenu, isprivate);

  }
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 236;
    return tmp_height + 'px';
  }

  paginate(paginator: PaginatorState) {
    this.service.patchStatethanhvien({ paginator }, this.service.rt_loadUserinteam, this.idmenu, this.isprivate);
  }
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.service.patchStatethanhvien({ sorting }, this.service.rt_loadUserinteam, this.idmenu, this.isprivate);
  }


  AddMemberChanel() {
    // alert(RowId)
    const dialogRef = this.dialog.open(AddMemberChanelComponent, {
      width: '600px',
      data: this.idmenu,
      // height:'600px',

      // panelClass:'no-padding'

    });
    dialogRef.afterClosed().subscribe(res => {


      if (res) {
        this.LoadThanhvien(this.idmenu, this.isprivate);
        // this.menu.loadMenu();

        this.changeDetectorRefs.detectChanges();
      }
    })

  }
  // DeleteMember(IdUser:number)
  // {
  //   this.member_service.DeleteMember(this.idSubmenu,IdUser).subscribe(res=>{
  //     if(res)
  //     {
  //       this.LoadThanhvien(this.idmenu, this.isprivate);
  //     }
  //   })
  // }
  DeleteMember(IdUser: number) {
    const _title = this.translate.instant('Xóa thành viên');
    const _description = this.translate.instant('Bạn có muốn xóa không ?');
    const _waitDesciption = this.translate.instant('Dữ liệu đang được xóa');
    const _deleteMessage = this.translate.instant('Xóa thành công !');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.member_service.DeleteMember(this.idSubmenu, IdUser).subscribe(res => {

        if (res && res.status === 1) {

          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
          this.LoadThanhvien(this.idmenu, this.isprivate);
        } else {
          this.layoutUtilsService.showActionNotification("Thất bại", MessageType.Delete, 4000, true, false, 3000, 'top', 0);
        }
      })

    });
  }
}
