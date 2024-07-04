import {Component, OnInit, Inject, ChangeDetectionStrategy, HostListener, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators, FormControl, AbstractControl} from '@angular/forms';
import { TimezonePipe } from '../../pipe/timezone.pipe';
import { TranslateService } from '@ngx-translate/core';
import { MenuWorkService } from '../services/menu-work.services';
import { UpdateWorkModel } from '../../detail-task-component/detail-task-component.component';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';


@Component({
    selector: 'kt-log-work-description',
    templateUrl: './log-work-description.component.html',
    styleUrls: ['./log-work-description.component.scss'],
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
    showold:boolean=false;

    constructor(public dialogRef: MatDialogRef<LogWorkDescriptionComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private fb: FormBuilder,
                private changeDetectorRefs: ChangeDetectorRef,
                public _service: MenuWorkService,
                private _danhmucchung: DanhMucChungService,
                private translate: TranslateService,
                private layoutUtilsService: LayoutUtilsService,
                ) {

                }

    /** LOAD DATA */
    ngOnInit() {
        this._service.LogDetailByWork2(this.data.ID_log).subscribe(res => {
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

    filterConfiguration(): any {

        const filter: any = {};
        return filter;
    }
    isupdate:any;
    close() {
        this.dialogRef.close(this.isupdate);
    }
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
        item.id_row = this.data.ID_log;
        item.key = key;
        item.value = value;
        if (node.userId > 0) {
          item.IsStaff = true;
        }
        this._danhmucchung.updateTask(item).subscribe((res) => {
          if (res && res.status == 1) {
            this.isupdate=true;
            this.changeDetectorRefs.detectChanges();
          } else {
    
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
          }
        });
      }
}
