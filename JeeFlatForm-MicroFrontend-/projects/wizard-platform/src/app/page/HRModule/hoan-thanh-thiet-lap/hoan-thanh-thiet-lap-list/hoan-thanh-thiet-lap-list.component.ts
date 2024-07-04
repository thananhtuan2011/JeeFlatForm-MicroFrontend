import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
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
import { HoanhThanhThietLapService } from '../Services/hoan-thanh-thiet-lap.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { DanhMucChungService } from '../../hr.service';


@Component({
    selector: 'm-hoan-thanh-thiet-lap-list',
    templateUrl: './hoan-thanh-thiet-lap-list.component.html',
    styleUrls: ["./hoan-thanh-thiet-lap-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoanhThanhThietLapListComponent implements OnInit {
    listApp: any[] = [];
    constructor(
        public _HoanhThanhThietLapService: HoanhThanhThietLapService,
        public dialog: MatDialog,
        public datePipe: DatePipe,
        private changeDetectorRefs: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private translate: TranslateService,
        private router: Router,
        public _DanhMucChungService: DanhMucChungService,
    ) { }
    /** LOAD DATA */
    ngOnInit() {
        this._DanhMucChungService.getStrConfig(1, "hr_hoanthanh").subscribe(res => {
            if (res && res.status == 1 && res.data.length > 0) {
                //Giới thiệu
                this._DanhMucChungService.textHR9 = res.data[0] ? res.data[0].Mota : "";
                this._DanhMucChungService.textHR9 = res.data[1] ? res.data[1].Mota : "";
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
        let tmp_height = 600 - 174;
        return tmp_height + "px";
    }

    HoanThanh() {
        this._HoanhThanhThietLapService.UpdateInitStatusApp().subscribe(res => {
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

    TroLai() {
        window.history.back()
        // this.router.navigate([`/WizardHR/Config/Wifi`]);
    }
}