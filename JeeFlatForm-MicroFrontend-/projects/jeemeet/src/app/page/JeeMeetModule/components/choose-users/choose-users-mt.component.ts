
// Angular
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Inject, Input, Output, EventEmitter, ViewEncapsulation, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// Material
import { MatDialog } from '@angular/material/dialog';
// RxJS
import { ReplaySubject } from 'rxjs';
import { DangKyCuocHopService } from '../../_services/dang-ky-cuoc-hop.service';
import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';
@Component({
	selector: 'kt-choose-users-mt',
	templateUrl: './choose-users-mt.component.html',
    styleUrls: ["./choose-users-mt.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})

export class ChooseUsersMTComponent implements OnInit, OnChanges {
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
		private FormControlFB: FormBuilder,
		public dialog: MatDialog,
		private changeDetectorRefs: ChangeDetectorRef,
		public dangKyCuocHopService: DangKyCuocHopService) { }

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
				const queryParams1 = new QueryParamsModelNew(
					this.filterConfiguration(),
					"",
					"",
					0,
					20000,
					false
				);
				this.dangKyCuocHopService.getDSNhanVien(queryParams1).subscribe(res => { 
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
	select(user) {
		this.ItemSelected.emit(user)
	}
	stopPropagation(event) {
	this.IsSearch.emit(event)
	}
}
