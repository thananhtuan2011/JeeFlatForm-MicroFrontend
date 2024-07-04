import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { MatAccordion } from '@angular/material/expansion';
import { ThemePalette } from '@angular/material/core';
import { MenuModel } from './model/ThietLapPhongBan.model';
import { MatDialogRef } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { isDebuggerStatement } from 'typescript';
import { QueryParamsModel } from '../../models/query-models/query-params.model';
@Component({
  selector: 'thiet-lap-phong-ban',
  templateUrl: './ThietLapPhongBan.component.html',
  styleUrls: ['./ThietLapPhongBan.component.scss']
})
export class ThietLapPhongBan implements OnInit {
  listDropDown: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    public DanhMucChungService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ThietLapPhongBan>,
    private layoutUtilsService: LayoutUtilsService,
  ) { }
  color_accent: ThemePalette = 'accent';
  color_warn: ThemePalette = 'warn';
  color_primary: ThemePalette = 'primary';
  checked = false;
  disabled = false;
  _dataConfig: MenuModel[] = [];
  change = true;
  _data: any = [];
  _Type: "";
  _lstType: any = [];
  showFiller = false;
  _isThietLapTrangChu: boolean = false;
  selectedTab = 0;
  _dataDashboard = [
    {
      id_priority: -1,
      loainhiemvu: 'Nhắc nhở nhiệm vụ đã giao',
      langkey: 'nhacnhonhiemvudagiao',
      isHidden: false
    },
    {
      id_priority: -2,
      loainhiemvu: 'Nhắc nhở nhiệm vụ được giao',
      langkey: 'nhacnhonhiemvuduocgiao',
      isHidden: false
    },
    {
      id_priority: -3,
      loainhiemvu: 'Nhắc nhở nhiệm vụ đã tạo',
      langkey: 'nhacnhonhiemvudatao',
      isHidden: false
    }
  ]
  ngOnInit(): void {
    this.DanhMucChungService.getthamso();
    this.getConfig();
    this.getDanhSachPhongBan();
  }
  //
  getConfig() {

    this.DanhMucChungService.getConfigMenuProjectTeam().subscribe((res) => {
      if (res.status == 1) {
        this._data = res.data;
        this._lstType = res.Type;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  optionNumberSelected(Type): boolean {
    if (this._lstType) {
      var index = this._lstType.findIndex(
        (x) => x == Type
      );
      if (index >= 0) {
        return true;
      }
      return false;
    }
    return false;
  }

  _task;
  selectNhiemVu(index) {
    this.selectedTab = index;
  }
  chageOption(item) {
    // let ind = this._data.findIndex(x => x.)
    let itemSelected = this._data.find(x => x.RoleID == item.RoleID);
    itemSelected.IsCheck = !itemSelected.IsCheck;
  }
  _All: any = "0,1,2,3,4,5,6";
  resule: any;
  chageOptionNumber(Type) {
    var index = this._lstType.findIndex(
      (x) => x == Type
    );
    if (index < 0) {
      this._lstType.push(Type.toString());
    }
    else {
      this._lstType.splice(index, 1);
    }
    this.changeDetectorRefs.detectChanges();
  }

  close() {
    if (this.change) {
      this.dialogRef.close(this.change);
    } else {
      this.dialogRef.close();
    }
  }
  subMit() {
    if (this.selectedTab == 0) {
      this.DanhMucChungService.updateConfigMenuProjectTeam(this._data).subscribe((res) => {
        if (res.status == 1) {
          this.change = true;
          this.layoutUtilsService.showActionNotification(
            "Thay đổi thiết lập thành công",
            MessageType.Update,
            10000,
            true,
            false
          );
        }
      });
    } else {
      let lst_type = '';
      if (this._lstType) {
        this._lstType.forEach(element => {
          lst_type += element + ',';
        });
      }
      if (lst_type) lst_type = lst_type.substring(0, lst_type.length - 1);
      this.DanhMucChungService.updateConfigMenuProjectTeamType(lst_type).subscribe((res) => {
        if (res.status == 1) {
          this.change = true;
          this.layoutUtilsService.showActionNotification(
            "Thay đổi thiết lập thành công",
            MessageType.Update,
            10000,
            true,
            false
          );
        }
      });
    }

  }

  //==========================Thiên bổ sung chức năng - Thiết lập hiển thị phạm vi (03082023)=======
  selectedDepartment: number = 0;
  listDepartment: any = [];
  getDanhSachPhongBan() {
    this.DanhMucChungService.list_department_by_me().subscribe(res => {
      if (res && res.status == 1) {
        this.listDepartment = res.data;
        if (this.listDepartment.length > 0) {
          if(+res.id > 0){
            this.selectedDepartment = res.id;
          }else{
            this.selectedDepartment = res.data[0].id_row;
          }
          this.getListPhamVi();
        }
        else {
          this.layoutUtilsService.showActionNotification('Bạn chưa thuộc phạm vi trong đơn vị nào', MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        }
       
      }
      else {
        this.layoutUtilsService.showActionNotification('res.error.message', MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    })
  }

  getListPhamVi() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      'asc',
      '',
      0,
      100,
      true,
    );

    this.DanhMucChungService.list_roleconfig_byme(queryParams).subscribe(res => {
      if (res && res.status == 1 && res.data.length > 0) {
        this._data = res.data;
      } else {
        this._data = [];
      }
      this.changeDetectorRefs.detectChanges();
    })
  }

  filterConfiguration(): any {
    let filter: any = {};
    filter.DepartmentId = this.selectedDepartment;
    return filter;
  }

  changeDepartment(val) {
    this.selectedDepartment = val;
    this.getListPhamVi();
  }

  checkedPhamVi(item): boolean {
    if (item.value == "1") {
      return true;
    }
    return false;
  }

  LuuPhamVi(item) {
    if (!item.isDisabled) {
      if (item.value != "1") {
        this.DanhMucChungService.update_roleconfig_byuser(this.selectedDepartment, item.id).subscribe(res => {
          if (res && res.status == 1) {
            this.getListPhamVi();
          }
        })
      } else {
        this.getListPhamVi();
        this.changeDetectorRefs.detectChanges();
      }
    }
  }
}
