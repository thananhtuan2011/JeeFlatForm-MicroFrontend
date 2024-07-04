import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, forwardRef, ElementRef, ViewEncapsulation, Input, OnChanges } from '@angular/core';
import { FormControl, ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DropdownProvinceService } from './Services/dropdown-province.service';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DataItem } from './dropdown-province.class';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'm-dropdown-province',
  templateUrl: './dropdown-province.component.html',
  styleUrls: ['./dropdown-province.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgbDropdownConfig,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownProvinceComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DropdownProvinceComponent),
      multi: true
    }
  ]
})
export class DropdownProvinceComponent implements OnChanges, ControlValueAccessor, Validator {
  @ViewChild(NgbDropdown) dropdownCustom: NgbDropdown;
  @Input() placeholder: string;
  @ViewChild('drpsearch') drpsearch: ElementRef;
  focus: boolean = false;
  valid: boolean = false;
  Placement: string = "bottom-left";
  dropdownCustomControl = new FormControl();
  dataSources: DataItem[];
  data: DataItem[];
  current_menu: number = 0;
  current_item_select: string;
  text_title: string;
  selected_value: string;
  selected_menu: any[] = [0, 0, 0];
  constructor(
    private _dropdownProvinceService: DropdownProvinceService,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }

  ngOnChanges() {
    this.getProvinces();
    fromEvent(this.drpsearch.nativeElement, 'keydown')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.filterDataSource(this.drpsearch.nativeElement.value);
        })
      )
      .subscribe();
  }
  ChangeDropdown(item) {
    if (this.current_menu == 0) {//menu tỉnh
      this.getDistrict(item.id);
      this.selected_menu[this.current_menu] = item;
      this.current_item_select = item.title;
      this.current_menu = 1;
    }
    else if (this.current_menu == 1) {
      this.getWard(item.id);
      this.selected_menu[this.current_menu] = item;
      // this.current_item_select =  this.current_item_select +"<br/>" + item.title ;
      this.current_item_select = item.title + ", " + this.current_item_select;
      // this.text_title= item.title + ", " + this.current_item_select;
      this.current_menu = 2;
    }
    else if (this.current_menu == 2) {
      this.selected_menu[this.current_menu] = item;
      this.current_item_select = item.title + ", " + this.current_item_select;
      // this.text_title= item.title + ", " + this.current_item_select;
      this.dropdownCustomControl.setValue(this.current_item_select);
      this.selected_value = item.id;
      this.onChangeCallback(item.id);
      this.current_menu = 0;
      this.dropdownCustom.close();
      this.getProvinces();
    }
    else {
      this.current_menu = 0;
      this.current_item_select = "";
      this.getProvinces();
    }
    this.drpsearch.nativeElement.value = "";
  }

  backMenu(event) {
    if (this.current_menu <= 2) {
      this.current_menu--;
    }
    if (this.current_menu == 0) {//back menu tỉnh
      this.current_item_select = "";
      this.getProvinces();
    }
    else if (this.current_menu == 1) {//back menu huyện
      this.getDistrict(this.selected_menu[0].id);
      this.current_item_select = this.selected_menu[0].title;
    }
  }
  ClearData() {
    this.selected_value = null;
    this.dropdownCustomControl.setValue(null);
    this.onChangeCallback(null);
  }
  getProvinces() {
    this._dropdownProvinceService.Get_Province().subscribe(res => {
      if (res.status == 1 && res.data.length > 0) {
        this.data = res.data.map(d => { return { id: d.id_row, title: d.Province }; });
        this.dataSources = Object.assign([], this.data);
        this.changeDetectorRefs.detectChanges();
      }
    });
  }
  getDistrict(id_provinces: string) {
    this._dropdownProvinceService.Get_District(id_provinces)
      .subscribe(res => {
        if (res.status == 1 && res.data.length > 0) {
          this.data = res.data.map(d => { return { id: d.ID_Row, title: d.District }; });
          this.dataSources = Object.assign([], this.data);
          this.changeDetectorRefs.detectChanges();
        }
      });
  }
  getWard(id_district: string) {
    this._dropdownProvinceService.Get_Ward(id_district)
      .subscribe(res => {
        if (res.status == 1 && res.data.length > 0) {
          this.data = res.data.map(d => { return { id: d.ID_Row, title: d.Ward }; });
          this.dataSources = Object.assign([], this.data);
          // this.dataSources =res.data.map(d=>{ return {id: d.ID_Row, title: d.Ward} });
          this.changeDetectorRefs.detectChanges();
        }
      });
  }
  getTextWard(id_ward: string) {
    this._dropdownProvinceService.Get_TextWard(id_ward)
      .subscribe(res => {
        if (res.status == 1 && res.data.length > 0) {
          this.dropdownCustomControl.setValue(res.data[0].Title);
          this.changeDetectorRefs.detectChanges();
        }
      });
  }

  filterDataSource(key: string) {
    this.dataSources = this.data.filter(option =>
      this.deaccent(option.title.toLowerCase()).includes(this.deaccent(key.toLowerCase())));
    this.changeDetectorRefs.detectChanges();
  }
  deaccent(value: string) {
    var accents = {
      a: /[aàáạảãâầấậẩẫăằắẳẵặ]/g,
      o: /[oòóọỏõôồốộổỗơờớợởỡ]/g,
      u: /[uùúụủũưưứựửữ]/g,
      i: /[iìíịỉĩ]/g,
      e: /[eèéẹẻẽêềếệểễ]/g,
      y: /[yỳýỵỷỹ]/g,
      d: /[dđ]/g
    }
    for (const key in accents) {
      if (accents.hasOwnProperty(key)) {
        const element = accents[key];
        value = value.replace(element, key);
      }
    }
    return value;
  }
  changePlacement(e) {
    var pos = this.getPosition(e);
    const popupHeight = 150, //chieu cao mac dinh cua dropdown menu
      wtop = e.view.scrollY, //chieu cao cua dinh scroll
      wh = e.view.innerHeight,//chieu cao hien tai
      et = pos.offsetTop,//chieu cao cua element
      wb = wh + wtop, ///window bottom 
      eb = et + popupHeight;// dropdown bottom
    if (eb > wb) {
      this.Placement = 'top-left';
    }
    else {
      this.Placement = 'bottom-left';
    }
  }
  getPosition(event) {
    let offsetLeft = 0;
    let offsetTop = 0;
    let el = event.srcElement;
    while (el) {
      offsetLeft += el.offsetLeft;
      offsetTop += el.offsetTop;
      el = el.offsetParent;
    }
    return { offsetTop: offsetTop, offsetLeft: offsetLeft }
  }
  focusFunction() {
    this.focus = true;
    this.valid = true;
  }
  focusOutFunction() {
    this.focus = false;
  }
  //Control function
  writeValue(obj: any) {
    if (obj === null) {
      this.ClearData();
    }
    else {
      if (obj) {
        this.getTextWard(obj);
        this.selected_value = obj;
      }
    }
  }
  onChangeCallback = (value: string) => {
  };
  onTouchCallback = () => { };

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchCallback = fn;
  }
  // validates the form, returns null when valid else the validation object
  validate(control: AbstractControl) {
    let res = new Promise(resolve => {
      setTimeout(() => {
        if (control.hasError('required')) {
          if (!this.selected_value) {
            this.dropdownCustomControl = new FormControl('', Validators.required);
            this.dropdownCustomControl.markAsTouched();
            return {
              valid: false
            };
          }
          this.dropdownCustomControl.markAsUntouched();
        }
        return null;
      }, 10);
    });
    return null;
    // let ret: ValidationErrors = null;
    //     // Not showing exact calculation to ma
    // if (control.hasError('required')) {      
    //   if (!this.selected_value) {
    //     this.dropdownCustomControl = new FormControl('', Validators.required);
    //     this.dropdownCustomControl.markAsTouched();
    //     return {
    //       valid: false
    //     };
    //   }
    //   this.dropdownCustomControl.markAsUntouched();
    // }
    // return ret;
  }
}

