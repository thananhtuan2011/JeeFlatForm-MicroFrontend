import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GuideSystemService } from '../guide-system.service';
import { Router } from '@angular/router';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { PhanQuyenTaiKhoanService } from '../phan-quyen-tai-khoan/Services/permision-admin-app.service';
@Component({
  selector: 'app-hoan-thanh-khoi-tao',
  templateUrl: './hoan-thanh-khoi-tao.component.html',
  styleUrls: ['./hoan-thanh-khoi-tao.component.scss']
})
export class HoanThanhKhoiTaoComponent implements OnInit {
  chatConversation: any[] = [];
  response!: any | undefined;
  promptText: string = "";
  _loading$ = new BehaviorSubject<boolean>(
    false
  );

  public data: any = [];
  columnsToDisplay: any[] = [];
  constructor(public _GuideSystemService: GuideSystemService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    private _PhanQuyenTaiKhoanService: PhanQuyenTaiKhoanService,
  ) {
  }

  ngOnInit(): void {
    this._GuideSystemService.checkAdmin().subscribe(res => {
      if (res && res.status == 1 && res.data.Type == 1) {
        this.loadDataList();
        this._GuideSystemService.getStrConfig(14, "Admin_step4").subscribe(res => {
          if (res && res.status == 1 && res.data.length > 0) {
            this._GuideSystemService.textStep4 = res.data[0] ? res.data[0].Mota : "";
          }
          this.changeDetectorRefs.detectChanges();
        })
        let _item = {
          StepID: 3
        }
        this._GuideSystemService.updateStepCustomer(_item).subscribe(res => { })
      } else {
        this.router.navigate(['/Dashboard']);
      }
    })

  }

  loadDataList() {
    this.columnsToDisplay = ["STT", "PhanHe", "NhanVien", "TrangThai", "actions"];
    this._PhanQuyenTaiKhoanService.GetListCustomerAppInit().subscribe((res) => {
      if (res && res.data.length > 0) {
        this.data = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  getHeightFull(): any {
    let tmp_height = 0;
    let text = document.getElementById("text").clientHeight;
    tmp_height = window.innerHeight - (text + 195);
    return tmp_height + 'px';
  }

  HoanThanh() {
    this._GuideSystemService.tickComplete().subscribe(res => {
      if (res && res.status == 1) {
        this.router.navigate(['/Dashboard']);
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    })
  }

  TroLai() {
    this.router.navigate([`/Config-System/2`]);
  }

  getNhanVien(data) {
    if (data.Users.length > 0) {
      let _name = "";
      data.Users.forEach(element => {
        _name += ", " + element;
      });
      return _name.substring(1);
    }
    return "";
  }

  getTrangThai(data) {
    switch (data.Init_StatusID) {
      case 1:
        return "Đang thực hiện";
      case 2:
        return "Đã hoàn thành";
      default:
        return "Chưa khởi tạo";
    }
  }

  getColor(data) {
    switch (data.Init_StatusID) {
      case 1:
        return "#ff6a00";
      case 2:
        return "#50cd89";
      default:
        return "";
    }
  }

  checkAlink(data) {
    switch (data.AppID) {
      case 1:
      case 20:
      case 34:
      case 38:
        return true;
      default:
        return false;
    }
  }

  routerLink(data) {
    let _link = ""
    switch (data.AppID) {
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

    if (data.Init_StatusID != 1) {
      if (data.AppID == 1) {//Khởi tạo ngầm HR
        let _item = {
          "LinhVucID": 2,
          "IsTaodulieumau": false
        };
        this._PhanQuyenTaiKhoanService.UpdateInfoCustemer(_item).subscribe(res => { });
      }
      this._PhanQuyenTaiKhoanService.UpdateInitStatusApp(data.AppID).subscribe(res => {
        if (res && res.statusCode === 1) {
          this.loadDataList();
          let link = window.location.origin + "/" + _link;
          window.open(link, "blank");
        }
      })
    } else {
      let link = window.location.origin + "/" + _link;
      window.open(link, "blank");
    }
  }
}
