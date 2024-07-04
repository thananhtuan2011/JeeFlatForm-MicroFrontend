import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'projects/jeework/src/modules/i18n/translation.service';
import { locale as viLang } from '../../../../modules/i18n/vocabs/vi';
import { DanhMucChungService } from '../services/danhmuc.service';
import { EditorUrgesComponent } from '../MenuWork/editor-urges/editor-urges';
import { ReasonFormComponent } from '../MenuWork/reason-form/reason-form.component';

@Component({
    selector: 'app-dashboard-auxiliary-router-delete-task',
    templateUrl: './auxiliary-router.component.html',
})
export class DashboardAuxiliaryRouterDeleteTaskComponent implements OnInit {
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
            if (params.type == "delete") {
                this._danhmucChungServices.get_Detail_Task_Widget(+ params.id).subscribe(res => {
                    if (res && res.status == 1) {
                        this.openDialog(res.data[0]);
                    } else {
                        this.close();
                    }
                })
            } else {
                this.close();
            }

        });
    }
    close() {
        this.router.navigate(['', { outlets: { auxName: null } }]);
        DashboardAuxiliaryRouterDeleteTaskComponent.dialogRef = null;
    }
    public static dialogRef = null;// chỗ này đem ra biến cục bộ dạng static đó! ý nghĩa là kt nếu đang tồn tại dialog này thì không cần kt code trong sub nữa! => hiện tại là cách fix tam thời (chưa tìm đc chỗ gây lỗi)
    openDialog(data: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            _id: data.id_row
        };
        dialogConfig.panelClass = ['sky-padding-0', 'width600'];
        DashboardAuxiliaryRouterDeleteTaskComponent.dialogRef = this.dialog.open(ReasonFormComponent, dialogConfig);
        DashboardAuxiliaryRouterDeleteTaskComponent.dialogRef.componentInstance.is_urges = true;
        DashboardAuxiliaryRouterDeleteTaskComponent.dialogRef.afterClosed().subscribe(result => {
            if (result != undefined) {
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
            DashboardAuxiliaryRouterDeleteTaskComponent.dialogRef = null;
        });
    }
}
