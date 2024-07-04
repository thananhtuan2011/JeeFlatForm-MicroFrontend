import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { MatAccordion } from '@angular/material/expansion';
import { ThemePalette } from '@angular/material/core';
import { InsertTags, MenuModel, ProjectTags, UserModel } from './model/ThietLapThe.model';
import { MatDialogRef } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { QueryParamsModel } from '../../models/query-models/query-params.model';
@Component({
  selector: 'thiet-lap-the',
  templateUrl: './ThietLapThe.component.html',
  styleUrls: ['./ThietLapThe.component.scss']
})
export class ThietLapThe implements OnInit {

  listDropDown: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  optionNumberSelected = 0;
  constructor(
    public DanhMucChungService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ThietLapThe>,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
  ) { }
  item: InsertTags;
  color_accent: ThemePalette = 'accent';
  color_warn: ThemePalette = 'warn';
  color_primary: ThemePalette = 'primary';
  checked = false;
  disabled = false;
  _dataConfig: MenuModel[] = [];
  change = true;
  _data: any = [];
  showFiller = false;
  lstRole:any=[];
  selectedRole=0;
  listTagAdd: any = [];
  check_tags: boolean = false;
  _isThietLapTrangChu: boolean = false;
  listTag: any;
  selectedTab = 0;
  UserId: any = 0;
  _SelectTag: any[] = [
    {
      ProjectID: -1,
      TagID: -1,
      IsCheck: false,
      rowid: -1,
      CategoryID: 0,
    },
  ]
  _SelectTagDepartment: any[] = [
    {
      ProjectID: -1,
      TagID: -1,
      IsCheck: false,
      rowid: -1,
      CategoryID: 0,
    },
  ]
  ngOnInit(): void {
    this.UserId = Number(localStorage.getItem("idUser"));
    this.getRole();

    this.getTagChung();
    this.getTag();
    this.getTagDepartment();
    this.LoadDepartment();
    if (this.DanhMucChungService.send$.subscribe((data: any) => {
      if (data === "LoadDuan") {
        this.getTagDuan();
        this.DanhMucChungService.send$.next("");
      }
      if (data === "Init") {
        this.Tags = [];
        this.TagDuan = [];
        this.DanhMucChungService.send$.next("");
      }
      if ((data === "Loadtag")) {
        this.getTag();
        this.DanhMucChungService.send$.next("");
      }
    }))

      this.DanhMucChungService.getthamso();

  }

