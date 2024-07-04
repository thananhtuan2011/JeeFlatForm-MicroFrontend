import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { fromEvent, merge, BehaviorSubject, Subscription } from 'rxjs';
// RXJS
// Services

// Models
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { ThietLapBanDauService } from '../Services/thiet-lap-ban-dau.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { DanhMucChungService } from '../../hr.service';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }
    transform(value) {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}

@Component({
    selector: 'm-thiet-lap-ban-dau-list',
    templateUrl: './thiet-lap-ban-dau-list.component.html',
    styleUrls: ["./thiet-lap-ban-dau-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThietLapBanDauListComponent implements OnInit {
    listApp: any[] = [];
    constructor(
        public bangCongService: ThietLapBanDauService,
        public dialog: MatDialog,
        public datePipe: DatePipe,
        private changeDetectorRefs: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private translate: TranslateService,
        private router: Router,
        public _DanhMucChungService: DanhMucChungService,
    ) { }
    daTV: boolean = false;
    /** LOAD DATA */
    ngOnInit() {
        this._DanhMucChungService.getStrConfig(1, "hr_gioithieu").subscribe(res => {
            if (res && res.status == 1 && res.data.length > 0) {
                //Giới thiệu
                this._DanhMucChungService.textHR1 = res.data[0] ? res.data[0].Mota : "";
            }
            this.changeDetectorRefs.detectChanges();
        })
        this._DanhMucChungService.getListApp().subscribe(res => {
            if (res && res.status == 1) {
                this.listApp = res.data
            }
            this.changeDetectorRefs.detectChanges();
        })
    }

    getHeight(): any {
        let tmp_height = 596 - 130;
        return tmp_height + "px";
    }

    TiepTuc() {
        this.router.navigate([`/WizardHR/Department`]);
    }

    ClickDataDefault() {
        this.layoutUtilsService.Confirm_Wizard('Sử dụng dữ liệu mặc định',
            'Hệ thống sẽ khởi tạo dữ liệu mặc định cho các thiết lập và sẽ đánh dấu hoàn thành thiết lập cho phân hệ này. Bạn có thể thay đổi các thiết lập này sau bằng cách vào ứng dụng bằng quyền admin hệ thống hoặc admin của ứng dụng. Có đúng là bạn muốn dùng dữ liệu mặc định và bỏ qua thiết lập?',
            "Đóng", "Đồng ý")
            .then((res) => {
                if (res) {
                    this._DanhMucChungService.UpdateInitStatusApp().subscribe(res => {
                        if (res && res.statusCode === 1) {
                            let obj = this.listApp.find(x => x.AppID == 1);
                            if (obj) {
                                window.location.href = obj.BackendURL;
                            } else {
                                this.router.navigate([`Config-System/3`]);
                            }
                        }
                    })
                }
            })
            .catch((err) => { });
    }
}