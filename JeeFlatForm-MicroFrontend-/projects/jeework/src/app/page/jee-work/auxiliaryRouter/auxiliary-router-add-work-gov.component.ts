import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'projects/jeework/src/modules/i18n/translation.service';
import { locale as viLang } from '../../../../modules/i18n/vocabs/vi';
import { ThemMoiCongViecComponent } from '../MenuWork/them-moi-cong-viec/them-moi-cong-viec.component';

@Component({
    selector: 'app-auxiliary-router-add-work',
    templateUrl: './auxiliary-router.component.html',
})
export class AuxiliaryRouterAddWorkGOVComponent implements OnInit {
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
            if (+params.id == 0) {
                this.openDialog();
            } else {
                this.openDialogDraff(+params.id);
            }
        });
    }
    close() {
        this.router.navigate(['', { outlets: { auxName: null } }]);
        AuxiliaryRouterAddWorkGOVComponent.dialogRef = null;
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
        dialogConfig.panelClass = ['my-custom-dialog-class', 'width900'];
        AuxiliaryRouterAddWorkGOVComponent.dialogRef = this.dialog.open(ThemMoiCongViecComponent, dialogConfig);
        AuxiliaryRouterAddWorkGOVComponent.dialogRef.afterClosed().subscribe(result => {
            const busEvent = new CustomEvent('event-reload-widget', {
                bubbles: true,
                detail: {
                    eventType: 'load-data',
                    customData: 'Load list widget'
                }
            });
            this.close();
            AuxiliaryRouterAddWorkGOVComponent.dialogRef = null;
        });
    }

    openDialogDraff(id) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            title: '',
            message: '',
            idDraft: id,
        };
        dialogConfig.panelClass = ['my-custom-dialog-class', 'width900'];
        AuxiliaryRouterAddWorkGOVComponent.dialogRef = this.dialog.open(ThemMoiCongViecComponent, dialogConfig);
        AuxiliaryRouterAddWorkGOVComponent.dialogRef.afterClosed().subscribe(result => {
            const busEvent = new CustomEvent('event-reload-widget', {
                bubbles: true,
                detail: {
                    eventType: 'load-draff',
                    customData: 'Load list widget'
                }
            });
            dispatchEvent(busEvent);
            this.close();
            AuxiliaryRouterAddWorkGOVComponent.dialogRef = null;
        });
    }
}
