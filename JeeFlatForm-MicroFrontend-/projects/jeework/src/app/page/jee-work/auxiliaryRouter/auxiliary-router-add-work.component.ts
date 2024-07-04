import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ThemMoiCongViecKhongVanBanComponent } from '../MenuWork/them-moi-cong-viec-khong-van-ban/them-moi-cong-viec-khong-van-ban.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'projects/jeework/src/modules/i18n/translation.service';
import { locale as viLang } from '../../../../../src/modules/i18n/vocabs/vi';

@Component({
    selector: 'app-auxiliary-router-add-work',
    templateUrl: './auxiliary-router.component.html',
})
export class AuxiliaryRouterAddWorkComponent implements OnInit {
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
            this.openDialog();
        });
    }
    close() {
        this.router.navigate(['', { outlets: { auxName: null } }]);
        AuxiliaryRouterAddWorkComponent.dialogRef = null;
    }
    public static dialogRef = null;// chỗ này đem ra biến cục bộ dạng static đó! ý nghĩa là kt nếu đang tồn tại dialog này thì không cần kt code trong sub nữa! => hiện tại là cách fix tam thời (chưa tìm đc chỗ gây lỗi)
    openDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            title: '',
            message: '',
        };
        // dialogConfig.width = '40vw';
        dialogConfig.panelClass =  ['my-custom-dialog-class', 'width700'];;
        AuxiliaryRouterAddWorkComponent.dialogRef = this.dialog.open(ThemMoiCongViecKhongVanBanComponent, dialogConfig);
        AuxiliaryRouterAddWorkComponent.dialogRef.afterClosed().subscribe(result => {
            this.close();
            AuxiliaryRouterAddWorkComponent.dialogRef = null;
        });
    }
}