  getRole(){
    this.DanhMucChungService.getConfigMenuProjectTeam().subscribe((res) => {
      if (res.status == 1) {
        this.lstRole = res.data;
        this.selectedRole=this.lstRole[0].RoleID;
        this.chageDuanThamGia(this.selectedRole);
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  hideTag: boolean = false;
  getTag() {
    this._SelectTag = []
    const queryParams = new QueryParamsModel(
      this.filterConfigurationProject(),
      'asc',
      '',
      0,
      100,
      true,
    );
    this.DanhMucChungService.ListTagConfigByCategory(queryParams).subscribe(res => {
      if (res && res.data) {
        this.Tags = res.data;
        this.Tags.forEach(element => {
          if (element.ProjectName !== "") {
            this._SelectTag.push(element)
          }

        });
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  TagDuan: any;
  getTagDuan() {
    this.DanhMucChungService.Listtags(this.id_row).subscribe(res => {
      if (res && res.data) {
        this.TagDuan = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  close() {
    if (this.change) {
      this.dialogRef.close(this.change);
    } else {
      this.dialogRef.close();
    }
  }
  duan: any;
  selectedProject: number = 0;
  chageDuanThamGia(RoleID) {
    this.selectedRole=RoleID;
    this.DanhMucChungService.getDuanbyMeWithRoleID(RoleID).subscribe(res => {
      if (res && res.status == 1) {
        this.hideTag = false;
        this.duan = res.data;
        this.id_row = this.duan[0].id_row;
        this.DanhMucChungService.send$.next("LoadDuan");
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  Tags: any[];
  TagsDepartment: any[];
  DataDuan: any = [];
  tag: number;
  id_row: number;
  changeDuan(item) {
    this.hideTag = true;
    this.id_row = item.id_row;
    this.DanhMucChungService.Listtags(item.id_row).subscribe(res => {
      if (res && res.status == 1) {
        this.TagDuan = res.data;
        // this.DanhMucChungService.send$.next("Loadtag");
        //his.DanhMucChungService.send$.next("LoadDuan");
        this.changeDetectorRefs.detectChanges();
      }
    })

  }
  isAddTag = false;
  isAddStatus = false;
  idTagFocus = 0;
  tagFocus(value) {
    this.idTagFocus = value;
  }
  tagFocusout(value, tag) {

    this.idTagFocus = 0;
    const index = this.listTag.findIndex(
      (x) => x.title.trim() === value.trim()
    );
    if (index >= 0 && value.trim() != tag.name.trim()) {
      this.layoutUtilsService.showError("Nhãn đã tồn tại");
      tag.name = tag.name + " ";
      return;
    }
    if (!value) {
      tag.name = tag.name + " ";
      // this.LoadListSTT();
      return;
    }
    tag.name = value;
  }
  focusOutTag(value) {
    this.isAddTag = false;
    if (!value) {
      return;
    }
    const index = this.Tags.findIndex((x) => x.title === value);

    if (index >= 0) {
      this.layoutUtilsService.showError("Nhãn đã tồn tại");
      return;
    }

    let _item = {
      title: value,
      color: this.defaultColors[this.getRandomInt(0, this.defaultColors.length)],
      type: 2,
      id_project_team: this.id_row
      // id_row: this.duan.id_row,
    };
    this.DanhMucChungService.InsertTagss(_item).subscribe(res => {
      if (res.status == 1) {
        this.DanhMucChungService.send$.next("Loadtag");
        this.DanhMucChungService.send$.next("LoadDuan");
        this.layoutUtilsService.showActionNotification(
          "Thay đổi thành công",
          MessageType.Update,
          10000,
          true,
          false
        );
      }
    })

  }
  focusOutTagDepartment(value) {
    this.isAddTag = false;
    if (!value) {
      return;
    }
    const index = this.TagsDepartment.findIndex((x) => x.title === value);

    if (index >= 0) {
      this.layoutUtilsService.showError("Nhãn đã tồn tại");
      return;
    }

    let _item = {
      title: value,
      color: this.defaultColors[this.getRandomInt(0, this.defaultColors.length)],
      type: 1,
      id: this.id_dept,
      id_row: this.id_dept
    };
    this.DanhMucChungService.InsertTagss(_item).subscribe(res => {
      if (res.status == 1) {
        this.changeDepartment(_item);
        this.layoutUtilsService.showActionNotification(
          "Thay đổi thành công",
          MessageType.Update,
          10000,
          true,
          false
        );
      }
    })

  }
  ListTagConfigByCategory(value) {
    this.isAddTag = false;
    if (!value) {
      return;
    }
    const index = this.TagDepartment.findIndex((x) => x.title === value);

    if (index >= 0) {
      this.layoutUtilsService.showError("Nhãn đã tồn tại");
      return;
    }

    let _item = {
      title: value,
      color: this.defaultColors[this.getRandomInt(0, this.defaultColors.length)],
      type: 1,
      id: this.id_dept
      // id_row: this.duan.id_row,
    };
    this.DanhMucChungService.InsertTagss(_item).subscribe(res => {
      if (res.status == 1) {
        this.getTagDepartment()
        this.layoutUtilsService.showActionNotification(
          "Thay đổi thành công",
          MessageType.Update,
          10000,
          true,
          false
        );
      }
    })

  }
  public defaultColors: string[] = [
    "#848E9E",
    // 'rgb(187, 181, 181)',
    "rgb(29, 126, 236)",
    "rgb(250, 162, 140)",
    "rgb(14, 201, 204)",
    "rgb(11, 165, 11)",
    "rgb(123, 58, 245)",
    "rgb(238, 177, 8)",
    "rgb(236, 100, 27)",
    "rgb(124, 212, 8)",
    "rgb(240, 56, 102)",
    "rgb(255, 0, 0)",
    "rgb(0, 0, 0)",
    "rgb(255, 0, 255)",
    "rgb(255,0,0)",
    "rgb(0,255,0)",
    "rgb(0,0,255)",
    "rgb(255,255,0)",
    "rgb(0,255,255)",
  ];
  /*
   End đổi vị trí
 */
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
  ktratag: boolean;
  changecolor: any[] = [{ rowid: -1, type: 2 }];
  ChangeTagColor(value, tag) {
    this.ktratag = false;
    tag.color = value;
    let ind = this._SelectTag.findIndex(x => x.rowid == tag.rowid)
    if (ind >= 0) {
      this._SelectTag[ind].color = value;
    }
    else {
      ind = this.TagDuan.findIndex(x => x.rowid == tag.rowid)
      this.ktratag = true;
      this.changecolor.push(this.TagDuan[ind]);
      this.changecolor.splice(0, 1);
    }
    if (this.ktratag == false) {
      this.changecolor.push(this._SelectTag[ind]);
      this.changecolor.splice(0, 1);
    }
    this.changecolor.forEach(element => {
      element.id_row = element.rowid,
        element.type = 2
    });
    this.DanhMucChungService.UpdateTag(this.changecolor[0]).subscribe((res) => {
      if (res.status == 1) {
        // this.layoutUtilsService.showActionNotification(
        //   "Lưu thay đổi thành công",
        //   MessageType.Update,
        //   10000,
        //   true,
        //   false
        // );
      }
    })
  }

  list_Owners: any[] = [];
  Submit_Tags() {
    // this._SelectTag.splice(0, 1);
    let submittag = [];
    if (this._SelectTag.length > 0) {
      this._SelectTag.forEach(element => {
        element.ProjectID = element.CategoryID,
          element.TagID = element.rowid
      });
      submittag.push(this._SelectTag)
    }
    if (this.seletecTagchung.length > 0) {
      this.seletecTagchung.forEach(element => {
        element.ProjectID = 0,
          element.TagID = element.id_row
      });
      submittag.push(this.seletecTagchung)
    }
    // if(submittag[1]!=undefined){
    //   submittag[0].join(submittag[1])
    // }
    this.DanhMucChungService.updateConfigMenuTag(submittag[0]).subscribe((res) => {
      if (res.status == 1) {
        this.layoutUtilsService.showActionNotification(
          "Lưu thay đổi thành công",
          MessageType.Update,
          10000,
          true,
          false
        );
      }
    })
    if (this.isTab == 0) {
      if (this.changecolor[0].rowid > 0) {
        this.changecolor.forEach(element => {
          element.id_row = element.rowid,
            element.type = 2
        });
        this.DanhMucChungService.UpdateTag(this.changecolor[0]).subscribe((res) => {
          if (res.status == 1) {
            this.layoutUtilsService.showActionNotification(
              "Lưu thay đổi thành công",
              MessageType.Update,
              10000,
              true,
              false
            );
          }
        })
      }
    }
  }

  listTagDelete: any = [];
  // Delete_Tag(tag) {
  //   const index = this.listTagAdd.findIndex(
  //     (x) => x.title === tag.title
  //   );
  //   if (index >= 0) {
  //     this.listTagDelete.push(this.listTagAdd[index]);
  //     this.listTagAdd.splice(index, 1);
  //   }
  // }
  changeTag(value) {
    let ind = this.TagDuan.findIndex(x => x.rowid == value.rowid);
    if (this.TagDuan[ind].IsCheck === 0 || this.TagDuan[ind].IsCheck === false) {
      this.TagDuan[ind].IsCheck = 1;
    }
    else if (this.TagDuan[ind].IsCheck === 1 || this.TagDuan[ind].IsCheck === true) {
      this.TagDuan[ind].IsCheck = 0;
    }
    let vitri = this._SelectTag.findIndex(x => x.rowid == value.rowid);
    if (vitri < 0) {
      this._SelectTag.push(this.TagDuan[ind]);
    }
    for (let index = 0; index < this._SelectTag.length; index++) {
      if (this._SelectTag[index].rowid == this.TagDuan[ind].rowid) {
        this._SelectTag[index].IsCheck = this.TagDuan[ind].IsCheck
      }
    }
    this._SelectTag.forEach(element => {
      element.ProjectID = element.CategoryID,
        element.TagID = element.rowid
    });
    this.DanhMucChungService.updateConfigMenuTag(this._SelectTag).subscribe((res) => {
      if (res.status == 1) {
        // this.layoutUtilsService.showActionNotification(
        //   "Thay đổi thành công",
        //   MessageType.Update,
        //   10000,
        //   true,
        //   false
        // );
      }
    })
  }
  tagdele: any[] = [
    {
      ProjectID: -1,
      TagID: -1,
      IsCheck: false,
      rowid: 0,
      CategoryID: 0,
    },
  ];

  TagChung: any[];
  seletecTagchung: any[] = [{
    ProjectID: -1,
    TagID: -1,
    IsCheck: false,
    rowid: -1,
    CategoryID: 0,
  }];
  getTagChung() {
    this.seletecTagchung = []
    this.DanhMucChungService.ListTagChungAll().subscribe(res => {
      if (res && res.data) {
        this.TagChung = res.data;
        this.TagChung.forEach(element => {
          this.seletecTagchung.push(element)
        });
        // this.TagChung.forEach(element => {
        //   this._SelectTag.push(element)
        // });
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  changeTagChung(item) {
    let ind = this.TagChung.findIndex(x => x.id_row == item.id_row);
    if (this.TagChung[ind].IsCheck === 0 || this.TagChung[ind].IsCheck === false) {
      this.TagChung[ind].IsCheck = 1;
    }
    else if (this.TagChung[ind].IsCheck === 1 || this.TagChung[ind].IsCheck === true) {
      this.TagChung[ind].IsCheck = 0;
    }
    let vitri = this.seletecTagchung.findIndex(x => x.id_row == item.id_row);
    if (vitri < 0) {
      this.seletecTagchung.push(this.TagChung[ind]);
    }
    for (let index = 0; index < this.seletecTagchung.length; index++) {
      if (this.seletecTagchung[index].id_row == this.TagChung[ind].id_row) {
        this.seletecTagchung[index].IsCheck = this.TagChung[ind].IsCheck
      }
    }
    this.seletecTagchung.forEach(element => {
      element.ProjectID = 0,
        element.TagID = element.id_row
    });
    this.DanhMucChungService.updateConfigMenuTag(this.seletecTagchung).subscribe((res) => {
      if (res.status == 1) {
        // this.layoutUtilsService.showActionNotification(
        //   "Thay đổi thành công",
        //   MessageType.Update,
        //   10000,
        //   true,
        //   false
        // );
      }
    })
  }
  isTab: number = 1;
  ChangeTab(item) {
    if (item.index == 1) {
      this.isTab = 0;
    }
    if (item.index == 0) {
      this.isTab = 1;
    }
  }
  Remove(item) {
    this.DanhMucChungService.DeleteTag(item.rowid).subscribe(res => {
      if (res && res.status === 1) {
        this.getTagDuan();
        let ind = this._SelectTag.findIndex(x => x.rowid == item.rowid);
        if (ind != -1) {
          this._SelectTag.splice(ind, 1);
        }
      }
      else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Delete,
          999999999,
          true,
          false,
          3000,
          'top',
          0
        );
      }
    })
  }


   phongban: any;
  selectedDept: number = 0;
  id_dept: number;
  LoadDepartment() {
    this.DanhMucChungService.getPhongBanbyMeWithRuleID(40).subscribe(res => {
      if (res && res.status == 1) {
        //this.hideTag = false;
        this.phongban = res.data;
        if(this.phongban && this.phongban.length>0)
          this.changeDepartment(this.phongban[0]);
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  TagDepartment: any;
  changeDepartment(item) {
    //this.hideTag = true;
    this.id_dept = item.id_row;
    this.DanhMucChungService.ListtagsDept(item.id_row).subscribe(res => {
      if (res && res.status == 1) {
        this.TagDepartment = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })

  }
  filterConfigurationProject(): any {
    let filter: any = {};
    filter.categoryType = 2;
    return filter;
  }
  filterConfigurationDepartment(): any {
    let filter: any = {};
    filter.categoryType = 1;
    return filter;
  }

  getTagDepartment() {
    this._SelectTagDepartment = []
    const queryParams = new QueryParamsModel(
      this.filterConfigurationDepartment(),
      'asc',
      '',
      0,
      100,
      true,
    );
    this.DanhMucChungService.ListTagConfigByCategory(queryParams).subscribe(res => {
      if (res && res.data) {
        this.TagsDepartment = res.data;
        this.TagsDepartment.forEach(element => {
          this._SelectTagDepartment.push(element)

        });
        this.changeDetectorRefs.detectChanges();
      }
    })
    
  }
  changeTagDept(value) {
    let ind = this.TagDepartment.findIndex(x => x.rowid == value.rowid);
    if (this.TagDepartment[ind].IsCheck === 0 || this.TagDepartment[ind].IsCheck === false) {
      this.TagDepartment[ind].IsCheck = 1;
    }
    else if (this.TagDepartment[ind].IsCheck === 1 || this.TagDepartment[ind].IsCheck === true) {
      this.TagDepartment[ind].IsCheck = 0;
    }
    let vitri = this._SelectTagDepartment.findIndex(x => x.rowid == value.rowid);
    if (vitri < 0) {
      this._SelectTagDepartment.push(this.TagDepartment[ind]);
    }
    for (let index = 0; index < this._SelectTagDepartment.length; index++) {
      if (this._SelectTagDepartment[index].rowid == this.TagDepartment[ind].rowid) {
        this._SelectTagDepartment[index].IsCheck = this.TagDepartment[ind].IsCheck
      }
    }
    this._SelectTagDepartment.forEach(element => {
      element.CategoryID = element.CategoryID,
      element.TagID = element.rowid,
      element.CategoryType = value.CategoryType;
    });
    this.DanhMucChungService.updateConfigMenuTag(this._SelectTagDepartment).subscribe((res) => {
      if (res.status == 1) {
      }
    })
  }
  deleteTag(item) {
    let ind = this._SelectTag.findIndex(x => x.rowid == item.rowid);
    let ind_dept = this._SelectTagDepartment.findIndex(x => x.rowid == item.rowid);
    let indchung = this.seletecTagchung.findIndex(x => x.id_row == item.id_row);
    if (ind != -1) {
      this._SelectTag[ind].IsCheck = 0;
      this.tagdele.push(this._SelectTag[ind]);
      this.tagdele.splice(0, 1);
      this.tagdele.forEach(element => {
        element.CategoryID = element.CategoryID,
          element.TagID = element.rowid,
          element.CategoryType =item.CategoryType;
      });
      this._SelectTag.splice(ind, 1);
      this.DanhMucChungService.updateConfigMenuTag(this.tagdele).subscribe((res) => {
        if (res.status == 1) {
          this.DanhMucChungService.send$.next("LoadDuan");
          // this.layoutUtilsService.showActionNotification(
          //   "Thay đổi thành công",
          //   MessageType.Update,
          //   10000,
          //   true,
          //   false
          // );
        }
      })
    }
    if (ind_dept != -1) {
      this._SelectTagDepartment[ind].IsCheck = 0;
      this.tagdele.push(this._SelectTagDepartment[ind]);
      this.tagdele.splice(0, 1);
      this.tagdele.forEach(element => {
        element.CategoryID = element.CategoryID,
          element.TagID = element.rowid,
          element.CategoryType = item.CategoryType;
      });
      this._SelectTagDepartment.splice(ind, 1);
      this.DanhMucChungService.updateConfigMenuTag(this.tagdele).subscribe((res) => {
        if (res.status == 1) {
          this.DanhMucChungService.send$.next("LoadDuan");
          // this.layoutUtilsService.showActionNotification(
          //   "Thay đổi thành công",
          //   MessageType.Update,
          //   10000,
          //   true,
          //   false
          // );
        }
      })
    }
    if (indchung != -1) {
      this.seletecTagchung[indchung].IsCheck = 0;
      this.tagdele.push(this.seletecTagchung[indchung]);
      this.tagdele.splice(0, 1);
      this.tagdele.forEach(element => {
        element.CategoryID = 0,
        element.TagID = element.id_row,
        element.CategoryType = item.CategoryType;
      });
      this.seletecTagchung.splice(indchung, 1)
      this.DanhMucChungService.updateConfigMenuTag(this.tagdele).subscribe((res) => {
        if (res.status == 1) {
          // this.layoutUtilsService.showActionNotification(
          //   "Thay đổi thành công",
          //   MessageType.Update,
          //   10000,
          //   true,
          //   false
          // );
        }
      })
    }
  }
  RemoveTagDepartmnet(item) {
    this.DanhMucChungService.DeleteTag(item.rowid).subscribe(res => {
      if (res && res.status === 1) {
        this.getTagDuan();
        let ind = this._SelectTagDepartment.findIndex(x => x.rowid == item.rowid);
        if (ind != -1) {
          this._SelectTagDepartment.splice(ind, 1);
        }
      }
      else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Delete,
          999999999,
          true,
          false,
          3000,
          'top',
          0
        );
      }
    })
  }


}
