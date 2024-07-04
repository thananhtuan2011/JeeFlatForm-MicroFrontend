import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, forwardRef, OnChanges, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, Validators } from '@angular/forms';
import { DropdownStructControlService } from './Services/dropdown-struct-control.service';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DataItem } from './dropdown-structure.class';
import { MatDialog } from '@angular/material/dialog';
import { DanhMucChungService } from '../../../services/danhmuc.service';

interface TreeNode {
  Title: string;
  Children?: TreeNode[];
  RowID: string;
  Level: string;
  Select: boolean
}

@Component({
  selector: 'm-dropdown-struct-control',
  templateUrl: './dropdown-struct-control.component.html',
  styleUrls: ['./dropdown-struct-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbDropdownConfig,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownStructControlComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DropdownStructControlComponent),
      multi: true
    }
  ]
})
export class DropdownStructControlComponent implements OnChanges, ControlValueAccessor, Validator {
  @Input() data: BehaviorSubject<any[]>;
  @Input() DropdownTitle: string = 'Phòng ban/bộ phận';
  @Input() SelectedNode: BehaviorSubject<any>;
  @Input() type: number;
  @Input() name: string = "";
  @Output() SelectedItemTree = new EventEmitter();
  //====================Trường hợp 1==================
  focus: boolean = false;
  valid: boolean = false;
  treeControl = new NestedTreeControl<TreeNode>(node => node.Children);
  dataSource;
  Title: string = "";
  Placement: string = "bottom-left";
  selectedNode: any;
  dropdowntreeControl = new FormControl();
  isValid: boolean = false;
  control: FormControl;
  //====================Trường hợp 2==================
  @ViewChild(NgbDropdown) dropdownCustom: NgbDropdown;
  @ViewChild('drpsearch') drpsearch: ElementRef;
  current_menu: number = 0;
  current_item_select: string;
  dataSourcesNew: DataItem[];
  dataNew: DataItem[];
  dataNew2: DataItem[];
  selected_value: string;
  selected_menu: any[] = [];

