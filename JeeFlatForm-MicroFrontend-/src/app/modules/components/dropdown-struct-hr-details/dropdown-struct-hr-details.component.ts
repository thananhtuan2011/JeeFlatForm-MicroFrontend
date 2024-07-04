import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, forwardRef, OnChanges, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DropdownStructControlService } from './Services/dropdown-struct-control.service';

interface TreeNode {
  Title: string;
  Children?: TreeNode[];
  RowID: string;
  Level: string;
  Select: boolean
}

export class DataItem {
  public id:string;
  public title:string;
  constructor(id,title){
     this.id=id;
     this.title=title
  }
}

@Component({
  selector: 'm-dropdown-struct-hr-details',
  templateUrl: './dropdown-struct-hr-details.component.html',
  styleUrls: ['./dropdown-struct-hr-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbDropdownConfig,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownStructHRDetailsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DropdownStructHRDetailsComponent),
      multi: true
    }
  ]
})
export class DropdownStructHRDetailsComponent implements OnChanges, ControlValueAccessor, Validator {
  @Input() data: BehaviorSubject<any[]>;
  @Input() DropdownTitle: string = 'Phòng ban/bộ phận';
  @Input() SelectedNode: BehaviorSubject<any>;
  @Input() type: number;
  @Output() SelectedItemTree = new EventEmitter();
  @Input() AllowSearch: boolean = false //True - Hiện ô search, False - Ẩn ô search
  @Input() SearchLabel: string = "Nhập tên phòng ban để tìm kiếm"; // Label của ô search
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
  selected_value: string;
  selected_menu: any[] = [];

  constructor(
    public dialog: MatDialog,
    private _DropdownStructControlService: DropdownStructControlService,
    private _ChangeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnChanges() {
    if (this.type == 1) {
      this.selectedNode = {
        Title: '',
        RowID: ''
      };
      this.dataSource = new ArrayDataSource(this.data);
      this.data.subscribe(ev => {      //    
        this.treeControl.dataNodes = ev;
        this.treeControl.expandAll();
      });
    }
  };

  hasChild = (_: number, node: TreeNode) => !!node.Children && node.Children.length > 0;

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
  SelectItemTree(node: TreeNode) {
    if (this.IsLoad && +node.RowID > 0) {
      this.txtVal.nativeElement.value = "";
      this.dataSource = new ArrayDataSource(this.data);
      this.data.subscribe(ev => {      //    
        this.treeControl.dataNodes = ev;
        this.treeControl.expandAll();
      });
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
        this.getTitle(element.Children, ID);//element.children		
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
        this.getText(obj);
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
  getText(id_ward: string) {
    this._DropdownStructControlService.Get_Text_HR(id_ward)
      .then(res => {
        if (res.status == 1 && res.data.length > 0) {
          this.dropdowntreeControl.setValue(res.data[0].Title);
          this.selectedNode = {
            Title: res.data[0].Title,
            RowID: +id_ward
          };
          this._ChangeDetectorRef.detectChanges();
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

  @ViewChild('txtVal', { static: false }) txtVal: ElementRef;
  filterChanged(filterText: string) {
    let filteredTreeData: TreeNode[] = [];
    if (filterText) {
      // Filter the tree
      function filter(array: TreeNode[], text: string) {
        const getChildren = (result: TreeNode[], object: TreeNode) => {
          if (object.Title.toLowerCase().includes(text.toLowerCase())) {
            result.push(object);
            return result;
          }
          if (Array.isArray(object.Children)) {
            const Children = object.Children.reduce(getChildren, []);
            if (Children.length) result.push({ ...object, Children });
          }
          return result;
        };
        return array.reduce(getChildren, []);
      }
      filteredTreeData = filter(this.data.value, filterText);
    } else {
      // Return the initial tree
      filteredTreeData = this.data.value;
    }
    // Build the tree nodes from Json object. The result is a list of `TreeNode` with nested
    // file node as children.
    const data = filteredTreeData;
    // Notify the change.
    this.dataSource = new ArrayDataSource(data);
    this.treeControl.dataNodes = data;
    this.treeControl.expandAll();
  }
}
