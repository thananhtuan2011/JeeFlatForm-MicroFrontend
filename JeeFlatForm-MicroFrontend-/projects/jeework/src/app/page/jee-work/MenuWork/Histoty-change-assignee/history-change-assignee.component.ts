import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { SocketioStore } from "src/app/_metronic/core/services/socketio.store";
import { MenuWorkService } from "../services/menu-work.services";
import { FormatTimeService } from "../../services/jee-format-time.component";
import { CookieService } from "ngx-cookie-service";

@Component({
    selector: 'app-history-change-assignee',
    templateUrl: './history-change-assignee.component.html',
    styleUrls: ["./history-change-assignee.component.scss"],
})
export class HistoryChangeAssignee implements OnInit {
    DataID: number;
    dt_history: any;

    constructor(
        public dialogRef: MatDialogRef<HistoryChangeAssignee>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private changeDetectorRef: ChangeDetectorRef,
        public congViecTheoDuAnService: MenuWorkService,
        public datepipe: DatePipe,
        public dialog: MatDialog,
        public _FormatTimeService: FormatTimeService,
        private auth: CookieService,
        private router: Router,
        public socketioStore: SocketioStore,
    ) {

    }
    ngOnInit(): void {
        this.DataID = this.data._id;
        this.congViecTheoDuAnService.HistoryChangeAssignee(this.DataID).subscribe(res => {
            if (res && res.status == 1) {
                if (res.data && res.data.length > 0) {
                    this.dt_history = res.data;                    
                }
            } else {
                this.dt_history = [];
            }
            this.changeDetectorRef.detectChanges();
        })
    }

    getTitle() {
        return 'Lịch sử chuyển xử lý nhiệm vụ';
    }

    viewWork(item) {
        this.router.navigate(['', { outlets: { auxName: 'aux/detailWork/' + item.id_row }, }]);
    }

    close() {
        this.dialogRef.close();
    }

    getHeight(): any {
        let tmp_height = document.getElementById("gridster-height36").clientHeight;
        tmp_height = tmp_height - 120;
        return tmp_height + "px";
      }
}