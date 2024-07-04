import { JeeTeamService } from './../services/jeeteam.service';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { GroupMemberModel } from '../model/MemberMenuModel';
import { MenuJeeTeamServices } from '../services/menu_jeeteam.service';
import { LayoutUtilsService, MessageType } from 'projects/jeeteam/src/modules/crud/utils/layout-utils.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<AddMemberComponent>,
    private changeDetectorRefs: ChangeDetectorRef,
    private dashboard_services: JeeTeamService,
    private menu_services: MenuJeeTeamServices,
    private layoutUtilsService: LayoutUtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  public filteredGroups: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public searchControl: FormControl = new FormControl();
  list_thanhvien: any[] = [];
  list_choose: any[] = [];
  list_delete: any[] = [];
  active: boolean = true;
  id_group: number;
  closeDilog() {
    this.dialogRef.close();
  }


  protected filterBankGroups() {
    if (!this.list_thanhvien) {
      return;
    }
    // get the search keyword
    let search = this.searchControl.value;
    // const bankGroupsCopy = this.copyGroups(this.list_group);
    if (!search) {
      this.filteredGroups.next(this.list_thanhvien.slice());

    } else {
      search = search.toLowerCase();
    }

    this.filteredGroups.next(
      this.list_thanhvien.filter(bank => bank.FullName.toLowerCase().indexOf(search) > -1)
    );
  }

  RemoveChooseMemeber(index) {
    this.list_thanhvien.unshift(this.list_choose[index]);
    this.list_choose.splice(index, 1);

    this.filteredGroups.next(this.list_thanhvien.slice());
  }
  ChooseMember(item) {

    let vitri = this.list_thanhvien.findIndex(x => x.IdUser == item);
    if (vitri >= 0) {


      this.list_choose.push(this.list_thanhvien[vitri]);
      this.list_thanhvien.splice(vitri, 1)
      this.filteredGroups.next(this.list_thanhvien.slice());
      this.changeDetectorRefs.detectChanges();
    }
  }


  Item_Mmember(): GroupMemberModel {
    const item = new GroupMemberModel();
    item.RowIdMenu = this.data.RowId;
    item.ListMember = this.list_choose.slice();

    return item;
  }

  InsertThanhVien() {
    let item = this.Item_Mmember();
    this.menu_services.addMemberMenu(item)
      .subscribe(res => {
        if (res && res.status == 1) {
          this.layoutUtilsService.showActionNotification("Thêm thành công !", MessageType.Delete, 4000, true, false, 3000, 'top', 1);
          this.closeDilog();
        }
        else {
          this.layoutUtilsService.showActionNotification("Thất bại !", MessageType.Delete, 4000, true, false, 3000, 'top', 0);

        }
      })

  }

  submit() {
    this.InsertThanhVien();
  }
  LoadDSThanhVien() {
    this.dashboard_services.GetDSUser_NotIn_InGroupMenu(this.data.RowId).subscribe(res => {
      this.list_thanhvien = res.data;
      this.filteredGroups.next(this.list_thanhvien.slice());
      this.active = false
      this.changeDetectorRefs.detectChanges();
    })
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe()
      .subscribe(() => {
        this.filterBankGroups();
      });
    this.LoadDSThanhVien();
  }


}
