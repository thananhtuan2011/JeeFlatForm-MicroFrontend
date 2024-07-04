import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { SocketioStore } from "src/app/_metronic/core/services/socketio.store";
import { MenuWorkService } from "../services/menu-work.services";
import { FormatTimeService } from "../../services/jee-format-time.component";
import { CookieService } from "ngx-cookie-service";
import { DanhMucChungService } from "../../services/danhmuc.service";

@Component({
    selector: 'app-cong-viec-theo-du-an-chart',
    templateUrl: './cong-viec-theo-du-an-chart.component.html',
    styleUrls: ["./cong-viec-theo-du-an-chart.component.scss"],
})
export class CongViecTheoDuAnChartComponent implements OnInit {
    UserID: number = 0;
    direction: string = "2";
    nodes: any = [
        {
            name: 'Sundar Pichai',
            cssClass: 'ngx-org-ceo thien-class',
            image: '',
            title: '<b>Chief Executive Officer</b>',
            id: 100,
            childs: [
                {
                    name: 'Thomas Kurian',
                    cssClass: 'ngx-org-ceo',
                    image: 'assets/node.svg',
                    title: 'CEO, Google Cloud',
                    id: 100,
                },
                {
                    name: 'Susan Wojcicki',
                    cssClass: 'ngx-org-ceo',
                    image: 'assets/node.svg',
                    title: 'CEO, YouTube',
                    id: 100,
                    childs: [
                        {
                            name: 'Beau Avril',
                            cssClass: 'ngx-org-head',
                            image: 'assets/node.svg',
                            title: 'Global Head of Business Operations',
                            id: 100,
                            childs: []
                        },
                        {
                            name: 'Tara Walpert Levy',
                            cssClass: 'ngx-org-vp',
                            image: 'assets/node.svg',
                            title: 'VP, Agency and Brand Solutions',
                            id: 100,
                            childs: []
                        },
                    ]
                },
            ]
        },
    ];
    datanodes: any = [];
    DataID: number;
    Type: number = 1; //1: luồng nhiệm vụ, 2: luồng tiến độ. 3: luồng nhiệm vụ trực tiếp

    constructor(
        public dialogRef: MatDialogRef<CongViecTheoDuAnChartComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private changeDetectorRef: ChangeDetectorRef,
        public congViecTheoDuAnService: MenuWorkService,
        public datepipe: DatePipe,
        public dialog: MatDialog,
        public _FormatTimeService: FormatTimeService,
        private auth: CookieService,
        private router: Router,
        public socketioStore: SocketioStore,
        public DanhMucChungService:DanhMucChungService
    ) {

    }
    ngOnInit(): void {
        this.UserID = this.congViecTheoDuAnService.getAuthFromLocalStorage().user.customData["jee-account"].userID;
        this.DataID = this.data._id;
        if (this.data._type)
            this.Type = this.data._type;
        if (this.Type == 1) {
            this.congViecTheoDuAnService.FlowChart(this.DataID).subscribe(res => {
                if (res && res.status == 1) {
                    if (res.data && res.data.length > 0) {
                        this.datanodes = res.data;
                    }
                } else {
                    this.datanodes = [];
                }
                this.changeDetectorRef.detectChanges();
            })
        }
        if (this.Type == 2) {
            this.congViecTheoDuAnService.FlowProgress(this.DataID).subscribe(res => {
                if (res && res.status == 1) {
                    if (res.data && res.data.length > 0) {
                        this.datanodes = res.data;
                    }
                } else {
                    this.datanodes = [];
                }
                this.changeDetectorRef.detectChanges();
            })
        }
        if (this.Type == 3) {
            this.congViecTheoDuAnService.FlowChartLive(this.DataID).subscribe(res => {
                if (res && res.status == 1) {
                    if (res.data && res.data.length > 0) {
                        this.datanodes = res.data;
                    }
                } else {
                    this.datanodes = [];
                }
                this.changeDetectorRef.detectChanges();
            })
        }
    }

    getTitle() {
        if (this.Type == 2)
            return 'Lịch sử cập nhật tiến độ';
        return 'Luồng '+this.DanhMucChungService.ts_congviec;
    }

    viewWork(item) {
        this.router.navigate(['', { outlets: { auxName: 'aux/detailWork/' + item.id_row }, }]);
    }

    close() {
        this.dialogRef.close();
    }
}