//===============================================Compoenent dùng riêng cho trang nhận hồ sơ online (Không token)=============================
@Component({
  selector: 'm-dropdown-province-rec',
  templateUrl: './dropdown-province.component.html',
  styleUrls: ['./dropdown-province.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgbDropdownConfig,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownProvinceRecComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DropdownProvinceRecComponent),
      multi: true
    }
  ]
})
export class DropdownProvinceRecComponent implements OnChanges, ControlValueAccessor, Validator {
  @ViewChild(NgbDropdown) dropdownCustom: NgbDropdown;
  @Input() placeholder: string;
  @ViewChild('drpsearch') drpsearch: ElementRef;
  focus: boolean = false;
  valid: boolean = false;
  Placement: string = "bottom-left";
  dropdownCustomControl = new FormControl();
  dataSources: DataItem[];
  data: DataItem[];
  current_menu: number = 0;
  current_item_select: string;
  text_title: string;
  selected_value: string;
  selected_menu: any[] = [0, 0, 0];
  ID_Vacancy: number;
  ID_KH: number;
  constructor(
    private _dropdownProvinceService: DropdownProvinceService,
    private changeDetectorRefs: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnChanges() {
    this.activatedRoute.params.subscribe(params => {
      this.ID_Vacancy = params.id_vc;
      this.ID_KH = params.idkh;
      this.getProvinces();
      fromEvent(this.drpsearch.nativeElement, 'keydown')
        .pipe(
          debounceTime(150),
          distinctUntilChanged(),
          tap(() => {
            this.filterDataSource(this.drpsearch.nativeElement.value);
          })
        )
        .subscribe();
    });
  }
  ChangeDropdown(item) {
    if (this.current_menu == 0) {//menu tỉnh
      this.getDistrict(item.id);
      this.selected_menu[this.current_menu] = item;
      this.current_item_select = item.title;
      this.current_menu = 1;
    }
    else if (this.current_menu == 1) {
      this.getWard(item.id);
      this.selected_menu[this.current_menu] = item;
      this.current_item_select = item.title + ", " + this.current_item_select;
      this.current_menu = 2;
    }
    else if (this.current_menu == 2) {
      this.selected_menu[this.current_menu] = item;
      this.current_item_select = item.title + ", " + this.current_item_select;
      this.dropdownCustomControl.setValue(this.current_item_select);
      this.selected_value = item.id;
      this.onChangeCallback(item.id);
      this.current_menu = 0;
      this.dropdownCustom.close();
      this.getProvinces();
    }
    else {
      this.current_menu = 0;
      this.current_item_select = "";
      this.getProvinces();
    }
    this.drpsearch.nativeElement.value = "";
  }

  backMenu(event) {
    if (this.current_menu <= 2) {
      this.current_menu--;
    }
    if (this.current_menu == 0) {//back menu tỉnh
      this.current_item_select = "";
      this.getProvinces();
    }
    else if (this.current_menu == 1) {//back menu huyện
      this.getDistrict(this.selected_menu[0].id);
      this.current_item_select = this.selected_menu[0].title;
    }
  }
  ClearData() {
    this.valid = false;
    this.selected_value = null;
    this.dropdownCustomControl.setValue(null);
    this.onChangeCallback(null);
  }
  getProvinces() {
    this._dropdownProvinceService.Get_Province_Rec(this.ID_Vacancy,this.ID_KH).subscribe(res => {
      if (res.status == 1 && res.data.length > 0) {
        this.data = res.data.map(d => { return { id: d.id_row, title: d.Province }; });
        this.dataSources = Object.assign([], this.data);
        this.changeDetectorRefs.detectChanges();
      }
    });
  }
  getDistrict(id_provinces: string) {
    this._dropdownProvinceService.Get_District_Rec(this.ID_Vacancy, id_provinces,this.ID_KH)
      .subscribe(res => {
        if (res.status == 1 && res.data.length > 0) {
          this.data = res.data.map(d => { return { id: d.ID_Row, title: d.District }; });
          this.dataSources = Object.assign([], this.data);
          this.changeDetectorRefs.detectChanges();
        }
      });
  }
  getWard(id_district: string) {
    this._dropdownProvinceService.Get_Ward_Rec(this.ID_Vacancy, id_district,this.ID_KH)
      .subscribe(res => {
        if (res.status == 1 && res.data.length > 0) {
          this.data = res.data.map(d => { return { id: d.ID_Row, title: d.Ward }; });
          this.dataSources = Object.assign([], this.data);
          // this.dataSources =res.data.map(d=>{ return {id: d.ID_Row, title: d.Ward} });
          this.changeDetectorRefs.detectChanges();
        }
      });
  }
  getTextWard(id_ward: string) {
    this._dropdownProvinceService.Get_TextWard_Rec(id_ward,this.ID_KH)
      .subscribe(res => {
        if (res.status == 1 && res.data.length > 0) {
          this.dropdownCustomControl.setValue(res.data[0].Title);
          this.changeDetectorRefs.detectChanges();
        }
      });
  }

  filterDataSource(key: string) {
    this.dataSources = this.data.filter(option =>
      this.deaccent(option.title.toLowerCase()).includes(this.deaccent(key.toLowerCase())));
    this.changeDetectorRefs.detectChanges();
  }
  deaccent(value: string) {
    var accents = {
      a: /[aàáạảãâầấậẩẫăằắẳẵặ]/g,
      o: /[oòóọỏõôồốộổỗơờớợởỡ]/g,
      u: /[uùúụủũưưứựửữ]/g,
      i: /[iìíịỉĩ]/g,
      e: /[eèéẹẻẽêềếệểễ]/g,
      y: /[yỳýỵỷỹ]/g,
      d: /[dđ]/g
    }
    for (const key in accents) {
      if (accents.hasOwnProperty(key)) {
        const element = accents[key];
        value = value.replace(element, key);
      }
    }
    return value;
  }
  changePlacement(e) {
    var pos = this.getPosition(e);
    const popupHeight = 150, //chieu cao mac dinh cua dropdown menu
      wtop = e.view.scrollY, //chieu cao cua dinh scroll
      wh = e.view.innerHeight,//chieu cao hien tai
      et = pos.offsetTop,//chieu cao cua element
      wb = wh + wtop, ///window bottom 
      eb = et + popupHeight;// dropdown bottom
    if (eb > wb) {
      this.Placement = 'top-left';
    }
    else {
      this.Placement = 'bottom-left';
    }
  }
  getPosition(event) {
    let offsetLeft = 0;
    let offsetTop = 0;
    let el = event.srcElement;
    while (el) {
      offsetLeft += el.offsetLeft;
      offsetTop += el.offsetTop;
      el = el.offsetParent;
    }
    return { offsetTop: offsetTop, offsetLeft: offsetLeft }
  }
  focusFunction() {
    this.focus = true;
    this.valid = true;
  }
  focusOutFunction() {
    this.focus = false;
  }
  //Control function
  writeValue(obj: any) {
    if (obj === null) {
      this.ClearData();
    }
    else {
      if (obj) {
        this.getTextWard(obj);
        this.selected_value = obj;
      }
    }
  }
  onChangeCallback = (value: string) => {
  };
  onTouchCallback = () => { };

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchCallback = fn;
  }
  // validates the form, returns null when valid else the validation object
  validate(control: AbstractControl) {
    let res = new Promise(resolve => {
      setTimeout(() => {
        if (control.hasError('required')) {
          if (!this.selected_value || !this.valid) {
            this.dropdownCustomControl = new FormControl('', Validators.required);
            this.dropdownCustomControl.markAsTouched();
            this.changeDetectorRefs.detectChanges();
            return {
              valid: false
            };
          }
          this.dropdownCustomControl.markAsUntouched();
        }
        return null;
      }, 10);
    });
    return null;
  }
}

