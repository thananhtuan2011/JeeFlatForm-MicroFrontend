import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GuideAdminService } from './guide-admin.service';
import { QueryParamsModel } from 'src/app/modules/auth/models/query-params.model';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { PhanQuyenTaiKhoanService } from '../guide-system/phan-quyen-tai-khoan/Services/permision-admin-app.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-guide-admin',
  templateUrl: './guide-admin.component.html',
  styleUrls: ['./guide-admin.component.scss']
})
export class GuideAdminComponent implements OnInit {
  chatConversation: any[] = [];
  response!: any | undefined;
  promptText: string = "";
  _loading$ = new BehaviorSubject<boolean>(
    false
  );

  img: string = "";
  userID: number;

  listData: any[] = [];
  constructor(private _GuideAdminService: GuideAdminService,
    private changeDetectorRefs: ChangeDetectorRef,
    private auth: AuthService,
    private _PhanQuyenTaiKhoanService: PhanQuyenTaiKhoanService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.userID = this.auth.getUserId();
    this.LoadData();
    this._GuideAdminService.getLogoApp(3).subscribe(res => {
      if (res && res.status == 1) {
        this.img = res.data.IconApp;
        this.changeDetectorRefs.detectChanges();
      }
    })

    this._GuideAdminService.CheckUseWizard().subscribe(res => {
      if (res && res.status != 1) {
        this.router.navigate(['/Dashboard']);
      }
    })
  }

  getHeightFull(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 5;
    return tmp_height + 'px';
  }

  LoadData() {
    let queryParams;
    queryParams = new QueryParamsModel(
      this.filter()
    );
    queryParams.more = true;
    this._GuideAdminService.findData(queryParams).subscribe(
      (res) => {
        if (res && res.data.length > 0) {
          this.listData = res.data;
        } else {
          this.listData = [];
        }
        this.changeDetectorRefs.detectChanges();
      }
    );
  }

  filter(): any {
    const filterNew: any = {
      UserID: this.userID
    };
    return filterNew;
  }

  openLink(lst) {
    let _link = ""
    switch (lst.AppID) {
      case 1:
        _link = "WizardHR";
        break;
      case 20:
        _link = "WizardTicket";
        break;
      case 34:
        _link = "WizardWork";
        break;
      case 38:
        _link = "WizardSale";
        break;
    }
    if (lst.Init_StatusID != 2 && lst.Init_StatusID != 1) {
      if (lst.AppID == 1) {//Khởi tạo ngầm HR
        let _item = {
          "LinhVucID": 2,
          "IsTaodulieumau": false
        };
        this._PhanQuyenTaiKhoanService.UpdateInfoCustemer(_item).subscribe(res => { });
      }
      this._PhanQuyenTaiKhoanService.UpdateInitStatusApp(lst.AppID).subscribe(res => {
        if (res && res.statusCode === 1) {
          this.LoadData();
          let link = window.location.origin + "/" + _link;
          window.open(link, "blank");
        }
      })
    } else {
      let link = window.location.origin + "/" + _link;
      window.open(link, "blank");
    }
  }

  getColor(lst) {
    if (lst.Init_StatusID == 2) {
      return "#0846AD"
    }
    return "#F24B66";
  }
}
