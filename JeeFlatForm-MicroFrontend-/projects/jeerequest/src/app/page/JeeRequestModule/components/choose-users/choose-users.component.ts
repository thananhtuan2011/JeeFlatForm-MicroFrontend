
// Angular
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Inject, Input, Output, EventEmitter, ViewEncapsulation, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// Material
import { MatDialog } from '@angular/material/dialog';
// RxJS
import { ReplaySubject } from 'rxjs';
import { YeuCauService } from '../../_services/yeu-cau.services';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { LayoutUtilsService } from 'projects/jeerequest/src/modules/crud/utils/layout-utils.service';
// NGRX
// Service
//Models

@Component({
	selector: 'app-choose-users',
	templateUrl: './choose-users.component.html',
    styleUrls: ["./choose-users.component.scss"],
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
	customStyle : any = [];
	public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	public userFilterCtrl: FormControl = new FormControl();
	constructor(
		public dialog: MatDialog,
		private LoaiYeuCauService: YeuCauService,
    private layoutUtilsService: LayoutUtilsService,
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
				let queryParams = new QueryParamsModel({});
				queryParams.more = true;
				this.LoaiYeuCauService.getDSNhanVien(queryParams).subscribe(res => {
					if (res && res.status === 1) {
						this.listUser = res.data;
						// mảng idnv exclude
						if (this.options.excludes && this.options.excludes.length > 0) {
							var arr = this.options.excludes;
							this.listUser = this.listUser.filter(x => !arr.includes(x.idUser));
						}
						this.filterUsers();
						this.changeDetectorRefs.detectChanges();
					};
				});
			}
		}
		if (!this.options.showSearch)
			this.filterUsers();

	}
	filterConfiguration(): any {
		const filter: any = {};
		return filter;
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
				this.listUser.filter(bank => ("@" + bank.HoTen.toLowerCase()).indexOf(search) > -1)
			);
		}
		else {
			this.filteredUsers.next(
				this.listUser.filter(bank => bank.HoTen.toLowerCase().indexOf(search) > -1)
			);
		}
	}
	select(event, user) {
    this.IsSearch.emit(event)
    const dialogRef = this.layoutUtilsService.deleteElement('Xác nhận chuyển tiếp', 'Bạn có muốn chuyển tiếp duyệt yêu cầu cho ' + user.HoTen);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {

				this.IsSearch.emit(event)
		    return false;
			}
		this.ItemSelected.emit(user)
		});
	}
	stopPropagation(event) {
	this.IsSearch.emit(event)
	}


	// setup avatar
	getNameUser(val) {
		if(val){
			var list = val.split(' ');
			return list[list.length - 1];
		}
		return "";
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
}
