import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GuideSystemService } from '../guide-system.service';
import { Router } from '@angular/router';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { PhanQuyenTaiKhoanService } from '../phan-quyen-tai-khoan/Services/permision-admin-app.service';
@Component({
  selector: 'app-thong-tin-doanh-nghiep',
  templateUrl: './thong-tin-doanh-nghiep.component.html',
  styleUrls: ['./thong-tin-doanh-nghiep.component.scss']
})
export class ThongTinDoanhNghiepComponent implements OnInit {
  chatConversation: any[] = [];
  response!: any | undefined;
  promptText: string = "";
  _loading$ = new BehaviorSubject<boolean>(
    false
  );
  textDoanhNghiep: string = "";
  textDiaChi: string = "";
  textSoDienThoai: string = "";
  constructor(public _GuideSystemService: GuideSystemService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
  ) {
  }

  ngOnInit(): void {
    this._GuideSystemService.checkAdmin().subscribe(res => {
      if (res && res.status == 1 && res.data.Type == 1) {
        let _item = {
          StepID: 4
        }
        this._GuideSystemService.updateStepCustomer(_item).subscribe(res => { })
        this._GuideSystemService.information().subscribe(res => {
          if (res) {
            this.textDoanhNghiep = res.companyName;
            this.textDiaChi = res.companyAddress;
            this.textSoDienThoai = res.companyPhoneNumber;
          }
          this.changeDetectorRefs.detectChanges();
        })
      } else {
        this.router.navigate(['/Dashboard']);
      }
    })
  }


  TiepTuc() {
    let isFlag = true;
    if (this.textDoanhNghiep == "") {
      isFlag = false
      this.layoutUtilsService.showActionNotification("Vui lòng nhập thông tin tên doanh nghiệp", MessageType.Read, 999999999, true, false, 3000, 'top', 0);
    }
    if (this.textSoDienThoai == "") {
      isFlag = false
      this.layoutUtilsService.showActionNotification("Vui lòng nhập thông tin số điện thoại", MessageType.Read, 999999999, true, false, 3000, 'top', 0);
    }
    if (isFlag) {
      let item = {
        "name": this.textDoanhNghiep,
        "address": this.textDiaChi,
        "phoneNumber": this.textSoDienThoai
      }
      this._GuideSystemService.updateInformationCustomer(item).subscribe(res => {
        if (res && res.Susscess) {
          this.router.navigate([`/Config-System/1`]);
        } else {
          this.layoutUtilsService.showActionNotification(res.ErrorMessgage, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        }
      })
    }
  }

  TroLai() {
    this.router.navigate([`/Config-System`]);
  }

  getHeightFull(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 5;
    return tmp_height + 'px';
  }
}
