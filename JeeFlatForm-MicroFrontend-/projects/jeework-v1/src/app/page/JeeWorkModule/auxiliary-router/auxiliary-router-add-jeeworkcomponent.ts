import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { LayoutUtilsService, MessageType } from "projects/jeework-v1/src/modules/crud/utils/layout-utils.service";
import { CongViecTheoDuAnDetaisPopupComponent } from '../cong-viec-theo-du-an/cong-viec-theo-du-an-details-popup/cong-viec-theo-du-an-details-popup.component';
import { TranslationService } from 'projects/jeework-v1/src/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as viLang } from '../../../../../src/modules/i18n/vocabs/vi';
import { CongViecTheoDuAnVer1PopupComponent } from '../cong-viec-theo-du-an/cong-viec-theo-du-an-v1-popup/cong-viec-theo-du-an-v1-popup.component';
import { CongViecTheoDuAnPopupComponent } from '../cong-viec-theo-du-an/cong-viec-theo-du-an-popup/cong-viec-theo-du-an-popup.component';
import { AUXService } from './aux_service.service';

@Component({
    selector: 'app-auxiliary-router-jw-new',
    templateUrl: './auxiliary-router.component.html',
})
export class AuxiliaryRouterAddJeeWorkComponent implements OnInit {
    loadingSubject = new BehaviorSubject<boolean>(true);
    loading$: Observable<boolean>;
    IteamChat: any
    isGroup: boolean;
    KeyEnCode: string;
    userCurrent: string;
    constructor(
        private router: Router,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private translationService: TranslationService,
        private translate: TranslateService,
        private changeDetectorRefs: ChangeDetectorRef,
        private aux_services: AUXService,
        private layoutUtilsService: LayoutUtilsService,

    ) {
        const dt = this.aux_services.getAuthFromLocalStorage();
        this.userCurrent = dt.user.username;
        this.translationService.loadTranslations(
            viLang,
        );
        var langcode = localStorage.getItem('language');
        if (langcode == null)
            langcode = this.translate.getDefaultLang();
        this.translationService.setLanguage(langcode);
    }
    GetIteamChat(IDGROUP, IDGOV, ID) {
        this.aux_services.Get_ItemChatForWork(ID).subscribe(res => {

            this.IteamChat = res.data;
            if (this.IteamChat.isEncode == true) {
                this.CheckEnCodeInConversation(IDGROUP, IDGOV, ID)
            }
            else {

                this.aux_services.GetInforUserChatWith(IDGROUP).subscribe(res => {
                    if (res) {

                        this.isGroup = res.data[0].isGroup;
                        this.openDialogJW(IDGOV, ID, this.isGroup, res);
                        this.changeDetectorRefs.detectChanges();
                    }
                })
            }

        })

    }
    CheckEnCodeInConversation(IdGroup, IDGOV, ID) {
        this.aux_services.CheckEnCodeInConversation(IdGroup).subscribe(res => {
            if (res && res.status == 1) {
                this.KeyEnCode = res.data[0].KeyEnCode;
                this.aux_services.GetInforUserChatWith(IdGroup).subscribe(res => {
                    if (res) {

                        this.isGroup = res.data[0].isGroup;
                        this.openDialogJW(IDGOV, ID, this.isGroup, res);
                        this.changeDetectorRefs.detectChanges();
                    }
                })

                this.changeDetectorRefs.detectChanges();
            }
            else {
                this.KeyEnCode = undefined;
                this.changeDetectorRefs.detectChanges();
            }
        }
        )
    }
    ngOnInit() {
        this.loading$ = this.loadingSubject.asObservable();
        this.loadingSubject.next(true);
        this.activatedRoute.params.subscribe(async params => {
            this.loadingSubject.next(false);
            const IDGOV = params['idgov'];
            const ID = params['id'];
            const IDGROUP = params['idgroup'];


            // if(IDGROUP)
            // {
            //     this.CheckEnCodeInConversation(IDGROUP);
            // }

            if (IDGOV && IDGOV >= 0 && ID && ID > 0) {


                this.GetIteamChat(IDGROUP, IDGOV, ID)



            }
        });
    }
    close() {
        this.router.navigate(['', { outlets: { auxNameV1: null } }]);
        AuxiliaryRouterAddJeeWorkComponent.dialogRef = null;
    }

