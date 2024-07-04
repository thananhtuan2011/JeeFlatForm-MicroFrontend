import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { locale as viLang } from '../../../../../src/modules/i18n/vocabs/vi';
import { TranslationService } from 'projects/jeework-v1/src/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { CongViecTheoDuAnDetaisPopupComponent } from '../cong-viec-theo-du-an/cong-viec-theo-du-an-details-popup/cong-viec-theo-du-an-details-popup.component';
import { LayoutUtilsService, MessageType } from 'projects/jeework-v1/src/modules/crud/utils/layout-utils.service';
import { CongViecTheoDuAnService } from '../cong-viec-theo-du-an/services/cong-viec-theo-du-an.services';

@Component({
    selector: 'app-auxiliary-router-jw',
    templateUrl: './auxiliary-router.component.html',
})
export class AuxiliaryRouterJeeWorkComponent implements OnInit {
    loadingSubject = new BehaviorSubject<boolean>(true);
    loading$: Observable<boolean>;
    constructor(
        private router: Router,
        public dialog: MatDialog,
        public congViecTheoDuAnService: CongViecTheoDuAnService,
        private activatedRoute: ActivatedRoute,
        private layoutUtilsService: LayoutUtilsService,
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
            const ID = params['id'];
            if (ID && ID > 0) {
                this.congViecTheoDuAnService.WorkDetail(ID).subscribe(res => {
                    if (res && res.status === 1) {
                        this.openDialogJW(res.data.id_row, res.data.id_project_team);
                    } else {
                        this.close();
                        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
                    }
                });
            }
        });
    }
    close() {
        this.router.navigate(['', { outlets: { auxNameV1: null } }]);
        AuxiliaryRouterJeeWorkComponent.dialogRef = null;
    }
    public static dialogRef = null;// chỗ này đem ra biến cục bộ dạng static đó! ý nghĩa là kt nếu đang tồn tại dialog này thì không cần kt code trong sub nữa! => hiện tại là cách fix tam thời (chưa tìm đc chỗ gây lỗi)
    openDialogJW(id, id_project) {
        AuxiliaryRouterJeeWorkComponent.dialogRef = this.dialog.open(CongViecTheoDuAnDetaisPopupComponent, {
            data: { _item: { _id: id, _id_project: id_project } },
            disableClose: true,
            panelClass: ['sky-padding-0', 'width90'],
            height: '90vh',
        });
        AuxiliaryRouterJeeWorkComponent.dialogRef.afterClosed().subscribe(result => {
            this.close();
            AuxiliaryRouterJeeWorkComponent.dialogRef = null;
        });
    }
}
