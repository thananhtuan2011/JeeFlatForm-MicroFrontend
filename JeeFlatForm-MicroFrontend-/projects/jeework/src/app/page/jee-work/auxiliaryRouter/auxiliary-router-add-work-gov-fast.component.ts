import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'projects/jeework/src/modules/i18n/translation.service';
import { locale as viLang } from '../../../../modules/i18n/vocabs/vi';
import { ThemMoiCongViecComponent } from '../MenuWork/them-moi-cong-viec/them-moi-cong-viec.component';
import { ThemMoiCongViecVer2Component } from '../MenuWork/them-moi-cong-viec-ver2/them-moi-cong-viec-ver2.component';
import { ThemMoiCongViecVer3Component } from '../MenuWork/them-moi-cong-viec-ver3/them-moi-cong-viec-ver3.component';
import { environment } from 'projects/jeework/src/environments/environment';

@Component({
    selector: 'app-auxiliary-router-add-work',
    templateUrl: './auxiliary-router.component.html',
})
export class AuxiliaryRouterAddWorkGOV2Component implements OnInit {
    loadingSubject = new BehaviorSubject<boolean>(true);
    loading$: Observable<boolean>;
    linkApp:any;
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
            if (+params.id == 0) {
                this.openDialog();
            }
        });
    }
    close() {
        this.router.navigate(['', { outlets: { auxName: null } }]);
        AuxiliaryRouterAddWorkGOV2Component.dialogRef = null;
    }
    public static dialogRef = null;// chỗ này đem ra biến cục bộ dạng static đó! ý nghĩa là kt nếu đang tồn tại dialog này thì không cần kt code trong sub nữa! => hiện tại là cách fix tam thời (chưa tìm đc chỗ gây lỗi)
    openDialog() {
        let item;
        this.linkApp = window.location.href.split('/')[2];
        if (this.linkApp == environment.Key_Soffice) {//app.csstech.vnlocalhost:1200
            item = ThemMoiCongViecVer3Component;
        }
        else {
            item = ThemMoiCongViecVer2Component;
        }
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            title: '',
            message: '',
        };
        dialogConfig.panelClass = ['my-custom-dialog-class', 'width900'];
        AuxiliaryRouterAddWorkGOV2Component.dialogRef = this.dialog.open(item, dialogConfig);
        AuxiliaryRouterAddWorkGOV2Component.dialogRef.afterClosed().subscribe(result => {
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
            AuxiliaryRouterAddWorkGOV2Component.dialogRef = null;
        });
    }
}