//===============================================Compoenent dùng riêng cho trang nhập hồ sơ online (token)=============================
@Component({
  selector: 'm-dropdown-province-token',
  templateUrl: './dropdown-province.component.html',
  styleUrls: ['./dropdown-province.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgbDropdownConfig,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownProvinceTokenComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DropdownProvinceTokenComponent),
      multi: true
    }
  ]
})
export class DropdownProvinceTokenComponent implements OnChanges, ControlValueAccessor, Validator {
  @ViewChild(NgbDropdown) dropdownCustom: NgbDropdown;
  @Input() placeholder: string;
  @Input() token: string;
  @ViewChild('drpsearch',{ static: true }) drpsearch: ElementRef;
  focus: boolean = false;
  valid: boolean = false;
  Placement: string = "bottom-left";
  dropdownCustomControl = new FormControl();
  dataSources: DataItem[];
  data: DataItem[];
  current_menu: number = 0;
  current_item_select: string;
  text_title: string;
  selected_value: string;
  selected_menu: any[] = [0, 0, 0];
  ID_Vacancy: number;

  constructor(
    private _dropdownProvinceService: DropdownProvinceService,
    private changeDetectorRefs: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnChanges() {
    this.getProvinces();
    fromEvent(this.drpsearch.nativeElement, 'keydown')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.filterDataSource(this.drpsearch.nativeElement.value);
        })
      )
      .subscribe();
  }
  ChangeDropdown(item) {
    if (this.current_menu == 0) {//menu tỉnh
      this.getDistrict(item.id);
      this.selected_menu[this.current_menu] = item;
      this.current_item_select = item.title;
      this.current_menu = 1;
    }
    else if (this.current_menu == 1) {
      this.getWard(item.id);
      this.selected_menu[this.current_menu] = item;
      // this.current_item_select =  this.current_item_select +"<br/>" + item.title ;
      this.current_item_select = item.title + ", " + this.current_item_select;
      // this.text_title= item.title + ", " + this.current_item_select;
      this.current_menu = 2;
    }
    else if (this.current_menu == 2) {
      this.selected_menu[this.current_menu] = item;
      this.current_item_select = item.title + ", " + this.current_item_select;
      this.dropdownCustomControl.setValue(this.current_item_select);
      this.selected_value = item.id;
      this.onChangeCallback(item.id);
      this.current_menu = 0;
      this.dropdownCustom.close();
      this.getProvinces();
    }
    else {
      this.current_menu = 0;
      this.current_item_select = "";
      this.getProvinces();
    }
    this.drpsearch.nativeElement.value = "";
  }

  backMenu(event) {
    if (this.current_menu <= 2) {
      this.current_menu--;
    }
    if (this.current_menu == 0) {//back menu tỉnh
      this.current_item_select = "";
      this.getProvinces();
    }
    else if (this.current_menu == 1) {//back menu huyện
      this.getDistrict(this.selected_menu[0].id);
      this.current_item_select = this.selected_menu[0].title;
    }
  }
  ClearData() {
    this.valid = false;
    this.selected_value = null;
    this.dropdownCustomControl.setValue(null);
    this.onChangeCallback(null);
  }
  getProvinces() {
    this._dropdownProvinceService.GetListProvincesByToken(this.token).subscribe(res => {
      if (res.status == 1 && res.data.length > 0) {
        this.data = res.data.map(d => { return { id: d.id_row, title: d.Province }; });
        this.dataSources = Object.assign([], this.data);
        this.changeDetectorRefs.detectChanges();
      }
    });
  }
  getDistrict(id_provinces: string) {
    this._dropdownProvinceService.GetListDistrictByProvinces_Token(this.token, id_provinces)
      .subscribe(res => {
        if (res.status == 1 && res.data.length > 0) {
          this.data = res.data.map(d => { return { id: d.ID_Row, title: d.District }; });
          this.dataSources = Object.assign([], this.data);
          this.changeDetectorRefs.detectChanges();
        }
      });
  }
  getWard(id_district: string) {
    this._dropdownProvinceService.GetListWardByDistrict_Token(this.token, id_district)
      .subscribe(res => {
        if (res.status == 1 && res.data.length > 0) {
          this.data = res.data.map(d => { return { id: d.ID_Row, title: d.Ward }; });
          this.dataSources = Object.assign([], this.data);
          // this.dataSources =res.data.map(d=>{ return {id: d.ID_Row, title: d.Ward} });
          this.changeDetectorRefs.detectChanges();
        }
      });
  }
  getTextWard(id_ward: string) {
    this._dropdownProvinceService.GetWardByWardID_Token(this.token, id_ward)
      .subscribe(res => {
        if (res.status == 1 && res.data.length > 0) {
          this.dropdownCustomControl.setValue(res.data[0].Title);
          this.changeDetectorRefs.detectChanges();
        }
      });
  }

  filterDataSource(key: string) {
    this.dataSources = this.data.filter(option =>
      this.deaccent(option.title.toLowerCase()).includes(this.deaccent(key.toLowerCase())));
    this.changeDetectorRefs.detectChanges();
  }
  deaccent(value: string) {
    var accents = {
      a: /[aàáạảãâầấậẩẫăằắẳẵặ]/g,
      o: /[oòóọỏõôồốộổỗơờớợởỡ]/g,
      u: /[uùúụủũưưứựửữ]/g,
      i: /[iìíịỉĩ]/g,
      e: /[eèéẹẻẽêềếệểễ]/g,
      y: /[yỳýỵỷỹ]/g,
      d: /[dđ]/g
    }
    for (const key in accents) {
      if (accents.hasOwnProperty(key)) {
        const element = accents[key];
        value = value.replace(element, key);
      }
    }
    return value;
  }
  changePlacement(e) {
    var pos = this.getPosition(e);
    const popupHeight = 150, //chieu cao mac dinh cua dropdown menu
      wtop = e.view.scrollY, //chieu cao cua dinh scroll
      wh = e.view.innerHeight,//chieu cao hien tai
      et = pos.offsetTop,//chieu cao cua element
      wb = wh + wtop, ///window bottom 
      eb = et + popupHeight;// dropdown bottom
    if (eb > wb) {
      this.Placement = 'top-left';
    }
    else {
      this.Placement = 'bottom-left';
    }
  }
  getPosition(event) {
    let offsetLeft = 0;
    let offsetTop = 0;
    let el = event.srcElement;
    while (el) {
      offsetLeft += el.offsetLeft;
      offsetTop += el.offsetTop;
      el = el.offsetParent;
    }
    return { offsetTop: offsetTop, offsetLeft: offsetLeft }
  }
  focusFunction() {
    this.focus = true;
    this.valid = true;
  }
  focusOutFunction() {
    this.focus = false;
  }
  //Control function
  writeValue(obj: any) {
    if (obj === null) {
      this.ClearData();
    }
    else {
      if (obj) {
        this.getTextWard(obj);
        this.selected_value = obj;
      }
    }
  }
  onChangeCallback = (value: string) => {
  };
  onTouchCallback = () => { };

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchCallback = fn;
  }
  // validates the form, returns null when valid else the validation object
  validate(control: AbstractControl) {
    let res = new Promise(resolve => {
      setTimeout(() => {
        if (control.hasError('required')) {
          if (!this.selected_value || !this.valid) {
            this.dropdownCustomControl = new FormControl('', Validators.required);
            this.dropdownCustomControl.markAsTouched();
            this.changeDetectorRefs.detectChanges();
            return {
              valid: false
            };
          }
          this.dropdownCustomControl.markAsUntouched();
        }
        return null;
      }, 10);
    });
    return null;
  }
}