import {
	Component,
	OnInit,
	Input,
	ChangeDetectionStrategy, 
	SimpleChange,
	Output,
	EventEmitter,
	ElementRef,
	ViewChild,
	ChangeDetectorRef,
} from "@angular/core";

import {
	Observable,
	fromEvent,
	of,
	Subject,
	BehaviorSubject,
	ReplaySubject,
} from "rxjs";
import { distinctUntilChanged, tap, debounceTime } from "rxjs/operators";
import {
	FormGroup,
	FormBuilder,
	FormControl,
	Validators,
} from "@angular/forms";
import { Moment } from "moment";
import * as moment from "moment";
import { TranslateService } from "@ngx-translate/core";
import { DynamicFormService } from "./../dynamic-form.service"; 

import { tinyMCE } from "../tinyMCE";
import { LayoutUtilsService, MessageType } from "projects/jeerequest/src/modules/crud/utils/layout-utils.service";
// import { DashboardComponent } from "../../../gui-yeu-cau/gui-yeu-cau.component";
@Component({
	selector: "m-dynamic-form-copy",
	templateUrl: "./dynamic-form-copy.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormCopyComponent implements OnInit {
	ClickGui:any
	formControls: FormGroup;
	itemForm: FormGroup;
	showSearch: boolean = false;
	controls: any[] = [];
	listData: any[] = [];
	listControls: any[] = [];
	@Input() ID: number;
	@Input() TenYeuCau: string;
	@Input() MoTaYeuCau: string;
	@Input() TypeID: any;
	@Input() ViewData: any;
	@Input() datayeucau:any
	@Input() TenLoaiYeuCau:any
	@Output() Close = new EventEmitter();
	sotienFormat: string = '';
	@Output() TAT = new EventEmitter(); 
	@ViewChild("focusInput", { static: true }) focusInput: ElementRef;
	tinyMCE: any = {};
	value_default:any
	constructor(
		public dynamicFormService: DynamicFormService,
		private fb: FormBuilder,
		private layoutUtilsService: LayoutUtilsService, 
        private changeDetectorRefs: ChangeDetectorRef,
	) {
	}
	

	ngOnChanges(changes: SimpleChange) {
		if (changes["ViewData"]) {
			this.ngOnInit();
		}
	}
	ngAfterViewInit() {
		setTimeout(() =>this.focusInput.nativeElement.focus(), 500 );
	 }
	ngOnInit(): void {
		this.tinyMCE = Object.assign({}, tinyMCE);
		this.TenLoaiYeuCau;
		this.viewForm();
		this.controls = this.ViewData;
		this.formControls.valueChanges.subscribe(form =>{
			for (var i = 0; i < this.controls.length; i++) {
				let control = this.controls[i];
				if (control.ControlID == 2) {
					if(form[control.RowID]){ 
						this.formControls.patchValue({
							[control.RowID]: this.f_currency(form[control.RowID])
						},{emitEvent:false}) 
					}
				}
			} 
		}) 
	}

	viewForm() {
		this.controls = this.ViewData;
		console.log(this.controls)
		for (var i = 0; i < this.controls.length; i++) {
			let index = i;
			if (this.controls[i].APIData) {
				if (
					this.controls[index].ControlID == 5 ||
					this.controls[index].ControlID == 6 ||
					this.controls[index].ControlID == 9 ||
					this.controls[index].ControlID == 11 ||
					this.controls[index].ControlID == 16
				) {
					let LinkAPI = "";
					LinkAPI =
						this.controls[index].APIData +
						this.controls[index].RowID;
 
					if (
						this.controls[index].ControlID == 5 ||
						this.controls[index].ControlID == 6 ||
						this.controls[index].ControlID == 9 ||
						this.controls[index].ControlID == 16
					) {
						
						this.dynamicFormService
							.getInitData(LinkAPI)
							.subscribe((res) => {
								if (res.data.length > 0) {
									this.controls[index].init = 
									res.data;
								} else {
									this.controls[index].init = [];
								}
								this.changeDetectorRefs.detectChanges();
							});
					} else {
						this.dynamicFormService
							.getInitData(LinkAPI)
							.subscribe((res) => {
								this.controls[index].init = new BehaviorSubject(
									[]
								);
								if (res.data.length > 0) {
									this.controls[index].init.next(res.data);
								} else {
									this.controls[index].init.next([]);
								}
								this.changeDetectorRefs.detectChanges();
							});
					}
				}
			}
		}
		this.createViewForm();
	}

	createViewForm() {
		let item = {};
		this.formControls = this.fb.group(item);
		this.formControls.addControl(
			"MoTaYC",
			new FormControl(""+ this.MoTaYeuCau)
		);
		this.formControls.addControl(
			"tenYeuCau",
			new FormControl(this.TenYeuCau+ " (Sao chép)")
		);
		for (var i = 0; i < this.controls.length; i++) {
			let control = this.controls[i];
			if (control.ControlID == 6) {
				this.formControls.addControl(
					control.RowID,
					new FormControl(control.Files ? control.Files : "")
				);
			} else if (control.ControlID == 7 || control.ControlID == 8) {
				this.formControls.addControl(
					control.RowID,
					new FormControl(control.Value == "True" ? true : false)
				);
			} else if (
				control.ControlID == 10 ||
				control.ControlID == 12 ||
				control.ControlID == 13 ||
				control.ControlID == 14
			) 
			{
				this.formControls.addControl(
					control.RowID,
					new FormControl(control.Files ? control.Files : [])
				);
			}  else if (
				control.ControlID == 5  
			) 
			{
				this.formControls.addControl(
					control.RowID,
					new FormControl(control.Value ?parseInt(control.Value) : "")
				);
			} else if (
				control.ControlID == 2  
			) 
			{
				this.formControls.addControl(
					control.RowID,
					new FormControl(control.Value ? "" + control.Value : "")
				);
				this.sotienFormat = control.Value ? "" + control.Value : ""
			}else { 
				this.formControls.addControl(
					control.RowID,
					new FormControl(control.Value ? "" + control.Value : "")
				); 
			}
			if (control.Required) {
				this.formControls.controls["" + control.RowID].markAsTouched();
			}
			this.formControls.controls["" + "MoTaYC"].markAsTouched();
		}
	}
	GetValueNode(val: any, item: any) {
        let StructID = val.RowID;
        let obj = this.controls.find(x => x.RowID === item.DependID);
        let index = this.controls.findIndex(x => x.RowID === item.DependID);
        let LinkAPI = obj.APIData + StructID;
        this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
            if (res.data.length > 0) {
                this.controls[index].init = res.data;
            } else {
                this.controls[index].init = [];
            }
			this.changeDetectorRefs.detectChanges();
        });
    }
	GuiYeuCau() {
		let isFlag = true;
		let str = "";
		const controls = this.formControls.controls;
		if (this.formControls.invalid) {
			Object.keys(controls).forEach((controlName) =>
				controls[controlName].markAsTouched()
			);
			const _messageType = "Vui lòng nhập hết các trường bắt buộc";
			this.layoutUtilsService.showActionNotification(
				_messageType,
				MessageType.Update,
				4000,
				true,
				false,
				3000,
				"top",
				0
			);
			this.TATs(); 
			return;
		}

		const updatedegree = this.prepareCustomer();
			this.Create(updatedegree);
	}
	Create(_item: any) {
		this.dynamicFormService.LuuDataFormDong(_item).subscribe((res) => {
			if (res && res.status === 1) {  
				const _messageType = "Yêu cầu của bạn đã được gửi đi";
				this.layoutUtilsService.showActionNotification(
					_messageType,
					MessageType.Update,
					4000,
					true,
					false,
					3000,
					"top"
				);
				this.goBack();
			} else { 
				
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Read,
					9999999999,
					true,
					false,
					3000,
					"top",0
				); 
				this.TATs(); 
			}
		});
	}
	prepareCustomer(): any {
		const controls = this.formControls.controls;
		//=========Xử lý cho phần control thuongwf=====================

		let dataYeuCau = [];
		let _fieldYeuCau = {
			TenYeuCau: controls["tenYeuCau"].value,
			MoTaYeuCau : controls["MoTaYC"].value,
			Id_LoaiYeuCau: this.ID,
		};
		dataYeuCau.push(_fieldYeuCau);
		//=========Xử lý cho phần form động=====================
		let Data_Field = [];
		if (this.controls.length > 0) {
			for (var i = 0; i < this.controls.length; i++) {
				this.value_default = null;
				if (this.controls[i].ControlID == 16){
					let jsonObject = {};
                        this.controls[i].dataTable.map((it, index) => {
                            jsonObject[index] = it;
                        })
					this.value_default = JSON.stringify(jsonObject);
				}else{
					this.value_default = controls[this.controls[i].RowID].value
				}
				let _field = {
					rowID: this.controls[i].RowID,
					controlID: this.controls[i].ControlID,
					Value: this.value_default,
				};

				Data_Field.push(_field);
			}
		}
		let _item = {
			DataFields: Data_Field,
			DataYeuCau: dataYeuCau,
		}; 
		return _item;
	}
	toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
	goBack() {
		this.Close.emit();
	}
	TATs(){
		this.TAT.emit();
	}
	prenventInputNonNumber(event) {
		if (event.which < 48 || event.which > 57) {
			event.preventDefault();
		  }
	  }
	  changeSoTien(v: any) {
		this.sotienFormat = this.f_currency(v);
	  }
	  f_currency(value: any, args?: any): any {
		let nbr = Number((value + '').replace(/,|-/g, ""));
		return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	  }

//=======================Bổ sung xử lý nếu control là table==================
Themdongmoi(item: any) {
	debugger
	let it = {};
	item.init.map((item, index) => {
		it[item.RowID] = "";
	})
	item.dataTable.push(it);
}

getValue(row: any, list: any) {
	let text = "";
	text = row[list.RowID];
	return text;
}
RowChange(val: any, row: any, list: any) {
	row[list.RowID] = val.target.value;
}
XoaRow(row: any, item: any) {
	debugger
	let index = item.dataTable.findIndex(x => x == row);
	item.dataTable.splice(index, 1);
}
//============================================================================
}