// Angular
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Inject, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// Material
import { MatDialog } from '@angular/material/dialog';
// RxJS
import { ReplaySubject } from 'rxjs';
import { WorkwizardChungService } from '../work.service';
// NGRX
// Service
//Models


@Component({
  selector: 'kt-choose-user-v2',
  templateUrl: './choose-user-v2.component.html',
  styleUrls: ['./choose-user-v2.component.scss']
})
export class ChooseUsersV2Component implements OnInit {

	@Input() options: any = {
		showSearch: true,//hiển thị search input hoặc truyền keyword
		keyword: '',
		data: []
	};
	@Input() isActive:boolean=false;
	@Output() ItemSelected = new EventEmitter<any>();
	@Output() IsSearch = new EventEmitter<any>();
	@Output() ItemSelectedActive = new EventEmitter<any>();
	keysearch='';
	listUser: any[] = [];
	customStyle: any = [];
	public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	constructor(
		private FormControlFB: FormBuilder,
		public dialog: MatDialog,
		private changeDetectorRefs: ChangeDetectorRef) { }
	ngOnInit() {
		if (this.options.data) {
			this.listUser = this.options.data;			
			this.filteredUsers.next(
				this.listUser
			);									
			this.changeDetectorRefs.detectChanges();
		}
	}
	ngOnChanges(changes: SimpleChange) {
		if (changes['options'] && changes['options'].currentValue.data) {
			this.listUser = changes['options'].currentValue.data;			
			this.filteredUsers.next(
				this.listUser
			);
			if(this.isActive){
				this.options.keyword=changes['options'].currentValue.keyword;
				this.filterUsers2();
			}						
			this.changeDetectorRefs.detectChanges();
		}
		
	}
	filterUsers() {	
		if (!this.listUser) {
			return;
		}
		let search = !this.options.showSearch ? this.options.keyword : this.keysearch;
		if (!search) {
			this.filteredUsers.next(this.listUser.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		if (search[0] == '@') {
			this.filteredUsers.next(
				this.listUser.filter(bank => (bank.username.toLowerCase()).indexOf(search.replace('@', '')) > -1)
			);
		}
		else {
			search=this.toNonAccentVietnamese(search);
			this.filteredUsers.next(
				this.listUser.filter(bank => this.toNonAccentVietnamese(bank.hoten).toLowerCase().indexOf(search) > -1)
			);
		}
	}
	filterUsers2() {	
		if (!this.listUser) {
			return;
		}
		let search = this.options.keyword;
		if (!search) {
			this.filteredUsers.next(this.listUser.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		if (search[0] == '@') {
			this.filteredUsers.next(
				this.listUser.filter(bank => (bank.username.toLowerCase()).indexOf(search.replace('@', '')) > -1)
			);
		}
		else {
			search=this.toNonAccentVietnamese(search);
			this.filteredUsers.next(
				this.listUser.filter(bank => this.toNonAccentVietnamese(bank.hoten).toLowerCase().indexOf(search) > -1)
			);
		}
	}
	select(user) {
		this.ItemSelected.emit(user)
	}
	stopPropagation(event) {
		this.IsSearch.emit(event)
	}
	toNonAccentVietnamese(str) {
		str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
		str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
		str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
		str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
		str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
		str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
		str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
		str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
		str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
		str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
		str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
		str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
		str = str.replace(/Đ/g, "D");
		str = str.replace(/đ/g, "d");
		// Some system encode vietnamese combining accent as individual utf-8 characters
		str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
		str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
		return str;
  }
}
