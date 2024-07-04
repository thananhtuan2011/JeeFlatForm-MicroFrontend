import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alternative-keyword-list',
  templateUrl: './alternative-keyword-list.component.html',
  styleUrls: ['./alternative-keyword-list.component.scss']
})
export class AlternativeKeywordListComponent implements OnInit {

  displayedColumns = [];
  availableColumns = [
    {
      stt: 1,
      name: 'STT',
    },
    {
      stt: 2,
      name: 'TuKhoa',
    },
    {
      stt: 3,
      name: 'YNghia',
    },
  ];
  data = [
    {
      stt: 1,
      tukhoa: '{W0}',
      ynghia: 'Số thứ tự của tuần trong năm',
    },
    {
      stt: 2,
      tukhoa: '{W1}',
      ynghia: 'Ngày của chủ nhật trong tuần',
    },
    {
      stt: 3,
      tukhoa: '{W2}',
      ynghia: 'Ngày của thứ 2 trong tuần',
    },
    {
      stt: 4,
      tukhoa: '{W3}',
      ynghia: 'Ngày của thứ 3 trong tuần',
    },
    {
      stt: 5,
      tukhoa: '{W4}',
      ynghia: 'Ngày của thứ 4 trong tuần',
    },
    {
      stt: 6,
      tukhoa: '{W5}',
      ynghia: 'Ngày của thứ 5 trong tuần',
    },
    {
      stt: 7,
      tukhoa: '{W6}',
      ynghia: 'Ngày của thứ 6 trong tuần',
    },
    {
      stt: 8,
      tukhoa: '{W7}',
      ynghia: 'Ngày của thứ 7 trong tuần',
    },
    {
      stt: 9,
      tukhoa: '{M}',
      ynghia: 'Tháng',
    },
    {
      stt: 10,
      tukhoa: '{Y}',
      ynghia: 'Năm',
    },
    {
      stt: 11,
      tukhoa: '{Q}',
      ynghia: 'Quý trong năm (1->4)',
    },
    {
      stt: 12,
      tukhoa: '{6T}',
      ynghia: '6 tháng đầu/cuối năm (tháng từ 1-6 đầu, 7-12 cuối)',
    },
    {
      stt: 13,
      tukhoa: '{0:dd/MM/yyyy}',
      ynghia: 'Ngày theo định dạng',
    },
  ];
  selectedColumns = new SelectionModel<any>(true, this.availableColumns);
  constructor(public dialogRef: MatDialogRef<AlternativeKeywordListComponent>,

  ) { }

  ngOnInit(): void {
    this.applySelectedColumns();
  }
  goBack() {
    this.dialogRef.close();
  }
  applySelectedColumns() {
    const _selectedColumns: string[] = [];
    this.selectedColumns.selected.sort((a, b) => { return a.stt > b.stt ? 1 : 0; }).forEach(col => { _selectedColumns.push(col.name) });
    this.displayedColumns = _selectedColumns;
  }

}