  constructor(
    public dialog: MatDialog,
    private danhMucService: DanhMucChungService,
    private _DropdownStructControlService: DropdownStructControlService,
    private _ChangeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnChanges() {
    if (this.type == 1) { //dạng cây
      this.selectedNode = {
        Title: '',
        RowID: ''
      };
      this.dataSource = new ArrayDataSource(this.data);
      this.data.subscribe(ev => {      
        this.treeControl.dataNodes = ev;
        this.treeControl.expandAll();
      });
      this.onChangeCallback(this.selectedNode.RowID);
    }

    if (this.type == 2) { //dạng search cơ cấu tổ chức
      setTimeout(() => {
        fromEvent(this.drpsearch.nativeElement, 'keydown')
          .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
              this.filterDataSource(this.drpsearch.nativeElement.value);
            })
          )
          .subscribe();
      }, 2000);
      this.getCoCauToChuc(0);
    }

    if (this.type == 3) { //dạng search cơ cấu công việc
      setTimeout(() => {
        fromEvent(this.drpsearch.nativeElement, 'keydown')
          .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
              this.filterDataSource(this.drpsearch.nativeElement.value);
            })
          )
          .subscribe();
      }, 2000);
      this.getCoCauCongViec(0);
    }
  };

  hasChild = (_: number, node: TreeNode) => !!node.Children && node.Children.length > 0;

  changePlacement(e) {
    if (this.type == 3) {
      this.Placement = 'bottom-left';
      return;
    }
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
  SelectItemTree(node: TreeNode) {
    if (this.IsLoad && +node.RowID > 0) {
      this.SelectedItemTree.emit(node);
      this.selectedNode = node;
      if (this.selectedNode && this.selectedNode.Title) {
        this.isValid = true;
      }
      else {
        this.isValid = false;
      }
      this.dropdowntreeControl.setValue(this.selectedNode.Title);
      this.onChangeCallback(this.selectedNode.RowID);
      this.dropdownCustom.close();
    }
  }

  getTitle(data, ID) {
    data.forEach(element => {
      if (element.RowID == ID) {
        this.selectedNode.Title = element.Title;
        return;
      }
      if (element.Children && element.Children.length) {
        this.getTitle(element.Children, ID); //element.children		
      }
    });
  }

  focusOutFunction() {
    if (!this.selectedNode.RowID) {
      this.valid = false;
    }
    else {
      this.dropdowntreeControl.markAsUntouched();
    }
    this.focus = false;
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

  ClearData() {
    this.selectedNode = {
      Title: '',
      RowID: ''
    };
    this.isValid = false;
    this.selected_value = null;
    this.SelectedItemTree.emit(this.selectedNode);
    this.dropdowntreeControl.setValue(this.selectedNode.RowID);
    this.onChangeCallback(this.selectedNode.RowID);
  }
  writeValue(obj: any) {
    if (obj === null) {
      this.ClearData();
    } else {
      if (obj) {
        if (this.type == 3) {
          if (this.name) {
            this.dropdowntreeControl.setValue(this.name);
          }
        }
        else {
          this.getText(obj);
        }
        this.isValid = true;
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
  validate(control: FormControl) {
    let res = new Promise(resolve => {
      setTimeout(() => {
        if (control.hasError('required')) {
          if (!this.isValid || !this.selected_value) {
            this.dropdowntreeControl = new FormControl('', Validators.required);
            this.dropdowntreeControl.markAsTouched();
            return {
              valid: false
            };
          }
          this.dropdowntreeControl.markAsUntouched();
        }
        return null;
      }, 10);
    });
    return null;
  }

  IsLoad: boolean = true;
  // ThemMoiCoCauCon(_item: OrgStructureModel) {
  //   this.IsLoad = false;
  //   _item.IDParent = _item.RowID;
  //   _item.ParentID = _item.RowID;
  //   _item.RowID = '0';
  //   _item.Title = '';
  //   _item.Position = '';
  //   _item.Level = '';
  //   _item.Code = '';
  //   _item.WorkingModeID = '';
  //   this.CapNhatCapCoCau(_item);
  // }
  // ThemMoiCoCau(_item: OrgStructureModel) {
  //   this.IsLoad = false;
  //   _item.IDParent = _item.Parentid;
  //   _item.ParentID = _item.Parentid;
  //   _item.RowID = '0';
  //   _item.Title = '';
  //   _item.Position = '';
  //   _item.Level = '';
  //   _item.Code = '';
  //   _item.WorkingModeID = '';
  //   this.CapNhatCapCoCau(_item);
  // }
  // CapNhatCapCoCau(_item: OrgStructureModel) {
  //   const dialogRef = this.dialog.open(CoCauToChucEditComponent, { data: { _item }, });
  //   dialogRef.afterClosed().subscribe(res => {
  //     this.IsLoad = true;
  //     this.getTreeValue();
  //     this.dropdownCustom.close();
  //   });
  // }

  getTreeValue() {
    // this.danhMucService.Get_CoCauToChuc_Add().subscribe(res => {
    //   if (res.data && res.data.length > 0) {
    //     this.data.next(res.data);
    //     this.dataSource = new ArrayDataSource(res.data);
    //     this.data.subscribe(ev => {
    //       this.treeControl.dataNodes = ev;
    //       this.treeControl.expandAll();
    //     });
    //   }
    // });
  }

  getText(id_ward: string) {
    this._DropdownStructControlService.Get_Text(id_ward)
      .then(res => {
        if (res.status == 1 && res.data.length > 0) {
          if (res.orgchart_type == 1) {
            this.dropdowntreeControl.setValue(res.data[0].Title);
            this.selectedNode = {
              Title: res.data[0].Title,
              RowID: +id_ward
            };
          } else {
            this.dropdowntreeControl.setValue(res.data2);
            this.current_item_select = res.data2;
          }
        }
      });
  }
  //====================================================================================================================
  filterDataSource(key: string) {
    this.dataSourcesNew = this.dataNew.filter(option =>
      this.deaccent(option.title.toLowerCase()).includes(this.deaccent(key.toLowerCase())));
    this._ChangeDetectorRef.detectChanges();
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

  getCoCauToChuc(id) {
    this._DropdownStructControlService.Get_CoCauToChuc(false, true).then(res => {
      if (res.status == 1 && res.data.length > 0) {
        this.dataNew = res.data.map(d => { return { id: d.RowID, title: d.Title, IsUnit: d.IsUnit, DepartmentID: d.DepartmentID, RowID: d.RowID }; });
        this.dataSourcesNew = Object.assign([], this.dataNew);
        this._ChangeDetectorRef.detectChanges();
      } else {
        this.dropdowntreeControl.setValue(this.current_item_select);
        this.current_menu = 0;
        this.current_item_select = "";
        this.dropdownCustom.close();
        if (res.data.length == 0 && id != 0) {
          this.getCoCauToChuc(0);
        } else {
          this.dataSourcesNew = Object.assign([]);
          this._ChangeDetectorRef.detectChanges();
        }
      }
    });
  }

  getCoCauToChuc_Details(item) {
    this._DropdownStructControlService.Get_CoCauToChuc_Details(item.id).then(res => {
      if (res.status == 1 && res.data.length > 0) {
        this.dataNew = res.data.map(d => { return { id: d.RowID, title: d.Title, IsUnit: d.IsUnit, DepartmentID: d.DepartmentID, RowID: d.RowID }; });
        this.dataSourcesNew = Object.assign([], this.dataNew);
        this._ChangeDetectorRef.detectChanges();
      } else {
        if (item.IsUnit) {
          this.dropdowntreeControl.setValue(this.current_item_select);
          this.selected_value = '' + item.id;
          this.onChangeCallback(item.id);
          this.current_menu = 0;
          this.SelectedItemTree.emit(item);
          this.dropdownCustom.close();
          if (res.data.length == 0 && item.id != 0) {
            this.getCoCauToChuc(0);
          } else {
            this.dataSourcesNew = Object.assign([]);
            this._ChangeDetectorRef.detectChanges();
          }
        } else {
          this.current_item_select = "";
          this.current_menu = 0;
          this.selected_value = '';
          this.dropdowntreeControl.setValue('');
          this.dropdownCustom.close();
          if (res.data.length == 0 && item.id != 0) {
            this.getCoCauToChuc(0);
          } else {
            this.dataSourcesNew = Object.assign([]);
            this._ChangeDetectorRef.detectChanges();
          }
        }
      }
    });
  }

  ChangeDropdown(item) {
    if (this.current_menu == 0) {
      this.getCoCauToChuc_Details(item);
      this.selected_menu[this.current_menu] = item;
      this.current_item_select = item.title;
      this.current_menu = this.current_menu + 1;
      this.drpsearch.nativeElement.value = "";
      this.selected_value = item.id;
      // this.onChangeCallback(item.id);
    } else {
      this.getCoCauToChuc_Details(item);
      this.selected_menu[this.current_menu] = item;
      this.current_item_select = item.title + ", " + this.current_item_select;
      this.current_menu = this.current_menu + 1;
      this.drpsearch.nativeElement.value = "";
      this.selected_value = item.id;
      // this.onChangeCallback(item.id);
    }
  }

  backMenu() {
    this.current_menu--;
    if (this.current_menu == 0) {
      this.current_item_select = "";
      this.getCoCauToChuc(0);
    } else {
      this.getCoCauToChuc_Details(this.selected_menu[this.current_menu - 1]);
      this.selected_menu.map((sl, index) => {
        // if (index < this.current_menu) {
        //   this.current_item_select += ", " + sl.title;
        // }
        if (index == this.current_menu) {
          this.current_item_select = this.current_item_select.replace(sl.title + ',', '');
        }
      })
      this.selected_menu.slice(this.current_menu + 1, 1);
    }
  }

  Choose(item) {
    if(this.current_item_select == "" || this.current_item_select == undefined || this.current_item_select == null){
      this.current_item_select = item.title;
    } else{
      this.current_item_select = item.title + ", " + this.current_item_select;
    }
    this.dropdowntreeControl.setValue(this.current_item_select);
    this.selected_value = item.id;
    this.onChangeCallback(item.id);
    this.SelectedItemTree.emit(item);
    this.current_menu = 0;
    this.current_item_select = "";
    this.dropdownCustom.close();
    this.getCoCauToChuc(0);
  }


  //Công việc ============================================================================
  getCoCauCongViec(id) {
    this._DropdownStructControlService.Get_CoCauCongViec(id).subscribe(res => {
      if (res.status == 1 && res.data.length > 0) {
        this.dataNew2 = res.data.map(d => { 
          return { id: d.rowId, title: d.title, iswork: d.iswork, forecast: d.forecast, solution: d.solution, groupId: d.groupId, giaokhoan_groupId: d.giaokhoan_groupId, description: d.description, donViId: d.donViId, RowID: d.rowId }; 
        });
        this.dataSourcesNew = Object.assign([], this.dataNew2);
        this._ChangeDetectorRef.detectChanges();
      } else {
        this.dropdowntreeControl.setValue(this.current_item_select);
        this.current_menu = 0;
        this.current_item_select = "";
        this.dropdownCustom.close();
        if (res.data.length == 0 && id != 0) {
          this.getCoCauCongViec(0);
        } else {
          this.dataSourcesNew = Object.assign([]);
          this._ChangeDetectorRef.detectChanges();
        }
      }
    });
  }

  getCoCauCongCV_Details(item) {
    this._DropdownStructControlService.Get_CoCauCongViec(item.id).subscribe(res => {
      if (res.status == 1 && res.data.length > 0) {
        this.dataNew2 = res.data.map(d => { 
          return { id: d.rowId, title: d.title, iswork: d.iswork, forecast: d.forecast, solution: d.solution, groupId: d.groupId, giaokhoan_groupId: d.giaokhoan_groupId, description: d.description, donViId: d.donViId, RowID: d.rowId }; 
        });
        this.dataSourcesNew = Object.assign([], this.dataNew2);
        this._ChangeDetectorRef.detectChanges();
      } else {
        if (item.iswork) {
          this.dropdowntreeControl.setValue(this.current_item_select);
          this.selected_value = '' + item.id;
          this.onChangeCallback(item.id);
          this.current_menu = 0;
          this.SelectedItemTree.emit(item);
          this.dropdownCustom.close();
          if (res.data.length == 0 && item.id != 0) {
            this.getCoCauCongViec(0);
          } else {
            this.dataSourcesNew = Object.assign([]);
            this._ChangeDetectorRef.detectChanges();
          }
        } else {
          this.current_item_select = "";
          this.current_menu = 0;
          this.selected_value = '';
          this.dropdowntreeControl.setValue('');
          this.dropdownCustom.close();
          if (res.data.length == 0 && item.id != 0) {
            this.getCoCauCongViec(0);
          } else {
            this.dataSourcesNew = Object.assign([]);
            this._ChangeDetectorRef.detectChanges();
          }
        }
      }
    });
  }

  ChangeDropdownCV(item) {
    if (item.iswork) { //click dấu check hay click tên công việc đều được chọn
      this.ChooseCV(item)
    }
    else {
      if (this.current_menu == 0) {
        this.getCoCauCongCV_Details(item);
        this.selected_menu[this.current_menu] = item;
        this.current_item_select = item.title;
        this.current_menu = this.current_menu + 1;
        this.drpsearch.nativeElement.value = "";
        this.selected_value = item.id;
      } else {
        this.getCoCauCongCV_Details(item);
        this.selected_menu[this.current_menu] = item;
        this.current_item_select = item.title + " < " + this.current_item_select;
        this.current_menu = this.current_menu + 1;
        this.drpsearch.nativeElement.value = "";
        this.selected_value = item.id;
      }
    }
  }

  backMenuCV() {
    this.current_menu--;
    if (this.current_menu == 0) {
      this.current_item_select = "";
      this.getCoCauCongViec(0);
    } else {
      this.getCoCauCongCV_Details(this.selected_menu[this.current_menu - 1]);
      this.selected_menu.map((sl, index) => {
        if (index == this.current_menu) {
          this.current_item_select = this.current_item_select.replace(sl.title + ' < ', '');
        }
      })
      this.selected_menu.slice(this.current_menu + 1, 1);
    }
  }

  ChooseCV(item) {
    if (this.current_item_select == "" || this.current_item_select == undefined || this.current_item_select == null) {
      this.current_item_select = item.title;
    } else {
      this.current_item_select = item.title + " < " + this.current_item_select;
    }
    this.current_item_select = item.title
    this.dropdowntreeControl.setValue(this.current_item_select);
    this.selected_value = item.id;
    this.name = item.title;
    this.onChangeCallback(item.id);
    this.SelectedItemTree.emit(item);
    this.current_menu = 0;
    this.current_item_select = "";
    this.dropdownCustom.close();
    this.getCoCauCongViec(0);
  }

}
