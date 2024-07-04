import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { CongViecTheoDuAnDetaisPopupComponent } from '../cong-viec-theo-du-an/cong-viec-theo-du-an-details-popup/cong-viec-theo-du-an-details-popup.component';
import { TranslationService } from 'projects/jeework-v1/src/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as viLang } from '../../../../../src/modules/i18n/vocabs/vi';

@Component({
    selector: 'app-auxiliary-router-jw-new',
    templateUrl: './auxiliary-router.component.html',
})
export class AuxiliaryRouterJeeWorkNewComponent implements OnInit {
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
            const param = params['paramid'];
            if (param.split("|").length == 2) {
                const ID = param.split("|")[0];
                const IDProject = param.split("|")[1];
                if (ID && ID > 0 && IDProject && IDProject > 0) {
                    this.openDialogJW(ID, IDProject);
                }
            }
        });
    }
    close() {
        this.router.navigate(['', { outlets: { auxNameV1: null } }]);
        AuxiliaryRouterJeeWorkNewComponent.dialogRef = null;
    }
    public static dialogRef = null;// chỗ này đem ra biến cục bộ dạng static đó! ý nghĩa là kt nếu đang tồn tại dialog này thì không cần kt code trong sub nữa! => hiện tại là cách fix tam thời (chưa tìm đc chỗ gây lỗi)
    openDialogJW(id, id_project) {
        AuxiliaryRouterJeeWorkNewComponent.dialogRef = this.dialog.open(CongViecTheoDuAnDetaisPopupComponent, {
            data: { _item: { _id: id, _id_project: id_project } },
            disableClose: true,
            panelClass: ['sky-padding-0', 'width90'],
            height: '90vh',
        });
        AuxiliaryRouterJeeWorkNewComponent.dialogRef.afterClosed().subscribe(result => {
            this.close();
            AuxiliaryRouterJeeWorkNewComponent.dialogRef = null;
        });
    }
}
