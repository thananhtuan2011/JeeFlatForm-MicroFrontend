import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, forwardRef, OnChanges, ViewChild } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ArrayDataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, Validators } from '@angular/forms';

interface TreeNode {
  Title: string;
  Children?: TreeNode[];
  RowID: string;
  Level: string;
  Select: boolean
}

@Component({
  selector: 'm-dropdown-tree',
  templateUrl: './dropdown-tree.component.html',
  styleUrls: ['./dropdown-tree.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbDropdownConfig,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownTreeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DropdownTreeComponent),
      multi: true
    }
  ]
})
export class DropdownTreeComponent implements OnChanges, ControlValueAccessor, Validator {
  @Input() data: BehaviorSubject<any[]>;
  @Input() DropdownTitle: string;
  @Input() SelectedNode: BehaviorSubject<any>;
  @Output() SelectedItemTree = new EventEmitter();
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
  @ViewChild(NgbDropdown) dropdownCustom: NgbDropdown;
  constructor() { }
  ngOnChanges(){
    this.selectedNode = {
      Title:'',    
      RowID: ''   
    };
    this.isValid = false;
    this.dataSource = new ArrayDataSource(this.data);
    this.data.subscribe(ev => {      //    
      this.treeControl.dataNodes = ev;
      this.treeControl.expandAll();
    });
    this.SelectedNode.subscribe(sl => {
      if (sl.length != 0) {
        if(sl.RowID&&sl.RowID!="undefined"){
          this.selectedNode = sl;       
          this.getTitle(this.treeControl.dataNodes, this.selectedNode.RowID);  
        }
      }  
      if (this.selectedNode&&this.selectedNode.RowID&&this.selectedNode.RowID!="undefined") {
        this.isValid = true;        
      }
      else {
        this.isValid = false;   
      } 
      this.onChangeCallback(this.selectedNode.RowID); 
    });   
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
    this.SelectedItemTree.emit(node);
    this.selectedNode = node;
    if (this.selectedNode&&this.selectedNode.Title) {
      this.isValid = true;
    }
    else {
      this.isValid = false;
    }
    this.dropdowntreeControl.setValue(this.selectedNode.Title);
    this.onChangeCallback(this.selectedNode.RowID);
    this.dropdownCustom.close();
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
  focusFunction() {
    this.focus = true;
    this.valid = true;
  }
  focusOutFunction() {
    if (!this.selectedNode.RowID) {
      this.valid = false;
    }
    else{
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
    this.SelectedItemTree.emit(this.selectedNode);
    this.dropdowntreeControl.setValue(this.selectedNode.RowID);
    this.onChangeCallback(this.selectedNode.RowID);
  }
  writeValue(obj: any) {
    if (obj === null) {
      this.ClearData();
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
  validate(control: FormControl) { 
    this.control=control;   
    if (control.hasError('required')) {       
      if (!this.isValid) {  
        this.dropdowntreeControl = new FormControl('', Validators.required);
        this.dropdowntreeControl.markAsTouched();
        return  {
          valid: false
        };
      } 
      this.dropdowntreeControl.markAsUntouched(); 
    }  
    return null;
  }
}
