import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { ThietLapNhiemVuComponent } from '../ThietLapNhiemVu/ThietLapNhiemVu.component';

@Component({
  selector: 'menu-left-title',
  templateUrl: './menu-left-title.component.html',
  styleUrls: ['./menu-left-title.component.scss']
})
export class MenuLeftTitleComponent implements OnInit {
  listDropDown: any;

  constructor(
    public DanhMucChungService: DanhMucChungService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    // this.DanhMucChungService.getDSWork().subscribe(res => {
    //   if (res && res.status == 1) {
    //       this.listDropDown = res.data;
    //        ;
    //     }
    // })
  }
  openSetting(){
    // const dialogRef = this.dialog.open(ThietLapNhiemVuComponent, { data: { title, filter: {}, excludes: excludes, owner: owner }, width: '500px' });
    // dialogRef.afterClosed().subscribe(res => {
    //     if (!res) {
    //         return;
    //     } else {
    //         if (owner) {
    //             this.AddOwner(res, admin);
    //         } else {
    //             this.addMembers(res, admin);
    //         }

    //     }
    // });
  }
}
