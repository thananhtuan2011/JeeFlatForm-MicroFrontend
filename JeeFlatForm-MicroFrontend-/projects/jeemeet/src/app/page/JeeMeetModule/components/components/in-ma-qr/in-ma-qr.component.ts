import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { QuanLyCuocHopService } from '../../../_services/quan-ly-cuoc-hop.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'projects/jeemeet/src/environments/environment.prod';

@Component({
  selector: 'app-in-ma-qr',
  templateUrl: './in-ma-qr.component.html',
  styleUrls: ['./in-ma-qr.component.scss']
})
export class InMaQRComponent implements OnInit {
  hasFormErrors: boolean = false;
  CuocHopForm: FormGroup;
  EDIT_FONT_EDITOR: string = '';
  EDIT_FONTSIZE_EDITOR: string = '';
  NoiDungDienBien:any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<InMaQRComponent>,
  private changeDetectorRefs: ChangeDetectorRef,
  public dangKyCuocHopService: QuanLyCuocHopService,
  private layoutUtilsService: LayoutUtilsService,
  private translate: TranslateService,) { }
  QRCODE:string="";
  ngOnInit() {
    this.QRCODE=environment.CDN_DOMAIN+this.data.QRCODE;
    this.changeDetectorRefs.detectChanges();
  }

  close() {
    this.dialogRef.close();
  }
  CapNhatNoiDungKetLuan() {
	let _item = {
		NoiDung: this.NoiDungDienBien,
		meetingid: this.data._item,
		type: 3
	}
	this.dangKyCuocHopService.CapNhatTomTatKetLuan(_item).subscribe(res => {
		if (res && res.status === 1) {
			this.layoutUtilsService.showActionNotification(
				this.translate.instant("QL_CUOCHOP.CUOCHOP.UPDATE_THANHCONG"),
				MessageType.Read,
				4000,
				true,
				false,
				3000,
				"top"
			);
			this.dialogRef.close();
		} else {
			this.layoutUtilsService.showActionNotification(
				res.error.message,
				MessageType.Read,
				9999999999,
				true,
				false,
			);
		}
	});
}
printToCart(printSectionId: string) {
  let popupWinindow;
  let innerContents = document.getElementById(printSectionId).innerHTML;
  popupWinindow = window.open(
    "",
    "_blank",
    "width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no"
  );
  popupWinindow.document.open();
  popupWinindow.document.write(
    '<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' +
      innerContents +
      "</html>"
  );
  popupWinindow.document.close();
}

}
