import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, forwardRef, ElementRef, ViewEncapsulation, Input, OnChanges, AfterViewChecked, Inject } from '@angular/core';
import { FormControl, ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { map, debounceTime, distinctUntilChanged, tap, startWith } from 'rxjs/operators';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DangKyCuocHopService } from '../../../_services/dang-ky-cuoc-hop.service';
import { QueryParamsModelNew } from '../../../../models/query-models/query-params.model';
import { QuanLyCuocHopService } from '../../../_services/quan-ly-cuoc-hop.service';
@Component({
    selector: 'app-choose-member',
    templateUrl: './choose-member-v2.component.html',
    styleUrls: ['./choose-member-v2.component.scss'],
})
export class ChooseMemberV2Component implements OnInit, AfterViewChecked {
    anOption = true
    // ------
    dataTreeDonVi:any
    thanhvientree:any
    lsUserTree:any
    lsDonViTree:any
    inputNodeIds:string
    DisableNodeIds:string
    //==============================================================
    itemuser: any[] = [];
    user_tam: any[] = [];
    user_remove: any[] = [];
    list_remove_tam: any[] = [];
    listUser: Observable<any[]>;
    userControl = new FormControl();
    // ----------------------------------
    itemdept: any[] = [];
    dept_tam: any[] = [];
    dept_remove: any[] = [];
    list_dept_remove_tam: any[] = [];
    listDepts: Observable<any[]>;
    deptControl = new FormControl();

    // ----------------------------------

    itemgroup: any[] = [];
    group_tam: any[] = [];
    group_remove: any[] = [];
    list_group_remove_tam: any[] = [];
    listGroup: Observable<any[]>;
    groupControl = new FormControl();


    @ViewChild('userInput', { static: false }) userInput: ElementRef<HTMLInputElement>;
    //==============================================================
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    type = 0;//2: uy quyen
    type_nember = 3
    @ViewChild('scrollMe', { static: true }) private myScrollContainer: ElementRef;
    public cellindex: number = 0;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ChooseMemberV2Component>,
        public _JeeChooseMemberService: QuanLyCuocHopService,
        private changeDetectorRefs: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.type=this.data.type==2?2:0;
        if(this.data.meetingType_member){
          if(this.data.meetingType_member === 0 || this.data.meetingType_member === 1){
            this.type_nember = 3
          }else{
            this.type_nember = this.data.meetingType_member
          }

        }

        if(this.data.private_meeet){
          this.anOption = false
        }
        if(this.data.private_meeet2){
          this.anOption = false
        }
        // if(this.data.private_meeet){
        //   this.type_nember = 0
        // }
        if(this.data.inputNodeId){
          this.inputNodeIds = this.data.inputNodeId
        }
        this.loadDanhSachNguoiDung();
        this.loadDanhSachPhongBan();

        this.loadDanhSachNguoiDung2();
        this.loadDanhSachPhongBan2();

        this.loadDanhSachNhomNguoiDung();
        this.loadTreeDonVi();
        this.scrollToBottom();
        setTimeout(function () { document.getElementById('search').focus(); }, 100);
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            // this.myScrollContainer.nativeElement.scrollToBottom = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
    //=============================Get danh sách người dùng=======================
    loadDanhSachNguoiDung() {
        const queryParams = new QueryParamsModelNew(
            this.filterConfiguration(),
            "",
            "",
            0,
            100000,
            false
        );
        this._JeeChooseMemberService.getDSNhanVien(queryParams).subscribe(res => {
            this.itemuser = res.data;
            //===Xử lý nếu có data truyền vào
            if (this.data._item.length > 0) {
                this.data._item.map((item, index) => {
                    let obj = this.itemuser.find(x => x.idUser == +item.idUser);
                    if (obj) {
                        this.user_tam.push(obj);
                    }
                })
            }
            for (let i = 0; i < this.user_tam.length; i++) {
                let vitri = this.itemuser.findIndex(x => x.idUser == this.user_tam[i].idUser)
                this.itemuser.splice(vitri, 1)
            }
            if(this.type ==2)
            {
              this.user_tam=[]
            }
            this.listUser = this.userControl.valueChanges
                .pipe(
                    startWith(''),
                    map(state => state ? this._filterStates(state) : this.itemuser.slice())

                );
            setTimeout(() => {
                this.cellClick(this.cellindex);
            }, 100);
            this.changeDetectorRefs.detectChanges();
        })
    }
    loadDanhSachNguoiDung2() {
      const queryParams = new QueryParamsModelNew(
          this.filterConfiguration(),
          "",
          "",
          0,
          100000,
          false
      );
      this._JeeChooseMemberService.getDSNhanVien(queryParams).subscribe(res => {
          this.lsUserTree = res.data;
          this.changeDetectorRefs.detectChanges();
      })
  }

