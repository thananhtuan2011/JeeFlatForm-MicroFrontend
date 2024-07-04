import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { MatAccordion } from '@angular/material/expansion';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'thiet-lap-tempalte',
  templateUrl: './ThietLapTemplate.component.html',
  styleUrls: ['./ThietLapTemplate.component.scss']
})
export class ThietLapTemplate implements OnInit {

  listDropDown: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  optionNumberSelected = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public DanhMucChungService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ThietLapTemplate>,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
  ) { }
  checked = false;
  disabled = false;
  selectedTemplate: string = '';
  listTemplate: any[] = [];
  ngOnInit(): void {
    this.listTemplate = this.data._listTemplate;
    this.changeDetectorRefs.detectChanges();
  }


  close() {
    this.dialogRef.close();
  }

  subMit() {
    const _message: string = this.translate.instant("object.config.message", {
      name: this.translate.instant("MENU_YKIENGOPY.ACTIVE")
    });
    const _title: string = "Áp dụng thiết lập mẫu";
    const _description: string = "Các thiết lập trước đó sẽ bị xóa, bạn có chắc áp dụng thiết lập mẫu này không";
    const _waitDesciption: string = "Dữ liệu đang được xử lý"
    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      let _item = {
        TemplateID: this.selectedTemplate
      }
      this.disabled = true;
      this.DanhMucChungService.UpdateTemplate(_item).subscribe(res => {
        this.disabled = false;
        if (res.status > 0) {
          this.dialogRef.close({
            _item
          })
        }
        else {
          this.layoutUtilsService.showError(res.error.message);;
        }
      });
    });
  }

}
