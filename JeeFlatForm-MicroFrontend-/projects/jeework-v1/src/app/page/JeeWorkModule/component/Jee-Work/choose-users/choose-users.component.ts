// Angular
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Inject, Input, Output, EventEmitter, ViewEncapsulation, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// Material
import { MatDialog } from '@angular/material/dialog';
// RxJS
import { ReplaySubject } from 'rxjs';
import { WeWorkService } from '../jee-work.servide';
// NGRX
// Service
//Models


@Component({
	selector: 'kt-choose-users',
	templateUrl: './choose-users.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})

export class ChooseUsersComponent implements OnInit, OnChanges {
	// Public properties
	@Input() options: any = {
		showSearch: true,//hiển thị search input hoặc truyền keyword
		keyword: '',
		data: []
	};
	@Input() isNewView = false;
	@Output() ItemSelected = new EventEmitter<any>();
	@Output() IsSearch = new EventEmitter<any>();

	listUser: any[] = [];
	customStyle: any = [];
	public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	public userFilterCtrl: FormControl = new FormControl();
	constructor(
		private FormControlFB: FormBuilder,
		public dialog: MatDialog,
		public weworkService: WeWorkService,
		private changeDetectorRefs: ChangeDetectorRef) { }

	/**
	 * On init
	 */
	ngOnInit() {
		this.userFilterCtrl.valueChanges
			.pipe()
			.subscribe(() => {
				this.filterUsers();
			});
	}
	ngOnChanges() {
		this.userFilterCtrl.setValue('');
		this.listUser = [];

		if (this.options.showSearch == undefined)
			this.options.showSearch = true;
		if (this.options != undefined) {
			if (this.options.data) {
				this.listUser = this.options.data;
				this.filterUsers();
				this.changeDetectorRefs.detectChanges();
			} else {
				// this.weworkService.list_account({}).subscribe(res => {
				// 	if (res && res.status === 1) {
				// 		this.listUser = res.data;
				// 		// mảng idnv exclude
				// 		if (this.options.excludes && this.options.excludes.length > 0) {
				// 			var arr = this.options.excludes;
				// 			this.listUser = this.listUser.filter(x => !arr.includes(x.id_nv));
				// 		}
				// 		this.filterUsers();
				// 		// this.changeDetectorRefs.detectChanges();
				// 	};
				// });
			}
		}
		if (!this.options.showSearch)
			this.filterUsers();

	}
	protected filterUsers() {
		if (!this.listUser) {
			return;
		}

		let search = !this.options.showSearch ? this.options.keyword : this.userFilterCtrl.value;
		if (!search) {
			this.filteredUsers.next(this.listUser.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		// filter the banks
		if (search[0] == '@') {
			this.filteredUsers.next(
				this.listUser.filter(bank => (bank.hoten.toLowerCase()).indexOf(search.replace('@', '')) > -1)
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
