import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'projects/jeework/src/modules/i18n/translation.service';
import { locale as viLang } from '../../../../modules/i18n/vocabs/vi';
import { ListNhiemVuPopupComponent } from '../MenuWork/panel-dashboard/list-nhiem-vu-popup/list-nhiem-vu-popup.component';
import { ListNhiemVuPopupV2Component } from '../MenuWork/panel-dashboard/list-nhiem-vu-popup-v2/list-nhiem-vu-popup-v2.component';

@Component({
    selector: 'app-auxiliary-router-list-work',
    templateUrl: './auxiliary-router.component.html',
})
export class AuxiliaryRouterListWorkGOVComponent implements OnInit {
    loadingSubject = new BehaviorSubject<boolean>(true);
    loading$: Observable<boolean>;
    TuNgay:any;
    DenNgay:any;
    collect_by:any;
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
        this.TuNgay=window.history.state.TuNgay!=undefined?window.history.state.TuNgay:'';
        this.DenNgay=window.history.state.DenNgay!=undefined?window.history.state.DenNgay:'';
        this.collect_by = window.history.state.collect_by!=undefined?window.history.state.collect_by:'';
    }
    ngOnInit() {
        this.loading$ = this.loadingSubject.asObservable();
        this.loadingSubject.next(true);
        this.activatedRoute.params.subscribe(async params => {
            this.loadingSubject.next(false);
            if ((params.loaicongviec && +params.loaicongviec > 0) && (params.id_project_team && (+params.id_project_team >= 0 || +params.id_project_team == -1)) && (params.tien_do && +params.tien_do >= 0)) {
                if (params.loaicongviec == 12 || params.loaicongviec == 13 || params.loaicongviec == 11 || params.loaicongviec == 14 || params.loaicongviec == 15 || params.loaicongviec == 16 || params.loaicongviec == 17 || params.loaicongviec == 18 || params.loaicongviec == 19) {
                    var obj = JSON.parse(localStorage.getItem('appCode')).find(x => x == "VTSWORK");
                    if (obj && localStorage.getItem('istaskbarcustomerID') == "1") {
                        this.openDialogReportVTSWORK(+params.loaicongviec, +params.id_project_team, +params.id_department, +params.tien_do, +params.id_user);
                    } else {
                        this.openDialogReport(+params.loaicongviec, +params.id_project_team, +params.id_department, +params.tien_do, +params.id_user);
                    }
                }

                else if (params.id_user && +params.id_user > 0) {
                    this.openDialogUser(+params.loaicongviec, +params.id_project_team, +params.tien_do, +params.id_user);

                }
                else if(params.loaicongviec == 25){
                    this.openDialogDN(+params.loaicongviec, +params.id_project_team, +params.tien_do,+params.id_nv,+params.type_filter,+params.type_filter);
                }
                else {
                    // this.openDialog(+params.loaicongviec, +params.id_project_team, +params.tien_do);
                    var obj = JSON.parse(localStorage.getItem('appCode')).find(x => x == "VTSWORK");
                    if (obj && localStorage.getItem('istaskbarcustomerID') == "1") {
                        this.openDialogVTSWORK(+params.loaicongviec, +params.id_project_team, +params.tien_do);
                    } else {
                        this.openDialog(+params.loaicongviec, +params.id_project_team, +params.tien_do);
                    }
                }
            } else {
                this.close();
            }
        });
    }
    close() {
        this.router.navigate(['', { outlets: { auxName: null } }]);
        AuxiliaryRouterListWorkGOVComponent.dialogRef = null;
    }
    public static dialogRef = null;// chỗ này đem ra biến cục bộ dạng static đó! ý nghĩa là kt nếu đang tồn tại dialog này thì không cần kt code trong sub nữa! => hiện tại là cách fix tam thời (chưa tìm đc chỗ gây lỗi)
    openDialog(loaicongviec, id_project_team, tien_do) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            title: '',
            message: '',
            isPopup: true,
            id_project_team: id_project_team,
            tien_do: tien_do,
            loaicongviec: loaicongviec,
        };
        dialogConfig.width = '80vw';
        dialogConfig.panelClass = 'sky-padding-0';
        dialogConfig.autoFocus = false; //ko focus btn Trở lại
        AuxiliaryRouterListWorkGOVComponent.dialogRef = this.dialog.open(ListNhiemVuPopupComponent, dialogConfig);
        AuxiliaryRouterListWorkGOVComponent.dialogRef.afterClosed().subscribe(result => {
            this.close();
            AuxiliaryRouterListWorkGOVComponent.dialogRef = null;
        });
    }

    openDialogUser(loaicongviec, id_project_team, tien_do, id_user) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            title: '',
            message: '',
            isPopup: true,
            id_project_team: id_project_team,
            tien_do: tien_do,
            loaicongviec: loaicongviec,
            id_user: id_user,
        };
        dialogConfig.width = '80vw';
        dialogConfig.panelClass = 'sky-padding-0';
        dialogConfig.autoFocus = false;
        AuxiliaryRouterListWorkGOVComponent.dialogRef = this.dialog.open(ListNhiemVuPopupComponent, dialogConfig);
        AuxiliaryRouterListWorkGOVComponent.dialogRef.afterClosed().subscribe(result => {
            this.close();
            AuxiliaryRouterListWorkGOVComponent.dialogRef = null;
        });
    }

    openDialogReport(loaicongviec, id_project_team, id_department, tien_do, id_user) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            title: '',
            message: '',
            isPopup: true,
            id_department: id_department,
            id_project_team: id_project_team,
            tien_do: tien_do,
            loaicongviec: loaicongviec,
            id_user: id_user,
        };
        dialogConfig.width = '80vw';
        dialogConfig.panelClass = 'sky-padding-0';
        dialogConfig.autoFocus = false;
        AuxiliaryRouterListWorkGOVComponent.dialogRef = this.dialog.open(ListNhiemVuPopupComponent, dialogConfig);
        AuxiliaryRouterListWorkGOVComponent.dialogRef.afterClosed().subscribe(result => {
            this.close();
            AuxiliaryRouterListWorkGOVComponent.dialogRef = null;
        });
    }

    //=============Gọi form xử lý cho các trường hợp có app code VTSWORK========================
    openDialogVTSWORK(loaicongviec, id_project_team, tien_do) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            title: '',
            message: '',
            isPopup: true,
            id_project_team: id_project_team,
            tien_do: tien_do,
            loaicongviec: loaicongviec,
        };
        dialogConfig.width = '80vw';
        dialogConfig.panelClass = 'sky-padding-0';
        dialogConfig.autoFocus = false; //ko focus btn Trở lại
        AuxiliaryRouterListWorkGOVComponent.dialogRef = this.dialog.open(ListNhiemVuPopupV2Component, dialogConfig);
        AuxiliaryRouterListWorkGOVComponent.dialogRef.afterClosed().subscribe(result => {
            this.close();
            AuxiliaryRouterListWorkGOVComponent.dialogRef = null;
        });
    }

    openDialogReportVTSWORK(loaicongviec, id_project_team, id_department, tien_do, id_user) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            title: '',
            message: '',
            isPopup: true,
            id_department: id_department,
            id_project_team: id_project_team,
            tien_do: tien_do,
            loaicongviec: loaicongviec,
            id_user: id_user,
            TuNgay:this.TuNgay,
            DenNgay:this.DenNgay,
            collect_by:this.collect_by,
        };
        dialogConfig.width = '80vw';
        dialogConfig.panelClass = 'sky-padding-0';
        dialogConfig.autoFocus = false;
        AuxiliaryRouterListWorkGOVComponent.dialogRef = this.dialog.open(ListNhiemVuPopupV2Component, dialogConfig);
        AuxiliaryRouterListWorkGOVComponent.dialogRef.afterClosed().subscribe(result => {
            this.close();
            AuxiliaryRouterListWorkGOVComponent.dialogRef = null;
        });
    }
    //Học thêm ngày 19/2/2024
    openDialogDN(loaicongviec, id_project_team, tien_do,id_nv,type_staff,type_filter) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            title: '',
            message: '',
            isPopup: true,
            id_project_team: id_project_team,
            tien_do: tien_do,
            loaicongviec: loaicongviec,
            isDN:true,
            type_staff:type_staff,
            type_filter:type_filter,
            TuNgay:this.TuNgay,
            DenNgay:this.DenNgay,
            id_nv:id_nv,
        };
        dialogConfig.width = '80vw';
        dialogConfig.panelClass = 'sky-padding-0';
        dialogConfig.autoFocus = false; //ko focus btn Trở lại
        AuxiliaryRouterListWorkGOVComponent.dialogRef = this.dialog.open(ListNhiemVuPopupComponent, dialogConfig);
        AuxiliaryRouterListWorkGOVComponent.dialogRef.afterClosed().subscribe(result => {
            this.close();
            AuxiliaryRouterListWorkGOVComponent.dialogRef = null;
        });
    }
}
