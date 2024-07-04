import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MemberService } from '../services/member.service';
import { LayoutUtilsService, MessageType } from 'projects/jeeteam/src/modules/crud/utils/layout-utils.service';
import { JeeTeamService } from '../services/jeeteam.service';

@Component({
  selector: 'app-edit-quyen-user-inteam',
  templateUrl: './edit-quyen-user-inteam.component.html',
  styleUrls: ['./edit-quyen-user-inteam.component.scss']
})
export class EditQuyenUserInteamComponent implements OnInit {
  name: string;
  Avatar: string
  BgColor: string;
  valueradio: any;
  constructor(
    private member_service: MemberService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private dashboar_service: JeeTeamService,
    private dialogRef: MatDialogRef<EditQuyenUserInteamComponent>,) {
    const user = this.dashboar_service.getAuthFromLocalStorage()['user'];
    this.name = user['customData']['personalInfo']['Fullname'];
    this.Avatar = user['customData']['personalInfo']['Avatar'];
    this.BgColor = user['customData']['personalInfo']['BgColor'];
  }
  goBack() {

    this.dialogRef.close();

  }
  submit() {
    this.member_service.PhanquyeninTeam(this.data.RowId, this.data.IdUser, this.valueradio).subscribe(res => {
      if (res) {
        this.layoutUtilsService.showActionNotification("Thành công", MessageType.Delete, 4000, true, false, 3000, 'top', 1);
        this.CloseDia(res);
      }
    })
  }
  CloseDia(data = undefined) {
    this.dialogRef.close(data);
  }
  ngOnInit(): void {
    console.log("this.data", this.data)

    if (this.data.isAdmin) {
      this.valueradio = "Owner";
    }
    if (this.data.isMember) {
      this.valueradio = "Member";
    }
  }


}
