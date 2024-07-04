import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { SocketioStore } from "src/app/_metronic/core/services/socketio.store";
import { MenuWorkService } from "../services/menu-work.services";
import { FormatTimeService } from "../../services/jee-format-time.component";
import { CookieService } from "ngx-cookie-service";

@Component({
    selector: 'app-cong-viec-tu-choi-history',
    templateUrl: './cong-viec-tu-choi-history.component.html',
    styleUrls: ["./cong-viec-tu-choi-history.component.scss"],
})
export class CongViecTuChoiHistoryComponent implements OnInit {
    DataID: number;
    dt_history: any;

    constructor(
        public dialogRef: MatDialogRef<CongViecTuChoiHistoryComponent>,
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
        this.congViecTheoDuAnService.HistoryRefuse(this.DataID).subscribe(res => {
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
        return 'Lịch sử từ chối';
    }

    viewWork(item) {
        this.router.navigate(['', { outlets: { auxName: 'aux/detailWork/' + item.id_row }, }]);
    }

    close() {
        this.dialogRef.close();
    }

    getTitleHistory(val){
        if(val.StatusID!=0){
            return 'đã cập nhật trạng thái';
        }
        return '';
    }
}