import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'projects/jeework/src/modules/i18n/translation.service';
import { locale as viLang } from '../../../../modules/i18n/vocabs/vi';
import { ListNhiemVuPopupComponent } from '../MenuWork/panel-dashboard/list-nhiem-vu-popup/list-nhiem-vu-popup.component';
import { ListNhiemVuPopupV2Component } from '../MenuWork/panel-dashboard/list-nhiem-vu-popup-v2/list-nhiem-vu-popup-v2.component';
import { ListNhiemVuPopupV2ChildComponent } from '../MenuWork/panel-dashboard/list-nhiem-vu-popup-v2-child/list-nhiem-vu-popup-v2-child.component';

@Component({
    selector: 'app-dashboard-auxiliary-router-list-work-child',
    templateUrl: './auxiliary-router.component.html',
})
export class DashboardAuxiliaryRouterListWorkGOVChildComponent implements OnInit {
    loadingSubject = new BehaviorSubject<boolean>(true);
    loading$: Observable<boolean>;
    constructor(
        private router: Router,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private translationService: TranslationService,
        private translate: TranslateService,
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
            if (params.id && +params.id > 0) {
                this.openDialog(+params.id);
            } else {
                this.close();
            }
        });
    }
    close() {
        this.router.navigate(['', { outlets: { auxName: null } }]);
        DashboardAuxiliaryRouterListWorkGOVChildComponent.dialogRef = null;
    }
    public static dialogRef = null;// chỗ này đem ra biến cục bộ dạng static đó! ý nghĩa là kt nếu đang tồn tại dialog này thì không cần kt code trong sub nữa! => hiện tại là cách fix tam thời (chưa tìm đc chỗ gây lỗi)
    openDialog(id) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            title: '',
            message: '',
            isPopup: true,
            id: id,
        };
        dialogConfig.width = '80vw';
        dialogConfig.panelClass = 'sky-padding-0';
        dialogConfig.autoFocus = false; //ko focus btn Trở lại
        DashboardAuxiliaryRouterListWorkGOVChildComponent.dialogRef = this.dialog.open(ListNhiemVuPopupV2ChildComponent, dialogConfig);
        DashboardAuxiliaryRouterListWorkGOVChildComponent.dialogRef.afterClosed().subscribe(result => {
            const busEvent = new CustomEvent('event-reload-widget', {
                bubbles: true,
                detail: {
                    eventType: 'load-data',
                    customData: 'Load list widget'
                }
            });
            dispatchEvent(busEvent);
            this.close();
            DashboardAuxiliaryRouterListWorkGOVChildComponent.dialogRef = null;
        });
    }
}
