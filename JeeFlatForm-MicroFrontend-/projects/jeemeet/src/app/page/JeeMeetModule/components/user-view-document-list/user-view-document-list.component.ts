import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	ChangeDetectorRef,
	Inject,
	NgZone
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
// Material
// import { MatPaginator, MatSort, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
// RXJS
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { BehaviorSubject, fromEvent, merge } from "rxjs";
//Datasource
//Service

// import {
// 	LayoutUtilsService,
// 	QueryParamsModel,
// 	MessageType,
// } from "../../../../../../core/_base/crud";
//Model
import { TranslateService } from "@ngx-translate/core";
// Table with EDIT item in new page

//import { QLCuocHopService } from '../quan-ly-cuoc-hop-service/quan-ly-cuoc-hop.service';
import { filter } from "lodash";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { QuanLyCuocHopService } from "../../_services/quan-ly-cuoc-hop.service";
import { LayoutUtilsService } from "projects/jeemeet/src/modules/crud/utils/layout-utils.service";
// import { VoteDetailComponent } from "../vote-detail/vote-detail.component";


@Component({
	selector: "user-view-document-list",
	templateUrl: "./user-view-document-list.component.html",
	styleUrls: ['./user-view-document-list.component.scss'],
})


export class UserViewDocumentListComponent implements OnInit {
	displayedColumns = [];
	R: any = {};

	@ViewChild("paginator", { static: true })
	paginator: MatPaginator;
	@ViewChild("sort1", { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild("searchInput", { static: true }) searchInput: ElementRef;
	selection = new SelectionModel<any>(true, []);
	ViewerDocumentResult: any[] = [];
	resultImport: any;
	showResultImport: boolean = false;
	listPage: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(
		Array.from(new Array(10), (val, index) => index)
	);
	ViewerDocument: any = {};
	pageSize: number = 5;
	dataSource: any[] = [];
	viewLoading: boolean = false;


	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public QLCuocHopService: QuanLyCuocHopService,
		public dialog: MatDialog,
		private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService,
		private _ngZone: NgZone,
		public dialogRef: MatDialogRef<UserViewDocumentListComponent>,
		private changeDetectorRefs: ChangeDetectorRef,

	) { }
	ngOnInit() {
		this.ViewerDocument = this.data._data;
		if (this.data.type == 1) {
			this.QLCuocHopService.getdetail_ViewerDocumentThuMoi(this.ViewerDocument.IdM, this.ViewerDocument.IdDocument).subscribe(res => {
				if (!res.data) {
					return;
				}
				this.dataSource = this.GroupDept(res.data);
				this.changeDetectorRefs.detectChanges();
			});
		} else if (this.data.type == 2) {
			this.QLCuocHopService.getdetail_ViewerCuocHop(this.ViewerDocument.IdM).subscribe(res => {
				if (!res.data) {
					return;
				}
				this.dataSource = this.GroupDept(res.data);
				this.changeDetectorRefs.detectChanges();
			});

		} else {
			this.QLCuocHopService.getdetail_ViewerDocument(this.ViewerDocument.IdM, this.ViewerDocument.IdDocument).subscribe(res => {
				if (!res.data) {
					return;
				}
				this.dataSource = this.GroupDept(res.data);
				this.changeDetectorRefs.detectChanges();
			});

		}
	}

	GroupDept(inputArray) {
		const resultArray = inputArray.reduce((acc, curr) => {
			if (curr.StructureID !== 0 && curr.Department) {
				const existingDept = acc.find(item => item.StructureID === curr.StructureID);
				if (existingDept) {
					existingDept.listUser.push(curr);
				} else {
					acc.push({ StructureID: curr.StructureID, DepartmentName: curr.Department, listUser: [curr] });
				}
			}
			return acc;
		}, []);
		return resultArray;
	}

	changehtml(text) {
		return text.replace(/\r?\n|\r/g, '<br>');
	}

	ngAfterViewInit() {
	}


	ngOnDestroy() {
		// this.QLCuocHopService.disconnectToken(this.ViewerDocument.IdM + "")

	}

	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.keyword = searchText;
		if (this.ViewerDocument.IdM) {
			filter.IdM = this.ViewerDocument.IdM;
		}

		return filter;

	}
	menuChange(e: any, type: 0 | 1 = 0) {
		// this.layoutUtilsService.menuSelectColumns_On_Off();

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


}
