import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, forwardRef, ElementRef, ViewEncapsulation, Input, OnChanges, AfterViewChecked, Inject } from '@angular/core';
import { FormControl, ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { map, debounceTime, distinctUntilChanged, tap, startWith } from 'rxjs/operators';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { JeeChooseMemberService } from './services/jee-choose-member.service';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'jee-choose-member',
    templateUrl: './jee-choose-member.component.html',
    styleUrls: ['./jee-choose-member.component.scss'],
})
export class JeeChooseMemberComponent implements OnInit, AfterViewChecked {
    //==============================================================
    itemuser: any[] = [];
    user_tam: any[] = [];
    user_except: any[] = [];
    list_remove_tam: any[] = [];
    listUser: Observable<any[]>;
    userControl = new FormControl();
    @ViewChild('userInput', { static: false }) userInput: ElementRef<HTMLInputElement>;
    //==============================================================
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    public cellindex: number = 0;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<JeeChooseMemberComponent>,
        private _JeeChooseMemberService: JeeChooseMemberService,
        private changeDetectorRefs: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadDanhSachNguoiDung();
        this.scrollToBottom();
        setTimeout(function () { document.getElementById('search').focus(); }, 100);
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollToBottom = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
    //=============================Get danh sách người dùng=======================
    loadDanhSachNguoiDung() {
        this._JeeChooseMemberService.getAllUsers().subscribe(res => {
            this.itemuser = res.data;
            //===Xử lý nếu có data truyền vào
            if (this.data._item.length > 0) {
                this.data._item.map((item, index) => {
                    let obj = this.itemuser.find(x => x.UserId == +item);
                    if (obj) {
                        this.user_tam.push(obj);
                    }
                })
            }
            for (let i = 0; i < this.user_tam.length; i++) {
                let vitri = this.itemuser.findIndex(x => x.UserId == this.user_tam[i].UserId)
                this.itemuser.splice(vitri, 1)
            }
            this.listUser = this.userControl.valueChanges
                .pipe(
                    startWith(''),
                    map(state => state ? this._filterStates(state) : this.itemuser.slice())

                );
            //==============Xử lý nếu có data truyền vào không hiển thị trong danh sách================
            if (this.data._itemExcept && this.data._itemExcept.length) {
                this.data._itemExcept.map((item, index) => {
                    let obj = this.itemuser.find(x => x.UserId == +item);
                    if (obj) {
                        this.user_except.push(obj);
                    }
                })
                for (let i = 0; i < this.user_except.length; i++) {
                    let vitri = this.itemuser.findIndex(x => x.UserId == this.user_except[i].UserId)
                    this.itemuser.splice(vitri, 1)
                }
                this.listUser = this.userControl.valueChanges
                    .pipe(
                        startWith(''),
                        map(state => state ? this._filterStates(state) : this.itemuser.slice())

                    );
            }

            setTimeout(() => {
                this.cellClick(this.cellindex);
            }, 100);
            this.changeDetectorRefs.detectChanges();
        })
    }

    private _filterStates(value: string): any[] {
        const valie_vie = this.convertVietnamese(value);
        const filterValue = this._normalizeValue(valie_vie);
        setTimeout(() => {
            this.cellClick(this.cellindex);
        }, 100);
        return this.itemuser.filter(state => this._normalizeValue(this.convertVietnamese(state.FullName)).includes(filterValue));

    }

    private _normalizeValue(value: string): string {
        return value.toLowerCase().replace(/\s/g, '');
    }

    addTagName(item: any) {
        let vitri;
        var tam = Object.assign({}, item);
        this.user_tam.push(tam);
        for (let i = 0; i < this.user_tam.length; i++) {
            let index = this.itemuser.findIndex(x => x.Username == this.user_tam[i].Username)
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
        document.getElementById("row0").scrollIntoView({ behavior: "smooth" });
    }

    getNameUser(item: any) {
        let name = item.FirstName;
        return name.substring(0, 1).toUpperCase();
    }

    getColorNameUser(item: any) {
        let value = item.FirstName;
        let result = '';
        switch (value) {
            case 'A':
                return (result = 'rgb(51 152 219)');
            case 'Ă':
                return (result = 'rgb(241, 196, 15)');
            case 'Â':
                return (result = 'rgb(142, 68, 173)');
            case 'B':
                return (result = '#0cb929');
            case 'C':
                return (result = 'rgb(91, 101, 243)');
            case 'D':
                return (result = 'rgb(44, 62, 80)');
            case 'Đ':
                return (result = 'rgb(127, 140, 141)');
            case 'E':
                return (result = 'rgb(26, 188, 156)');
            case 'Ê':
                return (result = 'rgb(51 152 219)');
            case 'G':
                return (result = 'rgb(241, 196, 15)');
            case 'H':
                return (result = 'rgb(248, 48, 109)');
            case 'I':
                return (result = 'rgb(142, 68, 173)');
            case 'K':
                return (result = '#2209b7');
            case 'L':
                return (result = 'rgb(44, 62, 80)');
            case 'M':
                return (result = 'rgb(127, 140, 141)');
            case 'N':
                return (result = 'rgb(197, 90, 240)');
            case 'O':
                return (result = 'rgb(51 152 219)');
            case 'Ô':
                return (result = 'rgb(241, 196, 15)');
            case 'Ơ':
                return (result = 'rgb(142, 68, 173)');
            case 'P':
                return (result = '#02c7ad');
            case 'Q':
                return (result = 'rgb(211, 84, 0)');
            case 'R':
                return (result = 'rgb(44, 62, 80)');
            case 'S':
                return (result = 'rgb(127, 140, 141)');
            case 'T':
                return (result = '#bd3d0a');
            case 'U':
                return (result = 'rgb(51 152 219)');
            case 'Ư':
                return (result = 'rgb(241, 196, 15)');
            case 'V':
                return (result = '#759e13');
            case 'X':
                return (result = 'rgb(142, 68, 173)');
            case 'W':
                return (result = 'rgb(211, 84, 0)');
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
        let data = this.itemuser.filter(state => this._normalizeValue(this.convertVietnamese(state.FullName)).includes(filterValue));
        this.addTagName(data[vi]);
    }

    GetListData(): any[] {
        if (this.userControl.value == null) {
            this.userControl.setValue("");
        }
        const valie_vie = this.convertVietnamese(this.userControl.value);
        const filterValue = this._normalizeValue(valie_vie);
        return this.itemuser.filter(state => this._normalizeValue(this.convertVietnamese(state.FullName)).includes(filterValue));
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
        this.dialogRef.close({ data: this.user_tam });
    }
}