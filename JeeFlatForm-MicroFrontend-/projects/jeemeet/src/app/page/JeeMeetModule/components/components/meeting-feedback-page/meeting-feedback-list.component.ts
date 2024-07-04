

import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { SelectionModel } from "@angular/cdk/collections";
import { BehaviorSubject, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { MeetingFeedbackAddComponent } from '../meeting-feedback-add/meeting-feedback-add.component';
import { GroupingState } from '../../../../share/models/grouping.model';
import { PaginatorState } from '../../../../share/models/paginator.model';
import { SortState } from '../../../../share/models/sort.model';
import { QuanLyCuocHopFeedBackService, QuanLyCuocHopService, QuanLyCuocHopYKienService } from '../../../_services/quan-ly-cuoc-hop.service';
import { VoteDetailComponent } from '../../../ql-ykien-gopy/vote-detail/vote-detail.component';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';

const root = '/GetListMeetingFeedback';
@Component({
	selector: 'app-meeting-feedback-page',
	templateUrl: './meeting-feedback-list.component.html'
})
export class MeetingFeedbackPageComponent implements OnInit {
	@Input() idMeeting: number = 0;
	@Input() isAddFeedBack: boolean = false;
	loadingSubject = new BehaviorSubject<boolean>(false);
	viewLoading: boolean = false;
	isCompleted: boolean = false;
	//   MeetingFeedback: any = {};
	filterGroup: FormGroup;
	searchGroup: FormGroup;
	paginator: PaginatorState;
	sorting: SortState;
	grouping: GroupingState;
	isLoading: boolean = false;
	private subscriptions: Subscription[] = [];
	// Filter fields
	// @ViewChild("searchInput", { static: true }) searchInput: ElementRef;
	filterStatus: string = "";
	filterCondition: string = "";
	filterKeyWord: string = "";
	listPage: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(
		Array.from(new Array(10), (val, index) => index)
	);
	QuanLyKhaoSatResult: any = [];
	constructor(
		public productsService: QuanLyCuocHopFeedBackService,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private router: Router,
		private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
	) { }

	ngOnInit() {
		this.loadDataList();
		// this.MeetingFeedback = this.data._data;
		// this.isCompleted = this.data._data.IsCompleted;
		this.grouping = this.productsService.grouping;
		this.paginator = this.productsService.paginator;
		this.sorting = this.productsService.sorting;
		const sb = this.productsService.isLoading$.subscribe((res) => (this.isLoading = res));
		this.productsService.items$.subscribe(
			(res) =>
			(
				this.QuanLyKhaoSatResult = res

			)
		);
		this.subscriptions.push(sb);
	}
	loadDataList() {
		const filter = this.filterConfiguration();
		this.productsService.patchState({ filter }, root);

	}
	paginate(paginator: PaginatorState) {
		const filter = this.filterConfiguration();
		this.productsService.patchState({ filter, paginator }, root);
	}

	filterConfiguration(): any {
		const filter: any = {};
		// const searchText: string = this.searchInput.nativeElement.value;

		// filter.keyword = searchText;
		if (this.idMeeting) {
			filter.IdM = this.idMeeting;
		}

		return filter;

	}

	viewMeetingFeedback(_data) {
		_data.isXem = true;
		const dialogRef = this.dialog.open(MeetingFeedbackAddComponent, {
			data: { _data },
			width: "900px",
		});
		dialogRef.afterClosed().subscribe((res) => { });

	}


	editMeetingFeedback(item: any) {
		const _data: any = {};
		_data.IdRow = item.IdRow;
		_data.IdM = this.idMeeting;
		const dialogRef = this.dialog.open(MeetingFeedbackAddComponent, {
			data: { _data },
			width: "900px",
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			this.loadDataList()
		});

	}


	deleteMeetingFeedback(item: any) {
		let name = this.translate.instant('QL_CUOCHOP.CUOCHOP.FEEDBACK');
		const _title: string = this.translate.instant("OBJECT.DELETE.TITLE", {
			name: name.toLowerCase(),
		});
		const _description: string = this.translate.instant(
			"OBJECT.DELETE.DESCRIPTION",
			{ name: name.toLowerCase() }
		);
		const _waitDesciption: string = this.translate.instant(
			"OBJECT.DELETE.WAIT_DESCRIPTION",
			{ name: name }
		);

		const dialogRef = this.layoutUtilsService.deleteElement(
			_title,
			_description,
			_waitDesciption
		);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			this.productsService
				.deleteMeetingFeedback(item.IdRow, item.IdCuocHop)
				.subscribe((res) => {
					if (res && res.status == 1) {
						this.loadDataList()
						this.layoutUtilsService.showActionNotification(
							res.error.message,
							MessageType.Delete,
							2000,
							true,
							false
						);
						// this.loadList();
					} else {
						this.layoutUtilsService.showActionNotification(
							res.error.message,
							MessageType.Error,
							2000,
							true,
							false
						);
					}
				});
		});

	}

	voteYesMeetingFeedback(item: any) {
		this.viewLoading = true;
		let _data = this.prepareData(item, true);
		this.productsService.voteMeetingFeedback(_data).subscribe((res) => {
			this.viewLoading = false;
			if (res.status == 1) {
				const message = 'Thành công';
				this.loadDataList()
				this.layoutUtilsService.showActionNotification(
					message,
					MessageType.Delete,
					2000,
					true,
					false
				);
			}
			else {
				const message = 'Thất bại';
				this.layoutUtilsService.showActionNotification(
					message,
					MessageType.Error,
					2000,
					true,
					false
				);
			}
		});

	}


	voteNoMeetingFeedback(item: any) {
		this.viewLoading = true;
		let _data = this.prepareData(item, false);
		this.productsService.voteMeetingFeedback(_data).subscribe((res) => {
			this.viewLoading = false;
			if (res.status == 1) {
				const message = 'Thành công';
				this.loadDataList()
				this.layoutUtilsService.showActionNotification(
					message,
					MessageType.Delete,
					2000,
					true,
					false
				);
			}
			else {
				const message = 'Thất bại';
				this.layoutUtilsService.showActionNotification(
					message,
					MessageType.Error,
					2000,
					true,
					false
				);
			}
		});

	}

	prepareData(item: any, voteStatus: boolean) {
		const _data: any = {};

		_data.VoteStatusOld = item.VoteStatus;
		_data.IdCuocHop = item.IdCuocHop;
		_data.IdFeedback = item.IdRow;
		_data.VoteStatus = voteStatus;

		return _data;

	}

	viewDetailVoteYes(item) {
		let _data = Object.assign({}, item);
		_data.VoteStatus = 1;
		this.voteDetail(_data);

	}
	viewDetailVoteNo(item) {
		let _data = Object.assign({}, item);
		_data.VoteStatus = 0;
		this.voteDetail(_data);

	}

	voteDetail(_data) {
		const dialogRef = this.dialog.open(VoteDetailComponent, {
			data: { _data },
			// width: "900px",
		});
		dialogRef.afterClosed().subscribe((res) => { });

	}

	getMetaDescription(val) {
		if (val) {
			let des = val
			if (des.length > 30) {
				des = val.slice(0, 30) + '...';
			}
			return des;
		}

	}

	viewDetail(item) {
		let data = Object.assign({}, item);
		data.AllowDelEdit = false;
		this.viewMeetingFeedback(data);

	}

	xuatExcel() {
		this.productsService.exportExcelGopY(this.idMeeting).subscribe((res: any) => {
			if (res && res.status == 1) {
				const linkSource = `data:application/octet-stream;base64,${res.data}`;
				const downloadLink = document.createElement("a");
				const fileName = res.data_FileName;
				downloadLink.href = linkSource;
				downloadLink.download = fileName;
				downloadLink.click();
			}
			else
				this.layoutUtilsService.showError(this.translate.instant('GeneralKey.ERROREXPORTFILE'));
		});
	}
	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 250;
		return tmp_height + 'px';
	}

	addFeedback() {
		const _data: any = {};
		_data.IdRow = 0;
		_data.IdM = this.idMeeting;
		const dialogRef = this.dialog.open(MeetingFeedbackAddComponent, {
			data: { _data },
			width: "800px",
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
		});
	}
}
