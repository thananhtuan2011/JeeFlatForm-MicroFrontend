import { environment } from '../../../../../../environments/environment';
// Angular
import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Inject,
	ViewChild,
	ElementRef,
	HostListener,
} from "@angular/core";
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
// Material
// RxJS
import { Observable, ReplaySubject, Subscription } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
// Service
import { QueryParamsModel } from 'src/app/modules/auth/models/query-params.model';
import { QuanLyCuocHopService } from '../../../_services/quan-ly-cuoc-hop.service';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';

@Component({
	selector: "app-choose-user-chuan-bi-tai-lieu",
	templateUrl: "./choose-user-chuan-bi-tai-lieu.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooseUserThemTaiLieuComponent implements OnInit {
	toppings = new FormControl("");
	// Public properties
	Form: FormGroup;
	hasFormErrors: boolean = false;
	filterStatic: Observable<string[]>;
	viewLoading: boolean = false;
	listUser: any[] = [];
	customStyle : any = [];
	public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	public userFilterCtrl: FormControl = new FormControl();
  search: string = "";

	/**
	 * Component constructor
	 *
	 * @param dialog: MatDialog
	 * @param data: any
	 * @param QuanLySoTayGhiChuCuocHopFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService,
	 * @param changeDetectorRefs: ChangeDetectorRef
	 */
	constructor(
		public dialogRef: MatDialogRef<ChooseUserThemTaiLieuComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private QuanLySoTayGhiChuCuocHopFB: FormBuilder,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private QLCuocHopService: QuanLyCuocHopService,
		private changeDetectorRefs: ChangeDetectorRef,
		private translate: TranslateService,
    public _JeeChooseMemberService: QuanLyCuocHopService,

	) { }

	/**
	 * On init
	 */
	ngOnInit() {
		this.createForm();
    let queryParams = new QueryParamsModel({});
    const filter: any = {};
    if(this.data.private_meeet){
      filter.private_meeet = true
      queryParams.filter = filter
    }
    filter.private = true
    queryParams.more = true;
    this._JeeChooseMemberService.getDSNhanVien(queryParams).subscribe((res:any) => {
			if (res && res.status === 1) {
				this.listUser = res.data;
        this.filterUsers()
				this.changeDetectorRefs.detectChanges();
			};
        })

	}
	filterUsers() {
		if (!this.listUser) {
			return;
		}

    let search = this.search;
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
	/**
	 * Create form
	 */
	createForm() {
		this.Form = this.QuanLySoTayGhiChuCuocHopFB.group({
			User: [0, [Validators.required, Validators.pattern(/[\S]/)]],
		});
		this.changeDetectorRefs.detectChanges();

	}



	/**
	 * Returns page title
	 */
	getTitle(): string {

		return this.translate.instant("OBJECT.ADD.TITLE", {
			name: this.translate
				.instant("sổ tay cuộc họp").toLowerCase(),
		}); //Thêm mới nhóm cư dân

	}



	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.Form.controls[controlName];
		const result = control.invalid && control.touched;
		return result;

	}


	validateAllFormFields(Form: FormGroup) {
		Object.keys(Form.controls).forEach((field) => {
			const control = Form.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});

	}
	/**
	 * Save data
	 * @param withBack: boolean
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.Form.controls;
    if( controls["User"].value==0)
    {
      const mes = "Vui lòng chọn người thêm tài liệu!";
			this.layoutUtilsService.showActionNotification(
				mes,
				MessageType.Error,
				2000,
				true,
				false,
        0
			);
			return;
    }
		if (this.Form.invalid) {
			Object.keys(controls).forEach((controlName) => {
				controls[controlName].markAsTouched();

			});
			this.hasFormErrors = true;
			this.changeDetectorRefs.detectChanges();
			return;

		}
		let edited = this.prepare();
			this.updateuser(edited);
	}

	updateuser(
		item: any,
		withBack: boolean = false
	) {
		//
		this.viewLoading = true;
		this.QLCuocHopService.UpdateNguoiThemTaiLieu(
			item
		).subscribe((res) => {
			this.viewLoading = false;
			if (res.status == 1) {
				this.layoutUtilsService.showActionNotification(
					"Ủy quyền thành công",
					MessageType.Delete,
					2000,
					true,
					false
				);
				this.dialogRef.close({ item , isEdit: false });
			} else
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Delete,
					2000,
					true,
					false
				);
		});
	}
	DongForm() {
    this.dialogRef.close();
	}
	/**
	 * Returns object for saving
	 */
	prepare(){
		const controls = this.Form.controls;
		var data: any = {};
    data.IdUser = controls["User"].value;
    data.IdMeeting=this.data.IdMeeting;
		return data;

	}

	/**
	 * Close alert
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;

	}

}
