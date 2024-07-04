import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CongViecTheoDuAnService } from "../services/cong-viec-theo-du-an.services";
import { Router } from "@angular/router";
import { FormatTimeService } from "../../../services/jee-format-time.component";
import { HttpUtilsService } from "projects/jeework-v1/src/modules/crud/utils/http-utils.service";
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
    constructor(
        public dialogRef: MatDialogRef<CongViecTheoDuAnChartComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private changeDetectorRef: ChangeDetectorRef,
        public congViecTheoDuAnService: CongViecTheoDuAnService,
        public datepipe: DatePipe,
        public dialog: MatDialog,
        public _FormatTimeService: FormatTimeService,
        private httpUtils: HttpUtilsService,
        private router: Router,
    ) {

    }
    ngOnInit(): void {
        this.UserID = this.httpUtils.getUserID();
        this.DataID = this.data._id;
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

    viewWork(item) {
        this.router.navigate(['', { outlets: { auxName: 'aux/detailWork/' + item.id_row }, }]);
    }

    close() {
        this.dialogRef.close();
    }
}