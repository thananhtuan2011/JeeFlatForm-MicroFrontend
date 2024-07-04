import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { MatAccordion } from '@angular/material/expansion';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'thiet-lap-nhiem-vu-cua-don-vi',
  templateUrl: './ThietLapNhiemVuCuaDonVi.component.html',
})
export class ThietLapNhiemVuCuaDonVi implements OnInit {

  listDropDown: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  optionNumberSelected = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public DanhMucChungService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ThietLapNhiemVuCuaDonVi>,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
  ) { }
  checked = false;
  disabled = false;
  selected: string = '';
  listProject: any[] = [];
  ngOnInit(): void {
    this.DanhMucChungService.ListProject_NVCDV().subscribe(res => {
      if (res && res.status == 1 && res.data.length > 0) {
        this.listProject = res.data;
        if(res.id != 0 && res.id != null){
          this.selected = res.id;
        }
      } else {
        this.listProject = [];
      }
      this.changeDetectorRefs.detectChanges();
    })
    this.changeDetectorRefs.detectChanges();
  }


  close() {
    this.dialogRef.close();
  }

  subMit() {
    this.disabled = true;
    this.DanhMucChungService.UpdateNhiemVuCuaDV(+this.selected).subscribe(res => {
      if (res.status > 0) {
        let _item = {
          Id: 36,
          vals: this.selected
        }
        this.DanhMucChungService.Post_UpdateValueWidget(_item).subscribe((res) => {
          this.disabled = false;
          if (res && res.status === 1) {
            this.dialogRef.close({
              _item
            })
          }
        });
        this.dialogRef.close({
          _item
        })
            }
      else {
        this.layoutUtilsService.showError(res.error.message);;
      }
    });
  }

}