  loadDanhSachPhongBan2() {
    const queryParams = new QueryParamsModelNew(
        this.filterConfiguration(),
        "",
        "",
        0,
        100000,
        false
    );
    this._JeeChooseMemberService.getDSDonVi(queryParams).subscribe(res => {
          this.lsDonViTree = res.data == null ? [] : res.data;
          this.DisableNodeIds =  this.lsDonViTree.map(node => node.RowID).join(',');
          if(!this.DisableNodeIds){
            this.DisableNodeIds = "0"
          }
        this.changeDetectorRefs.detectChanges();
  })
}
    //=============================Get danh sách phòng ban=======================
    loadDanhSachPhongBan() {
      const queryParams = new QueryParamsModelNew(
          this.filterConfiguration(),
          "",
          "",
          0,
          100000,
          false
      );
      this._JeeChooseMemberService.getDSDonVi(queryParams).subscribe(res => {

          if(res.data){
            this.itemdept = res.data;
          //===Xử lý nếu có data truyền vào
          if (this.data._item.length > 0) {
            this.data._item.map((item, index) => {
                let obj = this.itemdept.find(x => x.RowID == +item.RowID);
                if (obj) {
                    this.dept_tam.push(obj);
                }
            })
          }
          for (let i = 0; i < this.dept_tam.length; i++) {
            let vitri = this.itemdept.findIndex(x => x.RowID == this.dept_tam[i].RowID)
            this.itemdept.splice(vitri, 1)
          }
          this.listDepts = this.deptControl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this._filterStatesDept(state) : this.itemdept.slice())

            );
          setTimeout(() => {
            this.cellClick(this.cellindex);
          }, 100);
          }

          this.changeDetectorRefs.detectChanges();
    })
  }

  //=============================Get danh sách phòng ban=======================
  loadDanhSachNhomNguoiDung() {
    const queryParams = new QueryParamsModelNew(
        this.filterConfiguration(),
        "",
        "",
        0,
        100000,
        false
    );
    this._JeeChooseMemberService.getDSNhomNhanVien(queryParams).subscribe(res => {

        //===Xử lý nếu có data truyền vào
        if(res.data){
          this.itemgroup = res.data;
          if (this.data._item.length > 0) {
            this.data._item.map((item, index) => {
                let obj = this.itemgroup.find(x => x.RowID == +item.RowID);
                if (obj) {
                    this.group_tam.push(obj);
                }
            })
        }
        for (let i = 0; i < this.group_tam.length; i++) {
            let vitri = this.itemgroup.findIndex(x => x.RowID == this.group_tam[i].RowID)
            this.itemgroup.splice(vitri, 1)
        }
        if(this.type ==2)
        {
          this.group_tam=[]
        }
        this.listGroup = this.groupControl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this._filterStatesGroup(state) : this.itemgroup.slice())

            );
        setTimeout(() => {
            this.cellClick(this.cellindex);
        }, 100);
        }

        this.changeDetectorRefs.detectChanges();
  })
}
loadTreeDonVi(){
  this._JeeChooseMemberService.getTreeDonVi().subscribe(res => {
    this.dataTreeDonVi = res.data;
    this.changeDetectorRefs.detectChanges();
})
}
    filterConfiguration(): any {
		const filter: any = {};

    if(this.data.meeet_type_nember){
      filter.type = this.data.meeet_type_nember
    }
    if(this.data.private_meeet2){
      filter.type = 6
    }
		return filter;
	}

    private _filterStates(value: string): any[] {
        const valie_vie = this.convertVietnamese(value);
        const filterValue = this._normalizeValue(valie_vie);
        setTimeout(() => {
            this.cellClick(this.cellindex);
        }, 100);
        return this.itemuser.filter(state => this._normalizeValue(this.convertVietnamese(state.HoTen + state.ChucVu)).includes(filterValue));

    }

    private _filterStatesDept(value: string): any[] {
      const valie_vie = this.convertVietnamese(value);
      const filterValue = this._normalizeValue(valie_vie);
      setTimeout(() => {
          this.cellClick(this.cellindex);
      }, 100);
      return this.itemdept.filter(state => this._normalizeValue(this.convertVietnamese(state.DepartmentName)).includes(filterValue));

  }

  private _filterStatesGroup(value: string): any[] {
    const valie_vie = this.convertVietnamese(value);
    const filterValue = this._normalizeValue(valie_vie);
    setTimeout(() => {
        this.cellClick(this.cellindex);
    }, 100);
    return this.itemgroup.filter(state => this._normalizeValue(this.convertVietnamese(state.GroupName)).includes(filterValue));

}

    private _normalizeValue(value: string): string {
        return value.toLowerCase().replace(/\s/g, '');
    }

    addTagName(item: any) {
        let vitri;
        var tam = Object.assign({}, item);
        this.user_tam.push(tam);
        for (let i = 0; i < this.user_tam.length; i++) {
            let index = this.itemuser.findIndex(x => x.username == this.user_tam[i].username)
            vitri = index;
        }
        this.itemuser.splice(vitri, 1);
        this.listUser = this.userControl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this._filterStates(state) : this.itemuser.slice())
            );
        setTimeout(() => {
            this.cellClick(this.cellindex);
        }, 100);
        this.userControl.setValue("");
        document.getElementById('search').focus();
        // document.getElementById("row0").scrollIntoView({ behavior: "smooth" });
    }
    addTagNameDept(item: any) {
      let vitri;
      var tam = Object.assign({}, item);
      this.dept_tam.push(tam);
      for (let i = 0; i < this.dept_tam.length; i++) {
          let index = this.itemdept.findIndex(x => x.RowID == this.dept_tam[i].RowID)
          vitri = index;
      }
      this.itemdept.splice(vitri, 1);
      this.listUser = this.deptControl.valueChanges
          .pipe(
              startWith(''),
              map(state => state ? this._filterStatesDept(state) : this.itemdept.slice())
          );
      setTimeout(() => {
          this.cellClick(this.cellindex);
      }, 100);
      this.deptControl.setValue("");
      document.getElementById('search').focus();
      // document.getElementById("row0").scrollIntoView({ behavior: "smooth" });
  }
  addTagNameGroup(item: any) {
    let vitri;
    var tam = Object.assign({}, item);
    this.group_tam.push(tam);
    for (let i = 0; i < this.group_tam.length; i++) {
        let index = this.itemgroup.findIndex(x => x.RowID == this.group_tam[i].RowID)
        vitri = index;
    }
    this.itemgroup.splice(vitri, 1);
    this.listGroup = this.groupControl.valueChanges
        .pipe(
            startWith(''),
            map(state => state ? this._filterStatesGroup(state) : this.itemgroup.slice())
        );
    setTimeout(() => {
        this.cellClick(this.cellindex);
    }, 100);
    this.groupControl.setValue("");
    document.getElementById('search').focus();
    // document.getElementById("row0").scrollIntoView({ behavior: "smooth" });
}
    // setup avatar
	getNameUser(val) {
		if(val){
			var list = val.split(' ');
			return list[list.length - 1];
		}
		return "";
	}

  getNameUserFirtName(val) {
    // return val.charAt(0);
    if (val) {
      var listname = val.split(' ');
      return listname[listname.length - 1].substr(0, 1);
  }
  return "";
	}
  getColorNameUserFirtName(fullname) {
		var name = this.getNameUserFirtName(fullname).substr(0,1);
		var result = "#bd3d0a";
		switch (name) {
			case "A":
            result = "rgb(197, 90, 240)";
            break;
        case "Ă":
            result = "rgb(241, 196, 15)";
            break;
        case "Â":
            result = "rgb(142, 68, 173)";
            break;
        case "B":
            result = "#02c7ad";
            break;
        case "C":
            result = "#0cb929";
            break;
        case "D":
            result = "rgb(44, 62, 80)";
            break;
        case "Đ":
            result = "rgb(127, 140, 141)";
            break;
        case "E":
            result = "rgb(26, 188, 156)";
            break;
        case "Ê":
            result = "rgb(51 152 219)";
            break;
        case "G":
            result = "rgb(44, 62, 80)";
            break;
        case "H":
            result = "rgb(248, 48, 109)";
            break;
        case "I":
            result = "rgb(142, 68, 173)";
            break;
        case "K":
            result = "#2209b7";
            break;
        case "L":
            result = "#759e13";
            break;
        case "M":
            result = "rgb(236, 157, 92)";
            break;
        case "N":
            result = "#bd3d0a";
            break;
        case "O":
            result = "rgb(51 152 219)";
            break;
        case "Ô":
            result = "rgb(241, 196, 15)";
            break;
        case "Ơ":
            result = "rgb(142, 68, 173)";
            break;
        case "P":
            result = "rgb(142, 68, 173)";
            break;
        case "Q":
            result = "rgb(91, 101, 243)";
            break;
        case "R":
            result = "rgb(44, 62, 80)";
            break;
        case "S":
            result = "rgb(122, 8, 56)";
            break;
        case "T":
            result = "rgb(120, 76, 240)";
            break;
        case "U":
            result = "rgb(51 152 219)";
            break;
        case "Ư":
            result = "rgb(241, 196, 15)";
            break;
        case "V":
            result = "rgb(142, 68, 173)";
            break;
        case "X":
            result = "rgb(142, 68, 173)";
            break;
        case "W":
            result = "rgb(211, 84, 0)";
            break;
		}
		return result;
	}

	getColorNameUser(fullname) {
		var name = this.getNameUser(fullname).substr(0,1);
		var result = "#bd3d0a";
		switch (name) {
			case "A":
            result = "rgb(197, 90, 240)";
            break;
        case "Ă":
            result = "rgb(241, 196, 15)";
            break;
        case "Â":
            result = "rgb(142, 68, 173)";
            break;
        case "B":
            result = "#02c7ad";
            break;
        case "C":
            result = "#0cb929";
            break;
        case "D":
            result = "rgb(44, 62, 80)";
            break;
        case "Đ":
            result = "rgb(127, 140, 141)";
            break;
        case "E":
            result = "rgb(26, 188, 156)";
            break;
        case "Ê":
            result = "rgb(51 152 219)";
            break;
        case "G":
            result = "rgb(44, 62, 80)";
            break;
        case "H":
            result = "rgb(248, 48, 109)";
            break;
        case "I":
            result = "rgb(142, 68, 173)";
            break;
        case "K":
            result = "#2209b7";
            break;
        case "L":
            result = "#759e13";
            break;
        case "M":
            result = "rgb(236, 157, 92)";
            break;
        case "N":
            result = "#bd3d0a";
            break;
        case "O":
            result = "rgb(51 152 219)";
            break;
        case "Ô":
            result = "rgb(241, 196, 15)";
            break;
        case "Ơ":
            result = "rgb(142, 68, 173)";
            break;
        case "P":
            result = "rgb(142, 68, 173)";
            break;
        case "Q":
            result = "rgb(91, 101, 243)";
            break;
        case "R":
            result = "rgb(44, 62, 80)";
            break;
        case "S":
            result = "rgb(122, 8, 56)";
            break;
        case "T":
            result = "rgb(120, 76, 240)";
            break;
        case "U":
            result = "rgb(51 152 219)";
            break;
        case "Ư":
            result = "rgb(241, 196, 15)";
            break;
        case "V":
            result = "rgb(142, 68, 173)";
            break;
        case "X":
            result = "rgb(142, 68, 173)";
            break;
        case "W":
            result = "rgb(211, 84, 0)";
            break;
		}
		return result;
	}

    remove(user: string): void {
        const index = this.user_tam.indexOf(user);
        if (index >= 0) {
            this.list_remove_tam.push(this.user_tam[index]);
            this.user_tam.splice(index, 1);
            for (let i = 0; i < this.list_remove_tam.length; i++) {
                this.itemuser.unshift(this.list_remove_tam[i])
                this.list_remove_tam.splice(i, 1);
            }
            this.listUser = this.userControl.valueChanges
                .pipe(
                    startWith(''),
                    map(state => state ? this._filterStates(state) : this.itemuser.slice())
                );
            setTimeout(() => {
                this.cellClick(this.cellindex);
                document.getElementById('search').focus();
                document.getElementById("row0").scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }


    removeDept(user: string): void {
      const index = this.dept_tam.indexOf(user);
      if (index >= 0) {
          this.list_remove_tam.push(this.dept_tam[index]);
          this.dept_tam.splice(index, 1);
          for (let i = 0; i < this.list_remove_tam.length; i++) {
              this.itemdept.unshift(this.list_remove_tam[i])
              this.list_remove_tam.splice(i, 1);
          }
          this.listDepts = this.deptControl.valueChanges
              .pipe(
                  startWith(''),
                  map(state => state ? this._filterStatesDept(state) : this.itemdept.slice())
              );
          setTimeout(() => {
              this.cellClick(this.cellindex);
              document.getElementById('search').focus();
              document.getElementById("row0").scrollIntoView({ behavior: "smooth" });
          }, 100);
      }
  }
  removeGroup(user: string): void {
    const index = this.group_tam.indexOf(user);
    if (index >= 0) {
        this.list_remove_tam.push(this.group_tam[index]);
        this.group_tam.splice(index, 1);
        for (let i = 0; i < this.list_remove_tam.length; i++) {
            this.itemgroup.unshift(this.list_remove_tam[i])
            this.list_remove_tam.splice(i, 1);
        }
        this.listGroup = this.groupControl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this._filterStatesGroup(state) : this.itemgroup.slice())
            );
        setTimeout(() => {
            this.cellClick(this.cellindex);
            document.getElementById('search').focus();
            document.getElementById("row0").scrollIntoView({ behavior: "smooth" });
        }, 100);
    }
}
    //=========================Xét cell focus==================================
    cellselected: any;
    cellSelect: any = {
        rowInd: 0,
        colInd: 0,
        colName: "",
        _editing: false,
    };
    displayedColumns = [];
    cellClick(rInd: number, colName: string = 'name') {
        this.cellSelect = {
            rowInd: rInd,
            colName: colName,
        };
        let t = document.querySelector(".li.focus");
        let q = document.getElementById("row" + rInd);
        if (t) t.classList.remove("focus");
        if (q) {
            q.classList.add("focus");
            q.focus();
        }
        this.changeDetectorRefs.detectChanges();
    }

    keyArrowInput(e: any, rind: number) {
        switch (e.keyCode) {
            case 8:
                setTimeout(() => {
                    this.cellClick(this.cellindex);
                    document.getElementById('search').focus();
                }, 500);
                break;
            case 13:
                this.selectedEdit(this.cellSelect.rowInd);
                break;
            case 38: // this is the ascii of arrow up
                e.preventDefault();
                break;
            case 40: // this is the ascii of arrow down
                e.preventDefault();
                break;
        }

        rind = this.cellSelect.rowInd;
        // left: 37, up: 38, right: 39, down: 40
        let _move = false;
        // colInd--;
        switch (e.keyCode) {
            case 38: //up, giữ cột, move row
                _move = true;
                if (rind > 0) {
                    rind--;
                }
                break;
            case 40://down, giữ cột, giảm row
                _move = true;
                let listdata = this.GetListData();
                if (rind < listdata.length - 1) {
                    rind++;
                }
                break;
        }
        if (_move) {
            this.cellClick(rind);
            document.getElementById("row" + rind).scrollIntoView({ behavior: "smooth" });
        }

        // this.myScrollContainer.nativeElement.focus();
    }

    selectedEdit(vi: any) {
        if (this.userControl.value == null) {
            this.userControl.setValue("");
        }
        const valie_vie = this.convertVietnamese(this.userControl.value);
        const filterValue = this._normalizeValue(valie_vie);
        let data = this.itemuser.filter(state => this._normalizeValue(this.convertVietnamese(state.HoTen)).includes(filterValue));
        this.addTagName(data[vi]);
    }

    GetListData(): any[] {
        if (this.userControl.value == null) {
            this.userControl.setValue("");
        }
        const valie_vie = this.convertVietnamese(this.userControl.value);
        const filterValue = this._normalizeValue(valie_vie);
        return this.itemuser.filter(state => this._normalizeValue(this.convertVietnamese(state.HoTen)).includes(filterValue));
    }

    convertVietnamese(str: any) {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        // str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");
        // str = str.replace(/-+-/g, "-"); //thay thế khoảng cách bằng ký tự
        str = str.replace(/^\-+|\-+$/g, "");
        str = str.toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, (letter) => { return letter.toUpperCase(); });
        return str;
    }
    //===================================================================================================
    goBack() {
        this.dialogRef.close();
    }

    onSubmit() {
      if(this.type_nember == 0){
        this.dialogRef.close({ data: this.user_tam, type : this.type_nember});
      }
      if(this.type_nember == 1){
        this.dialogRef.close({ data: this.dept_tam, type : this.type_nember});
      }
      if(this.type_nember == 2){
        this.dialogRef.close({ data: this.group_tam, type : this.type_nember});
      }

      if(this.type_nember == 3){
        this.user_tam = []
        this.dept_tam = []
        if(this.thanhvientree){
          var lsData = this.thanhvientree.replace(/,+/g, ',').trim().split(',');
          for (let index = 0; index < lsData.length; index++) {
            const element = lsData[index];
            if(element.includes('##')){
              if(this.lsUserTree){
                let obj = this.lsUserTree.find(x => x.idUser == +element.replace('##',''));
                if (obj) {
                    this.user_tam.push(obj);
                }
              }
            }else{
              if( this.lsDonViTree){
                let obj = this.lsDonViTree.find(x => x.RowID == +element);
                  if (obj) {
                      this.dept_tam.push(obj);
                  }
              }
            }
          }
          this.dialogRef.close({ data: this.user_tam, data2:this.dept_tam, type : this.type_nember});
        }
      }
    }

    changeTypeMember(ev) {
      this.type_nember = ev.value
    }

    OutputNodeIds(ev){
      console.log(ev)
      this.thanhvientree = ev
    }
}
