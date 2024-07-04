import { JeeTeamService } from './../services/jeeteam.service';

import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EditQuyenUserInteamComponent } from '../edit-quyen-user-inteam/edit-quyen-user-inteam.component';
import { MemberService } from '../services/member.service';
import { PaginatorState } from '../model/paginator.model';
import { LayoutUtilsService, MessageType } from 'projects/jeeteam/src/modules/crud/utils/layout-utils.service';
import { SortState } from '../model/sort.model';
import { GroupingState } from '../model/grouping.model';

@Component({
  selector: 'app-phan-quyen-user-team',
  templateUrl: './phan-quyen-user-team.component.html',
  styleUrls: ['./phan-quyen-user-team.component.scss']
})
export class PhanQuyenUserTeamComponent implements OnInit {

  constructor(public service: JeeTeamService,
    private translate: TranslateService,
    private layoutUtilsService: LayoutUtilsService,
    private member_service: MemberService, private dialog: MatDialog, private changeDetectorRefs: ChangeDetectorRef,) { }
  paginator: PaginatorState;
  keymenu: any
  idmenu: any;
  @Output() Quaylai = new EventEmitter();
  @Input() RowID: number;
  RowIdTeam: any;
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
    if (dt) {
      this.idmenu = dt[0].Idmenu;
      this.idSubmenu = dt[0].idSubmenu;
      this.isprivate = dt[0].isprivate;
    }


    this.LoadThanhvien(this.RowID);


    this.grouping = this.service.grouping;
    this.paginator = this.service.paginator;
    this.sorting = this.service.sorting;
    const sb = this.service.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);

  }
  Goback() {
    this.Quaylai.emit()
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

      this.service.patchStateQuanlyTeamthanhvien({ filter }, this.service.rt_Quanlymemberteam, this.RowID);
    }
    else {

      const filter = {};


      this.service.patchStateQuanlyTeamthanhvien({ filter }, this.service.rt_Quanlymemberteam, this.RowID);
    }

  }

  LoadThanhvien(idmenu: number) {

    this.service.fetch_QuanlyTeamthanhvien(this.service.rt_Quanlymemberteam, "", idmenu);

  }
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 236;
    return tmp_height + 'px';
  }

  paginate(paginator: PaginatorState) {
    this.service.patchStatethanhvienphanquyenuser({ paginator }, this.service.rt_Quanlymemberteam, this.RowID, this.isprivate);
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
    this.service.patchStatethanhvienphanquyenuser({ sorting }, this.service.rt_Quanlymemberteam, this.RowID, this.isprivate);
  }


  Phanquyen(Id: number, Admin: boolean, iMember: boolean, user: any) {
    const dialogRef = this.dialog.open(EditQuyenUserInteamComponent, {
      width: '500px',
      data: { RowId: this.RowID, IdUser: Id, isAdmin: Admin, isMember: iMember, user },
      //with:'500px',
      // height:'600px',

      // panelClass:'no-padding'

    });
    dialogRef.afterClosed().subscribe(res => {


      if (res) {
        this.LoadThanhvien(this.RowID);

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
          this.LoadThanhvien(this.RowID);
        } else {
          this.layoutUtilsService.showActionNotification("Thất bại", MessageType.Delete, 4000, true, false, 3000, 'top', 0);
        }
      })

    });
  }

}
