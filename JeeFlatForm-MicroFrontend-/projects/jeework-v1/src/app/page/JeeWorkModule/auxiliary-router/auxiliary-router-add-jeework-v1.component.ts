import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { CongViecTheoDuAnDetaisPopupComponent } from '../cong-viec-theo-du-an/cong-viec-theo-du-an-details-popup/cong-viec-theo-du-an-details-popup.component';
import { TranslationService } from 'projects/jeework-v1/src/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as viLang } from '../../../../../src/modules/i18n/vocabs/vi';
import { CongViecTheoDuAnVer1PopupComponent } from '../cong-viec-theo-du-an/cong-viec-theo-du-an-v1-popup/cong-viec-theo-du-an-v1-popup.component';
import { CongViecTheoDuAnPopupComponent } from '../cong-viec-theo-du-an/cong-viec-theo-du-an-popup/cong-viec-theo-du-an-popup.component';

@Component({
    selector: 'app-auxiliary-router-jw-new-v1',
    templateUrl: './auxiliary-router.component.html',
})
export class AuxiliaryRouterAddJeeWorkV1Component implements OnInit {
    loadingSubject = new BehaviorSubject<boolean>(true);
    loading$: Observable<boolean>;
    constructor(
        private router: Router,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private translationService: TranslationService,
        private translate: TranslateService,

    ) {
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
            const IDGOV = params['idgov'];
            if (IDGOV && IDGOV >= 0) {
                this.openDialogJW(IDGOV);
            }
        });
    }
    close() {
        this.router.navigate(['', { outlets: { auxNameV1: null } }]);
        AuxiliaryRouterAddJeeWorkV1Component.dialogRef = null;
    }
    public static dialogRef = null;// chỗ này đem ra biến cục bộ dạng static đó! ý nghĩa là kt nếu đang tồn tại dialog này thì không cần kt code trong sub nữa! => hiện tại là cách fix tam thời (chưa tìm đc chỗ gây lỗi)
    openDialogJW(idgov) {
        if (idgov == 1) {
            AuxiliaryRouterAddJeeWorkV1Component.dialogRef = this.dialog.open(CongViecTheoDuAnVer1PopupComponent, {
                data: { _item: {} },
                disableClose: true,
                panelClass: ['sky-padding-0', 'width900'],
                height: '90vh',
            });
            AuxiliaryRouterAddJeeWorkV1Component.dialogRef.afterClosed().subscribe(result => {
                this.close();
                AuxiliaryRouterAddJeeWorkV1Component.dialogRef = null;
            });
        } else {
            AuxiliaryRouterAddJeeWorkV1Component.dialogRef = this.dialog.open(CongViecTheoDuAnPopupComponent, {
                data: { _item: {} },
                disableClose: true,
                panelClass: ['sky-padding-0', 'width700'],
                height: '90vh',
            });
            AuxiliaryRouterAddJeeWorkV1Component.dialogRef.afterClosed().subscribe(result => {
                this.close();
                AuxiliaryRouterAddJeeWorkV1Component.dialogRef = null;
            });
        }

    }
}
