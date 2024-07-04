import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';

@Component({
  selector: 'app-cuoc-hop-info',
  templateUrl: './cuoc-hop-info.component.html',
  styleUrls: ['./cuoc-hop-info.component.scss']
})
export class CuocHopInfoComponent implements OnInit {
  title: string;
  CuocHopForm: FormGroup;
  hasFormErrors: boolean = false;
  constructor(public dialogRef: MatDialogRef<CuocHopInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private layoutUtilsService: LayoutUtilsService,
    private CuocHopFB: FormBuilder) { }

  ngOnInit() {
    this.title = this.data._title ?? 'Lý do từ chối tham gia'
    this.createForm()
  }

  createForm() {
    this.CuocHopForm = this.CuocHopFB.group({
      GhiChu: ["", [Validators.required, Validators.pattern(/[\S]/)]],
    });
  }

  onSubmit() {
    if (this.CuocHopForm.controls['GhiChu'].value == '' || this.CuocHopForm.controls['GhiChu'].value == undefined) {
      this.layoutUtilsService.showActionNotification(
        'Không được để trống',
        MessageType.Error,
        9999999999,
        true,
        false,
      );
      return;
    }
    this.dialogRef.close({
      _item: this.CuocHopForm.controls['GhiChu'].value
    });
  }
  close() {
    this.dialogRef.close();
  }
}