    decryptUsingAES256(text) {

        try {
            return CryptoJS.AES.decrypt(
                text, this.KeyEnCode, {
                keySize: 16,
                iv: this.KeyEnCode,
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.ZeroPadding
            }).toString(CryptoJS.enc.Utf8).replace(/['"]+/g, '');


            //  .replace("\\", "").replace("\\", "");;
        }
        catch (ex) {
            return text
        }

    }
    public static dialogRef = null;// chỗ này đem ra biến cục bộ dạng static đó! ý nghĩa là kt nếu đang tồn tại dialog này thì không cần kt code trong sub nữa! => hiện tại là cách fix tam thời (chưa tìm đc chỗ gây lỗi)
    openDialogJW(idgov, id, isgroup, InforGroup) {
        let chuoi = ""
        let giatristart;
        let giatriend;
        if (this.IteamChat.isEncode == true) {
            chuoi = this.decryptUsingAES256(this.IteamChat.Content_mess).replace("\\", "").replace("\\", "");

            giatristart = chuoi.replace('/', "").indexOf(`data-id=`);
            giatriend = chuoi.replace('/', "").indexOf(`data-value=`);
        }
        else {
            chuoi = this.IteamChat.Content_mess;
            giatristart = chuoi.replace('/', "").indexOf(`data-id="`);
            giatriend = chuoi.replace('/', "").indexOf(`data-value="`);
        }
        let tmp;
        if (chuoi.substr(giatristart + 8, giatriend - giatristart - 8) != "") {
            this.aux_services.GetInforbyUserName(`${chuoi.substr(giatristart + 8, giatriend - giatristart - 8)}`)
                .subscribe(res => {

                    if (res) {
                        tmp = {
                            image: res.data[0].Avatar,
                            hoten: res.data[0].Fullname,
                            id_nv: res.data[0].ID_user,
                        }


                        if (idgov == 1) {
                            AuxiliaryRouterAddJeeWorkComponent.dialogRef = this.dialog.open(CongViecTheoDuAnVer1PopupComponent, {
                                data: { _item: {} },
                                disableClose: true,
                                panelClass: ['sky-padding-0', 'width900'],
                                height: '90vh',
                            });
                            AuxiliaryRouterAddJeeWorkComponent.dialogRef.afterClosed().subscribe(result => {
                                this.close();
                                AuxiliaryRouterAddJeeWorkComponent.dialogRef = null;
                            });
                        } else {
                            AuxiliaryRouterAddJeeWorkComponent.dialogRef = this.dialog.open(CongViecTheoDuAnPopupComponent, {
                                data: { _messageid: this.IteamChat.IdChat, _itemid: tmp, _message: chuoi.replace("<p></p>", ""), _type: 2, _groupid: this.IteamChat.IdGroup, _ischat: true },
                                disableClose: true,
                                panelClass: ['sky-padding-0', 'width700'],
                                height: '90vh',
                            });
                            AuxiliaryRouterAddJeeWorkComponent.dialogRef.afterClosed().subscribe(result => {

                                this.close();
                                AuxiliaryRouterAddJeeWorkComponent.dialogRef = null;
                            });
                        }
                    }
                })
        }
        else {
            this.aux_services.GetnforUserByUserNameForMobile(this.IteamChat.UserName).subscribe(res => {
                if (res && res.status == 1) {



                    // không phải nhóm tạo công việc chính mình lấy user kia
                    if (this.userCurrent == this.IteamChat.UserName && isgroup == false) {

                        tmp = {
                            image: InforGroup.data[0].Avatar ? InforGroup.data[0].Avatar : "",
                            hoten: InforGroup.data[0].FullName,
                            id_nv: InforGroup.data[0].UserId,
                        }
                    }
                    else {

                        tmp = {
                            image: this.IteamChat.Avatar,
                            hoten: this.IteamChat.FullName,
                            id_nv: res.data[0].ID_user

                        }

                    }

                    if (idgov == 1) {
                        AuxiliaryRouterAddJeeWorkComponent.dialogRef = this.dialog.open(CongViecTheoDuAnVer1PopupComponent, {
                            data: { _item: {} },
                            disableClose: true,
                            panelClass: ['sky-padding-0', 'width900'],
                            height: '90vh',
                        });
                        AuxiliaryRouterAddJeeWorkComponent.dialogRef.afterClosed().subscribe(result => {
                            this.close();
                            AuxiliaryRouterAddJeeWorkComponent.dialogRef = null;
                        });
                    } else {
                        AuxiliaryRouterAddJeeWorkComponent.dialogRef = this.dialog.open(CongViecTheoDuAnPopupComponent, {
                            data: { _messageid: this.IteamChat.IdChat, _itemid: tmp, _message: chuoi.replace("<p></p>", ""), _type: 2, _groupid: this.IteamChat.IdGroup, _ischat: true },
                            disableClose: true,
                            panelClass: ['sky-padding-0', 'width700'],
                            height: '90vh',
                        });
                        AuxiliaryRouterAddJeeWorkComponent.dialogRef.afterClosed().subscribe(result => {
                            if (result) {
                                this.layoutUtilsService.showActionNotification('Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
                            }
                            this.close();
                            AuxiliaryRouterAddJeeWorkComponent.dialogRef = null;
                        });
                    }
                }

            })
        }






    }
}
