import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'projects/jeework/src/modules/i18n/translation.service';
import { locale as viLang } from '../../../../modules/i18n/vocabs/vi';
import { DetailTaskComponentComponent } from '../detail-task-component/detail-task-component.component';
import { DetailTaskV2ComponentComponent } from '../detail-task-v2-component/detail-task-v2-component.component';
import { environment } from 'projects/jeework/src/environments/environment';

@Component({
    selector: 'app-auxiliary-router-details-work',
    templateUrl: './auxiliary-router.component.html',
})
export class AuxiliaryRouterDetailsWorkGOVComponent implements OnInit {
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
    linkApp:any;
    ngOnInit() {
        this.linkApp=window.location.href.split('/')[2];
        this.loading$ = this.loadingSubject.asObservable();
        this.loadingSubject.next(true);
        this.activatedRoute.params.subscribe(async params => {
            this.loadingSubject.next(false);
            var obj = JSON.parse(localStorage.getItem('appCode')).find(x => x == "VTSWORK");
            if ((obj && localStorage.getItem('istaskbarcustomerID') == "1") || this.linkApp==environment.Key_Soffice) {
                this.openDialogV2(+params.id);
            } else {
                this.openDialog(+params.id);
            }
        });
    }
    close() {
        this.router.navigate(['', { outlets: { auxName: null } }]);
        AuxiliaryRouterDetailsWorkGOVComponent.dialogRef = null;
    }
    public static dialogRef = null;// chỗ này đem ra biến cục bộ dạng static đó! ý nghĩa là kt nếu đang tồn tại dialog này thì không cần kt code trong sub nữa! => hiện tại là cách fix tam thời (chưa tìm đc chỗ gây lỗi)
    openDialog(id) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.data = {
            title: '',
            message: '',
            id_row: id,
            isPopup: true
        };
        dialogConfig.width = '90%';
        dialogConfig.panelClass = ['pn-detail-work'];
        AuxiliaryRouterDetailsWorkGOVComponent.dialogRef = this.dialog.open(DetailTaskComponentComponent, dialogConfig);
        AuxiliaryRouterDetailsWorkGOVComponent.dialogRef.afterClosed().subscribe(result => {
            const busEvent = new CustomEvent('event-reload-widget', {
                bubbles: true,
                detail: {
                    eventType: 'load-data',
                    customData: 'Load list widget'
                }
            });
            dispatchEvent(busEvent);
            this.close();
            AuxiliaryRouterDetailsWorkGOVComponent.dialogRef = null;
        });
    }

    openDialogV2(id) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.data = {
            title: '',
            message: '',
            id_row: id,
            isPopup: true
        };
        dialogConfig.width = '90%';
        dialogConfig.panelClass = ['pn-detail-work'];
        AuxiliaryRouterDetailsWorkGOVComponent.dialogRef = this.dialog.open(DetailTaskV2ComponentComponent, dialogConfig);
        AuxiliaryRouterDetailsWorkGOVComponent.dialogRef.afterClosed().subscribe(result => {
            const busEvent = new CustomEvent('event-reload-widget', {
                bubbles: true,
                detail: {
                    eventType: 'load-data',
                    customData: 'Load list widget'
                }
            });
            dispatchEvent(busEvent);
            this.close();
            AuxiliaryRouterDetailsWorkGOVComponent.dialogRef = null;
        });
    }
}
