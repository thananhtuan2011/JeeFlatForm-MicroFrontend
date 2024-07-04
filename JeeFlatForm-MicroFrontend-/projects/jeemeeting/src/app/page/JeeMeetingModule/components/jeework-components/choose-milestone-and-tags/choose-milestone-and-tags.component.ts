
import { TagsService } from './../_services/tags.service';
import { LayoutUtilsService, MessageType } from 'projects/jeemeeting/src/modules/crud/utils/layout-utils.service';

// Angular
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
// Material
import { MatDialog } from '@angular/material/dialog';
// RxJS
import { ReplaySubject } from 'rxjs';
// NGRX
//Models

import * as moment from 'moment';
import { JeeWorkLiteService } from './../_services/wework.services';
import { UpdateWorkModel } from './../_model/work.model';
import { WorkService } from './../_services/work.service';
import { milestoneDetailEditComponent } from './../milestone-detail-edit/milestone-detail-edit.component';
import { TranslateService } from '@ngx-translate/core';
import { TagsEditComponent } from './../tags-edit/tags-edit.component';
import { MilestoneModel, TagsModel } from './../_model/department-and-project.model';

@Component({
	selector: 'kt-choose-milestone-and-tags',
	templateUrl: './choose-milestone-and-tags.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
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
		private FormControlFB: FormBuilder,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		public weworkService: JeeWorkLiteService,
		private _service: WorkService,
		private TagsService: TagsService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef
	) { }

	/**
	 * On init
	 */
	ngOnInit() {
		if (this.Loai == "id_milestone") {
			this.weworkService
				.lite_milestone(this.id_project_Team)
				.subscribe((res) => {
					if (res && res.status === 1) {
						this.list = res.data;
						this.changeDetectorRefs.detectChanges();
					}
				});
		} else if (this.Loai == "Tags") {
			this.weworkService
				.lite_tag(this.id_project_Team)
				.subscribe((res) => {
					if (res && res.status === 1) {
						this.list = res.data;
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
		this.weworkService.lite_tag(this.id_project_Team).subscribe((res) => {
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.list = res.data;
				this.changeDetectorRefs.detectChanges();
			}
		});
	}

	selected(id_milestone) {
		if (this.auto) {
			this.ItemSelected.emit(id_milestone);
			return;
		}
		this.model = new UpdateWorkModel();
		this.model.id_row = this.Id;
		this.model.key = this.Loai;
		this.model.value = id_milestone.id_row;
		// this.layoutUtilsService.showWaitingDiv();
		this._service.UpdateByKey(this.model).subscribe((res) => {
			//this.layoutUtilsService.OffWaitingDiv();
			if (res && res.status == 1) {
				this.ItemSelected.emit(id_milestone);
				this.changeDetectorRefs.detectChanges();
				// this.layoutUtilsService.showActionNotification(this.translate.instant('work.dachon'), MessageType.Read, 1000, false, false, 3000, 'top', 1);
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
		this.TagsService.Update(tagItem).subscribe(res => {
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
	Update() {
		this.item_mile.id_project_team = this.id_project_Team;
		let saveMessageTranslateParam = "";
		var _item = new MilestoneModel();
		_item = this.item_mile;
		_item.clear();

		_item.id_project_team = this.id_project_Team;
		saveMessageTranslateParam +=
			_item.id_row > 0
				? "GeneralKey.capnhatthanhcong"
				: "GeneralKey.themthanhcong";
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType =
			_item.id_row > 0 ? MessageType.Update : MessageType.Create;
		const reloadPage = false;
		const dialogRef = this.dialog.open(milestoneDetailEditComponent, {
			data: { _item, reloadPage },
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			} else {
				this.layoutUtilsService.showActionNotification(
					_saveMessage,
					_messageType,
					4000,
					true,
					false
				);
				this.changeDetectorRefs.detectChanges();
			}
		});
	}

	createTags() {
		const ObjectModels = new TagsModel();
		ObjectModels.clear();
		this.CreatedTag(ObjectModels);
	}
	CreatedTag(_item: TagsModel) {
		_item.id_project_team = "" + this.id_project_Team;
		_item.project_team = this.project_team;
		let saveMessageTranslateParam = "";
		saveMessageTranslateParam +=
			_item.id_row > 0
				? "GeneralKey.capnhatthanhcong"
				: "GeneralKey.themthanhcong";
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType =
			_item.id_row > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(TagsEditComponent, {
			data: { _item },
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			} else {
				this.LoadTag();
				// this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
				// this.changeDetectorRefs.detectChanges();
			}
		});
	}

	Create() {
		if (!this.input.nativeElement.value || this.input.nativeElement.value == '') {
			return;
		}
		const ObjectModels = new TagsModel();
		ObjectModels.clear();
		ObjectModels.id_project_team = this.id_project_Team;
		ObjectModels.title = this.input.nativeElement.value;
		ObjectModels.color = this.colorNew;
		this.TagsService.Insert(ObjectModels).subscribe(res => {
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.input.nativeElement.value = "";
				this.LoadTag();
				this.selected(res.data);
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	Delete(id) {
		this.TagsService.Delete(id).subscribe(res => {
			if (res && res.status === 1) {
				this.ItemSelected.emit(true);
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
}
