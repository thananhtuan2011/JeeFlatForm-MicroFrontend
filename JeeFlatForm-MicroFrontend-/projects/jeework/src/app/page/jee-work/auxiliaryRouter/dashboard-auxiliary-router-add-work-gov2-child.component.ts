import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'projects/jeework/src/modules/i18n/translation.service';
import { locale as viLang } from '../../../../modules/i18n/vocabs/vi';
import { ThemMoiCongViecComponent } from '../MenuWork/them-moi-cong-viec/them-moi-cong-viec.component';
import { ThemMoiCongViecVer2Component } from '../MenuWork/them-moi-cong-viec-ver2/them-moi-cong-viec-ver2.component';
import { DanhMucChungService } from '../services/danhmuc.service';
import moment from 'moment';
@Component({
    selector: 'app-dashboard-auxiliary-router-add-work-gov2-child',
    templateUrl: './auxiliary-router.component.html',
})
export class DashboardAuxiliaryRouterAddWorkGOV2ChildComponent implements OnInit {
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
            this._danhmucChungServices.get_Detail_Task_Widget(+ params.id).subscribe(res => {
                if (res && res.status == 1) {
                    this.openDialog(res.data[0]);
                } else {
                    this.close();
                }
            })
        });
    }
    close() {
        this.router.navigate(['', { outlets: { auxName: null } }]);
        DashboardAuxiliaryRouterAddWorkGOV2ChildComponent.dialogRef = null;
    }
    public static dialogRef = null;// chỗ này đem ra biến cục bộ dạng static đó! ý nghĩa là kt nếu đang tồn tại dialog này thì không cần kt code trong sub nữa! => hiện tại là cách fix tam thời (chưa tìm đc chỗ gây lỗi)
    openDialog(data) {
        let dataDetailTask = {
            Gov_SoHieuVB: data.Gov_SoHieuVB,
            Gov_TrichYeuVB: data.Gov_TrichYeuVB,
            Gov_NgayVB: data.Gov_NgayVB,
            Gov_Nguoiky: data.Gov_Nguoiky,
            Gov_Donvibanhanh: data.Gov_Donvibanhanh,
            IsGiaoVB: data.IsGiaoVB,
            deadline: moment(data.deadline).format(
                'MM/DD/YYYY HH:mm'
            ),
            clickup_prioritize: data.clickup_prioritize,
            id_row: data.id_row,
        }
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            title: '',
            message: '',
            dataDetailTask: dataDetailTask,
        };
        dialogConfig.panelClass = ['my-custom-dialog-class', 'width900'];
        DashboardAuxiliaryRouterAddWorkGOV2ChildComponent.dialogRef = this.dialog.open(ThemMoiCongViecVer2Component, dialogConfig);
        DashboardAuxiliaryRouterAddWorkGOV2ChildComponent.dialogRef.afterClosed().subscribe(result => {
            const busEvent = new CustomEvent('event-reload-widget', {
                bubbles: true,
                detail: {
                    eventType: 'load-data',
                    customData: 'Load list widget'
                }
            });
            dispatchEvent(busEvent);
            this.close();
            DashboardAuxiliaryRouterAddWorkGOV2ChildComponent.dialogRef = null;
        });
    }
}
