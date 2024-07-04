import { JeeTeamService } from './../services/jeeteam.service';
import { MemberService } from '../services/member.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { EditPhanquyenComponent } from '../edit-phanquyen/edit-phanquyen.component';
import { LayoutUtilsService, MessageType } from 'projects/jeeteam/src/modules/crud/utils/layout-utils.service';
import { PaginatorState } from '../model/paginator.model';
import { SortState } from '../model/sort.model';
import { GroupingState } from '../model/grouping.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-phan-quyen',
  templateUrl: './phan-quyen.component.html',
  styleUrls: ['./phan-quyen.component.scss']
})
export class PhanQuyenComponent implements OnInit {


  constructor(public service: JeeTeamService,
    private translate: TranslateService,
    private router: Router,
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


    this.LoadThanhvien();


    this.grouping = this.service.grouping;
    this.paginator = this.service.paginator;
    this.sorting = this.service.sorting;
    const sb = this.service.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);

  }
  Goback() {
    this.router.navigateByUrl("/Group")
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

      this.service.patchStateQuanlyTeamthanhvienPhanQuyen({ filter }, this.service.rt_phanquyen);
    }
    else {

      const filter = {};


      this.service.patchStateQuanlyTeamthanhvienPhanQuyen({ filter }, this.service.rt_phanquyen);
    }

  }
  // changeFilter(filter) {
  //   this.service.patchStateQuanlyTeamthanhvienPhanQuyen({ filter });
  // }

  LoadThanhvien() {

    this.service.fetch_QuanlyTeamthanhvienPhanquyen(this.service.rt_phanquyen, "");

  }
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 126;
    return tmp_height + 'px';
  }

  paginate(paginator: PaginatorState) {
    this.service.patchStateQuanlyTeamthanhvienPhanQuyen({ paginator }, this.service.rt_phanquyen);
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
    this.service.patchStateQuanlyTeamthanhvienPhanQuyen({ sorting }, this.service.rt_phanquyen);
  }


  Phanquyen(Id: number, Admin: boolean, iMember: boolean, user: any) {
    const dialogRef = this.dialog.open(EditPhanquyenComponent, {
      width: '500px',
      data: { RowId: this.RowID, IdUser: Id, isAdmin: Admin, isMember: iMember, user },
      //with:'500px',
      // height:'600px',

      // panelClass:'no-padding'

    });
    dialogRef.afterClosed().subscribe(res => {


      if (res) {
        this.LoadThanhvien();

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
          this.LoadThanhvien();
        } else {
          this.layoutUtilsService.showActionNotification("Thất bại", MessageType.Delete, 4000, true, false, 3000, 'top', 0);
        }
      })

    });
  }

}
