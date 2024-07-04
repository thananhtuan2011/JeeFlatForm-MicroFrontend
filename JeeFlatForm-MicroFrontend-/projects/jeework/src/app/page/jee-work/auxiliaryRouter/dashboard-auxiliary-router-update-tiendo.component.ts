import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'projects/jeework/src/modules/i18n/translation.service';
import { locale as viLang } from '../../../../modules/i18n/vocabs/vi';
import { EditorJeeWorkComponent } from '../MenuWork/editor-jeework/editor-jeework';
import { DanhMucChungService } from '../services/danhmuc.service';

@Component({
    selector: 'app-dashboard-auxiliary-router-update-tiendo',
    templateUrl: './auxiliary-router.component.html',
})
export class DashboardAuxiliaryRouterUpdateTienDoComponent implements OnInit {
    loadingSubject = new BehaviorSubject<boolean>(true);
    loading$: Observable<boolean>;
    constructor(
        private router: Router,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private translationService: TranslationService,
        private translate: TranslateService,
        public _danhmucChungServices: DanhMucChungService,
    ) {
        const snapshot: RouterStateSnapshot = router.routerState.snapshot;
        this.translationService.loadTranslations(
            viLang,
        );
        var langcode = localStorage.getItem('language');
        if (langcode == null)
            langcode = this.translate.getDefaultLang();
        this.translationService.setLanguage(langcode);
    }
    ngOnInit() {
        this.loading$ = this.loadingSubject.asObservable();
        this.loadingSubject.next(true);
        this.activatedRoute.params.subscribe(async params => {
            this.loadingSubject.next(false);
            if (params.type == "progress") {
                this._danhmucChungServices.get_Detail_Task_Widget(+ params.id).subscribe(res => {
                    if (res && res.status == 1) {
                        this.openDialogProgress(res.data[0]);
                    } else {
                        this.close();
                    }
                })
            } else if (params.type == "status") {
                this.openDialogStatus(params.id, params.idSTT, params.nameSTT);
            } else {
                this.close();
            }

        });
    }
    close() {
        this.router.navigate(['', { outlets: { auxName: null } }]);
        DashboardAuxiliaryRouterUpdateTienDoComponent.dialogRef = null;
    }
    public static dialogRef = null;// chỗ này đem ra biến cục bộ dạng static đó! ý nghĩa là kt nếu đang tồn tại dialog này thì không cần kt code trong sub nữa! => hiện tại là cách fix tam thời (chưa tìm đc chỗ gây lỗi)
    openDialogProgress(data: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            _value: data.progress, id_task: data.id_row,
            isProgress: this._danhmucChungServices.CheckRule(data.Rule, '24'), type: data.StatusInfo[0].Type,
            Doccument_Result: data.Doccument_Result,
        };
        dialogConfig.panelClass = ['sky-padding-0', 'width700'];
        DashboardAuxiliaryRouterUpdateTienDoComponent.dialogRef = this.dialog.open(EditorJeeWorkComponent, dialogConfig);
        DashboardAuxiliaryRouterUpdateTienDoComponent.dialogRef.componentInstance.is_tiendo = true;
        DashboardAuxiliaryRouterUpdateTienDoComponent.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const busEvent = new CustomEvent('event-reload-widget', {
                    bubbles: true,
                    detail: {
                        eventType: 'load-data',
                        customData: 'Load list widget'
                    }
                });
                dispatchEvent(busEvent);
            }
            this.close();
            DashboardAuxiliaryRouterUpdateTienDoComponent.dialogRef = null;
        });
    }

    openDialogStatus(id, idstt, statusname) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            __value: 'status', statusname: statusname
        };
        dialogConfig.panelClass = ['sky-padding-0', 'width700'];
        DashboardAuxiliaryRouterUpdateTienDoComponent.dialogRef = this.dialog.open(EditorJeeWorkComponent, dialogConfig);
        DashboardAuxiliaryRouterUpdateTienDoComponent.dialogRef.componentInstance.is_status = true;
        DashboardAuxiliaryRouterUpdateTienDoComponent.dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let val = {
                    id_row: id,
                    ReasonRefuse: result._result
                }
                this.updateItem(val, idstt, 'status');
            }
            this.close();
            DashboardAuxiliaryRouterUpdateTienDoComponent.dialogRef = null;
        });
    }

    updateItem(val: any, newvalue: any, key: any) {
        let item = { values: [], id_row: val.id_row, key: key, value: newvalue, ReasonRefuse: val.ReasonRefuse };
        this._danhmucChungServices.updateTask(item).subscribe((res) => {
            if (res && res.status == 1) {
                const busEvent = new CustomEvent('event-reload-widget', {
                    bubbles: true,
                    detail: {
                        eventType: 'load-data',
                        customData: 'Load list widget'
                    }
                });
                dispatchEvent(busEvent);
            }
        });
    }
}
