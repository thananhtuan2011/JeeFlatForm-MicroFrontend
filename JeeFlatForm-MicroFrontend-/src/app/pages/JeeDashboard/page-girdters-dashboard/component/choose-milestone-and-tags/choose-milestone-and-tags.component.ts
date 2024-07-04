import { values } from 'lodash';

// Angular
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
// Material
import { MatDialog } from '@angular/material/dialog';
// RxJS
import { ReplaySubject } from 'rxjs';
// NGRX
//Models

import { TranslateService } from '@ngx-translate/core';
import { MilestoneModel, TagsModel, UpdateWorkModel } from '../../Model/work-general.model';
import { WorkGeneralService } from '../../Services/work-general.services';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';

@Component({
	selector: 'kt-choose-milestone-and-tags',
	templateUrl: './choose-milestone-and-tags.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ChooseMilestoneAndTagComponent implements OnInit, OnChanges {
	// Public properties
	@Input() options: any[] = [];
	@Input() showcheck: any = false;
	@Input() item: any = [];
	@Output() ItemSelected = new EventEmitter<any>();
	@Output() Noclick = new EventEmitter<any>();
	@Input() Id?: number = 0;
	@Input() id_project_Team;
	@Input() project_team?: string = "";
	@Input() Id_key?: number = 0;
	@Input() auto = false;
	@Input() Loai?: string = "startdate";
	@ViewChild('input', { static: true }) input: ElementRef;
	colorNew = "rgb(255, 0, 0)";
	public filtered: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	public FilterCtrl: FormControl = new FormControl();
	model: UpdateWorkModel;
	item_mile = new MilestoneModel();
	list: any;
	milestoneSelected = 0;
	listTag: any = [];
	constructor(
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private _WorkGeneralService: WorkGeneralService,
	) { }

	/**
	 * On init
	 */
	ngOnInit() {
		if (this.Loai == "id_milestone") {
			this._WorkGeneralService
				.lite_milestone(this.id_project_Team)
				.subscribe((res) => {
					if (res && res.status === 1) {
						this.list = res.data;
						this.changeDetectorRefs.detectChanges();
					}
				});
		} else if (this.Loai == "Tags") {
			this._WorkGeneralService
				.lite_tag(this.id_project_Team)
				.subscribe((res) => {
					if (res && res.status === 1) {
						this.list = res.data;
						this.setUpDropSearchTags();
						this.changeDetectorRefs.detectChanges();
					}
				});
		}
	}

	ngOnChanges() {
		this.item_mile.id_project_team = this.id_project_Team;
		this.ngOnInit();
	}

	//load task
	list_Tag: any = [];
	LoadTag() {
		this._WorkGeneralService.lite_tag(this.id_project_Team).subscribe((res) => {
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.list = res.data;
				this.setUpDropSearchTags();
				this.changeDetectorRefs.detectChanges();
			}
		});
	}

	selected(id_milestone) {
		this.model = new UpdateWorkModel();
		this.model.id_row = this.Id;
		this.model.key = this.Loai;
		this.model.value = id_milestone.id_row;
		this._WorkGeneralService.UpdateByKey(this.model).subscribe((res) => {
			if (res && res.status == 1) {
				this.ItemSelected.emit(id_milestone);
				this.changeDetectorRefs.detectChanges();
			} else {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Read,
					9999999999,
					true,
					false,
					3000,
					"top",
					0
				);
			}
		});
		this.changeDetectorRefs.detectChanges();
	}
	UpdateTag(color, _item, withBack: boolean = false) {
		let tagItem = new TagsModel();
		tagItem.id_row = _item.id_row;
		tagItem.color = color;
		tagItem.title = _item.title;
		tagItem.id_project_team = this.id_project_Team;
		this._WorkGeneralService.Update(tagItem).subscribe(res => {
			if (res && res.status === 1) {
				this.ItemSelected.emit(true);
				this.LoadTag();
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	createmilestone() { }

	Create() {
		if (!this.input.nativeElement.value || this.input.nativeElement.value == '') {
			return;
		}
		const ObjectModels = new TagsModel();
		ObjectModels.clear();
		ObjectModels.id_project_team = this.id_project_Team;
		ObjectModels.title = this.input.nativeElement.value;
		ObjectModels.color = this.colorNew;
		this._WorkGeneralService.Insert(ObjectModels).subscribe(res => {
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.input.nativeElement.value = "";
				this.bankFilterCtrlTags.setValue('');
				this.LoadTag();
				// this.selected(res.data);
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	Delete(id) {
		this._WorkGeneralService.Delete(id).subscribe(res => {
			if (res && res.status === 1) {
				let item = {
					id_row: id,
					title: "delete"
				}
				this.ItemSelected.emit(item);
				this.LoadTag();
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	stopPropagation(event) {
		this.Noclick.emit(event);
	}

	//====================Xử lý tìm kiếm Tag====================
	public bankFilterCtrlTags: FormControl = new FormControl();
	public filteredBanksTags: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	setUpDropSearchTags() {
		this.bankFilterCtrlTags.setValue('');
		this.filterBanksTags();
		this.bankFilterCtrlTags.valueChanges
			.pipe()
			.subscribe(() => {
				this.filterBanksTags();
			});
	}

	protected filterBanksTags() {
		if (!this.list) {
			return;
		}
		// get the search keyword
		let search = this.bankFilterCtrlTags.value;
		if (!search) {
			this.filteredBanksTags.next(this.list.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		// filter the banks
		this.filteredBanksTags.next(
			this.list.filter(bank => bank.title.toLowerCase().indexOf(search) > -1)
		);
	}
}
