import { JeeTeamService } from './../services/jeeteam.service';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MemberService } from '../services/member.service';
import { LayoutUtilsService, MessageType } from 'projects/jeeteam/src/modules/crud/utils/layout-utils.service';

@Component({
  selector: 'app-edit-phanquyen',
  templateUrl: './edit-phanquyen.component.html',
  styleUrls: ['./edit-phanquyen.component.scss']
})
export class EditPhanquyenComponent implements OnInit {
  name: string;
  Avatar: string
  BgColor: string;
  valueradio: any = "";
  constructor(
    private member_service: MemberService,
    private dashboar_service: JeeTeamService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dialogRef: MatDialogRef<EditPhanquyenComponent>,) {
    const user = this.dashboar_service.getAuthFromLocalStorage()['user'];
    this.name = user['customData']['personalInfo']['Fullname'];
    this.Avatar = user['customData']['personalInfo']['Avatar'];
    this.BgColor = user['customData']['personalInfo']['BgColor'];
  }
  goBack() {

    this.dialogRef.close();

  }
  submit() {
    if (this.valueradio) {

      this.dashboar_service.UpdateRolesMember(this.data.user.Username, this.valueradio, this.data.user.UserId).subscribe(res => {
        if (res) {
          this.layoutUtilsService.showActionNotification("Thành công", MessageType.Delete, 4000, true, false, 3000, 'top', 1);
          this.CloseDia(res);
        }
      })
    }
    else {
      this.layoutUtilsService.showActionNotification("Vui lòng chọn tác vụ", MessageType.Delete, 4000, true, false, 3000, 'top', 0);
    }

  }
  CloseDia(data = undefined) {
    this.dialogRef.close(data);
  }
  Getquyen() {
    this.dashboar_service.GetPhanQuyenByUserName(this.data.user.Username).subscribe(res => {
      if (res) {
        if (res.data[0].IdGroup == 1) {
          this.valueradio = "Admin";
        }
        if (res.data[0].IdGroup == 2) {
          this.valueradio = "User";
        }
      }
    });
  }
  ngOnInit(): void {
    this.Getquyen();

  }


}
