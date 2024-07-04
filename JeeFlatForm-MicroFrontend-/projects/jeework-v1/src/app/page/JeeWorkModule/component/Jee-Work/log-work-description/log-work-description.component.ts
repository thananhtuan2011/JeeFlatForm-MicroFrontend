import {TimezonePipe} from './../pipe/timezone.pipe';
import {Component, OnInit, Inject, ChangeDetectorRef} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import { WeWorkService, WorkService } from '../jee-work.servide';
import { UpdateWorkModel } from '../jee-work.model';
import { LayoutUtilsService, MessageType } from 'projects/jeework-v1/src/modules/crud/utils/layout-utils.service';

@Component({
    selector: 'kt-log-work-description',
    templateUrl: './log-work-description.component.html',
    providers: [TimezonePipe],
})

export class LogWorkDescriptionComponent implements OnInit {
    item: any[];
    hasFormErrors: boolean = false;
    viewLoading: boolean = false;
    loadingAfterSubmit: boolean = false;
    disabledBtn: boolean = false;
    show_detail: boolean = false;
    id: number = 0;

    constructor(public dialogRef: MatDialogRef<LogWorkDescriptionComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private changeDetectorRefs: ChangeDetectorRef,
                private _service: WorkService,
                private translate: TranslateService,
                public WeWorkService: WeWorkService,
                public layoutUtilsService:LayoutUtilsService,
                private router: Router,) {
    }

    /** LOAD DATA */
    ngOnInit() {
        this._service.LogDetailByWork(this.data.ID_log).subscribe(res => {
            if (res && res.status == 1) {
                this.item = res.data;
                this.item = this.item.filter(x => x.id_action == 16).sort((a, b) => this.compair(a.id_row, b.id_row) ? 1 : this.compair(b.id_row, a.id_row) ? -1 : 0);
                this.changeDetectorRefs.detectChanges();
            } else {
            }
        });
    }

    compair(a, b) {
        if (a < b) {
            return true;
        }
        return false;
    }

    /** UI */
    getTitle(): string {
        let result = this.translate.instant('filter.logdetaildescription');
        return result;
    }

    /** ACTIONS */
    isLoad:boolean=false;
    ShowDetail(val) {
        this.id = val.id_row;
        this.show_detail = !this.show_detail;
        this.UpdateByKey(val, "description", val.newvalue);
        this.close();
    }
    UpdateByKey(node, key, value) {
        // if (!this.KiemTraThayDoiCongViec(+, key)) {
        //   return;
        // }
        const item = new UpdateWorkModel();
        item.id_row = node.object_id;
        item.key = key;
        item.value = value;
        if (node.userId > 0) {
          item.IsStaff = true;
        }
        this._service._UpdateByKey(item).subscribe((res) => {
          if (res && res.status == 1) {
            this.isLoad=true;
            this.changeDetectorRefs.detectChanges();
          } else {
    
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
          }
        });
      }

    filterConfiguration(): any {

        const filter: any = {};
        return filter;
    }

    close() {
        this.dialogRef.close(this.isLoad);
    }

}
