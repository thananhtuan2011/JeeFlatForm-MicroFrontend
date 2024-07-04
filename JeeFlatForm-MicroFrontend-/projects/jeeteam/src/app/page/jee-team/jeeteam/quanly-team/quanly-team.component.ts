import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { MemberService } from '../services/member.service';
import { LayoutUtilsService, MessageType } from 'projects/jeeteam/src/modules/crud/utils/layout-utils.service';
import { MenuJeeTeamServices } from '../services/menu_jeeteam.service';
import { JeeTeamService } from '../services/jeeteam.service';

@Component({
  selector: 'app-quanly-team',
  templateUrl: './quanly-team.component.html',
  styleUrls: ['./quanly-team.component.scss']
})
export class QuanlyTeamComponent implements OnInit {
  isGroup: boolean;
  active: boolean = true;
  constructor(
    private translate: TranslateService,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    public service: JeeTeamService,
    private dialogRef: MatDialogRef<QuanlyTeamComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _servvice_menu: MenuJeeTeamServices,
    private _service: MemberService,
  ) {
    const authData = this.service.getAuthFromLocalStorage();
    this.UserIdCurrent = authData.user.customData["jee-account"].userID

  }

  lstThanhVien: any[] = [];
  UserIdCurrent: number;
  adminGroup: boolean = false;


  CloseDia(data = undefined) {
    this.dialogRef.close(data);
  }
  goBack() {

    this.dialogRef.close();

  }

  LeaveGroup(UserId: number) {

    // this._service.DeleteThanhVienInGroup(this.data.IdGroup,UserId).subscribe(res=>{

    //   if(res&&res.status==1)
    //   {


    //       this.CloseDia(res);

    //       this.router.navigateByUrl('/Chat') //có link thì chuyển link
    //       var item={IdGroup:this.data.IdGroup,UserId:res}
    //       this.conversation_service.refreshConversation.next(item);
    //   }
    //   else
    //   {
    //     this.layoutUtilsService.showActionNotification('Thất bại !', MessageType.Read, 3000, true, false, 3000, 'top', 0);

    //   }
    // })
  }

  LoadThanhVien() {
    this._service.GetThanhVienTeam(this.data.RowId).subscribe(res => {
      this.lstThanhVien = res.data;

      this.CheckLoginAdmin();
      this.active = false
      this.changeDetectorRefs.detectChanges();
    })
  }
  UpdateAdmin(IdUser: number, key: any) {
    this._service.UpdateAdmin(this.data.RowId, IdUser, key).subscribe(res => {
      if (res && res.status === 1) {
        let index = this.lstThanhVien.findIndex(x => x.UserId === IdUser);
        this.lstThanhVien.splice(index, 1, res.data[0])
      }
    })
  }
  CheckLoginAdmin() {

    if (this.lstThanhVien.length > 0) {
      let id = this.lstThanhVien.find(x => x.UserId === this.UserIdCurrent && x.isAdmin == true);
      if (id) {
        this.adminGroup = true;
        this.changeDetectorRefs.detectChanges();
      }
    }
  }
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
      this._servvice_menu.DeleteMemberTeam(this.data.RowId, IdUser).subscribe(res => {

        if (res && res.status === 1) {
          let index = this.lstThanhVien.findIndex(x => x.UserId === IdUser);
          this.lstThanhVien.splice(index, 1)

          // this.goBack();
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
        } else {
          this.layoutUtilsService.showActionNotification("Thất bại", MessageType.Delete, 4000, true, false, 3000, 'top', 0);
        }
      })

    });
  }
  ngOnInit(): void {
    this.LoadThanhVien();
    // alert(this.data.RowId)
    //  this.isGroup=this.data.isGroup

  }

}
