import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';

//TreeNested not TreeFlat
import { MatTreeNestedDataSource } from '@angular/material/tree';

//CDK
import { NestedTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from "@angular/cdk/collections";
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'

//Model:
import { TreeModel } from './mat-dropdown-tree.model'

//Filter:
import { FilterDatabase } from './mat-dropdown-tree.filter'

@Component({
  selector: 'lib-mat-dropdown-tree-component',
  templateUrl: './mat-dropdown-tree.component.html',
  styleUrls: ['./mat-dropdown-tree.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatDropdownTreeComponentComponent),
      multi: true
    }
  ],
})

export class MatDropdownTreeV2ComponentComponent implements ControlValueAccessor, OnChanges {
  /** InputData */
  @Input() InputData: TreeModel[]; //Dữ liệu đầu vào
  @Input() InputLabel: string = "" //Label của ô nhập
  @Input() Disabled: boolean = false; //Đơn giản là disable :)
  @Input() Required: boolean = false; //Bắt buộc

  @Input() InputNodeIds: string = ""


  @Input() DisableNodeIds: string = ""

  @Output() OutputNodeIds = new EventEmitter<string>();
  /** Search */
  @Input() AllowSearch: boolean = true //True - Hiện ô search, False - Ẩn ô search
  @Input() SearchLabel: string = "Nhập tên người dùng, chức vụ hoặc phòng ban và nhấn enter để tìm kiếm"; // Label của ô search
  @Input() EmptyNoti: string = "Không có dữ liệu"; // Thông báo khi không có dữ liệu

  /** Multi/Single Selection */
  @Input() IsMulti: boolean = true; // True - Chọn nhiều, False - chọn một

  @ViewChild(MatAutocompleteTrigger) AutocompleteTrigger!: MatAutocompleteTrigger;
  @ViewChild(MatAutocomplete) auto!: MatAutocomplete;
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  /** Input Value */
  inputValue: any[];
  showData: TreeModel[];
  iddonvi: number;
  /** CDK: */
  recursive: boolean = false;
  treeControl: NestedTreeControl<TreeModel>;
  dataSource: MatTreeNestedDataSource<TreeModel>;

  /** ControlValueAccessor: */
  onChange: any = () => { };
  onTouch: any = () => { };

  /** Selection Item: */
  checklistSelection = new SelectionModel<TreeModel>(true /*false - single, true - multi*/);
  checklistSelectionAll = new SelectionModel<TreeModel>(true /*false - single, true - multi*/);
  /** FormControl: */
  //Control for the selected Data
  public dataCtrl: FormControl;

  /** Control for the filter keyword */
  public dataFilterCtrl: FormControl = new FormControl('');

  /** Selected Node while singel select */
  selectedNode: any;

  constructor(
    private database: FilterDatabase,
  ) {
    //CheckList
    this.checklistSelection = new SelectionModel<TreeModel>(this.IsMulti);
    this.checklistSelectionAll = new SelectionModel<TreeModel>(this.IsMulti);
    //Tree Control
    this.treeControl = new NestedTreeControl<TreeModel>(this.getChildren);

    //Data Source
    this.dataSource = new MatTreeNestedDataSource<TreeModel>();

    this.iddonvi = Number(this.getAuthFromLocalStorage()['user']['customData']['personalInfo'].DepartmemtID);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.InputData.currentValue) {
      if (Array.isArray(changes.InputData.currentValue)) {
        //Set InputData
        this.dataSource.data = this.InputData;

        //Set parent:
        Object.keys(this.dataSource.data).forEach((x: any) => {
          this.setParent(this.dataSource.data[x], null);
        });

        //Filter Data:
        this.database.setTreeData(this.InputData);
        this.database.dataChange.subscribe(data => {
          this.dataSource.data = data;
          this.treeControl.dataNodes = data;
        });

        //When Filter changes
        // this.dataFilterCtrl.valueChanges.subscribe(filterText => {
        //   this.filterChanged(filterText);
        // });

        //Write value:
        this.checklistSelection.changed.subscribe(listSelection => {
          const ListSelection = listSelection.source.selected.filter(item => {
            return true;
          })
          var str = ListSelection.map((obj) => {
            if (obj) {
              if (obj.type == 1) {
                return obj.id
              }
              return obj.userid + '##';
            } else {
              if (obj) {
                return obj.id
              }
            }
          }).join(', ')
          this.OutputNodeIds.emit(str);
        });

        //Set value:
        if (this.inputValue) {
          this.checklistSelection.clear();
          this.checklistSelectionAll.clear();
          for (const id of this.inputValue) {
            const child = this.findChildById(id);
            if (!child) continue;
            switch (true) {
              case !this.IsMulti:
                this.clickNode(child);
                this.expandParent(child);
                break;
              case this.IsMulti:
                this.todoItemSelectionToggle(child);
                break;
            }
          }
        }

        //Set Required for FormControl:
        if (this.Required) {
          this.dataCtrl.setValidators(Validators.required);
          this.dataCtrl.updateValueAndValidity();
        }



        if (this.InputNodeIds && this.InputNodeIds != ',') {
          const lsData = this.InputNodeIds.replace(/,+/g, ',').trim().split(',');
          const selectedItems = lsData.map(element => {
            let child_dv;
            if (element.includes('##')) {
              child_dv = this.findChildByUserID(+element.replace('##', ''));
            } else {
              child_dv = this.findChildById(+element);
            }
            this.expandParent(child_dv);
            this.checklistSelection.select(child_dv);
            this.checklistSelectionAll.select(child_dv);
            return child_dv;
          });
          this.OutputNodeIds.emit(this.InputNodeIds)
          // this.onChange(selectedItems.join(', '));
        } else {
          const child = this.findChildById(this.iddonvi);
          if (child) {
            this.expandParent(child);
          }
        }
      }
    }

  }

  /** ControlValueAccessor */
  writeValue(value: any): void {
    if (value) {
      if (Array.isArray(value)) {
        this.inputValue = value;
      } else {
        this.inputValue = [value];
      }
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.Disabled = isDisabled;
    if (isDisabled == true) {
      this.dataCtrl.disable();
    }
  }

  /** Set data for Parent: */
  setParent(data: any, parent: any) {
    data.parent = parent;
    if (data.children) {
      data.children.forEach((x: any) => {
        this.setParent(x, data);
      });
    }
  }

  /** Get Children */
  getChildren = (node: TreeModel) => {
    return node.children;
  };

  /** Check has Children */
  hasChildren = (index: number, node: TreeModel) => {
    return !!node.children && node.children.length > 0;
  }

  /* Get the parent node of a node */
  getParentNode(node: TreeModel): TreeModel | null {
    // console.log(this.checklistSelection.selected);
    if (node.parent != undefined || node.parent != null) {
      return node.parent
    }
    return null;
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TreeModel, type = 0): void {
    //If Single Select -> clear list select before toggle
    if (!this.IsMulti) {
      this.checklistSelection.clear();
    }

    //Toggle node
    this.checklistSelection.toggle(node);
    if (node.type == 1) {
      const descendants = this.treeControl.getDescendants(node);
      const descAllSelected = descendants.filter(child => child.id == node.id);
      if (this.checklistSelection.isSelected(node) && node.id) {
        this.checklistSelection.deselect(...descAllSelected)
        this.checklistSelectionAll.deselect(...descAllSelected)
      }
      if (this.checklistSelectionAll.isSelected(node) && node.id) {
        this.checklistSelectionAll.deselect(...descAllSelected)
      }
    }
    if (node.type == 2) {
      this.checklistSelectionAll.toggle(node);
      if (this.checklistSelection.isSelected(node)) {
        if (this.checklistSelection.isSelected(node.parent)) {
          this.checklistSelection.deselect(node.parent)
        }
      }
      if (this.checklistSelectionAll.isSelected(node.parent)) {
        this.checklistSelectionAll.deselect(node.parent)
      }
    }
    //Check All Parents
    // this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TreeModel): void {
    let parent: TreeModel | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkAllParentsSelection2(node: TreeModel): void {
    let parent: TreeModel | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection2(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TreeModel): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }
  checkRootNodeSelection2(node: TreeModel): void {
    const nodeSelected = this.checklistSelectionAll.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelectionAll.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelectionAll.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelectionAll.select(node);
    }
  }
  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TreeModel, type = 0): boolean {
    debugger
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child => {
      if (child.type === 2) {
        return this.checklistSelectionAll.isSelected(child)
      }
      return false;
    }
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TreeModel, type = 0): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelectionAll.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /**Toggle the to-do item selection. Select/deselect all the descendants node*/
  todoItemSelectionToggle(node: TreeModel, type = 0): void {
    if (type === 1) {
      this.checklistSelectionAll.toggle(node);

      const descendants = this.treeControl.getDescendants(node);
      const descendants_filter = descendants.filter(child => child.type == 2);
      this.checklistSelectionAll.isSelected(node)
        ? this.checklistSelection.select(...descendants_filter)
        : this.checklistSelection.deselect(...descendants_filter);

      this.checklistSelectionAll.isSelected(node)
        ? this.checklistSelectionAll.select(...descendants)
        : this.checklistSelectionAll.deselect(...descendants);

      if (this.checklistSelectionAll.isSelected(node)) {
        const descendants_filter1 = descendants.filter(child => child.type == 1);
        this.checklistSelection.deselect(...descendants_filter1)
        this.checklistSelection.deselect(node);
      }
      // Force update for the parent
      descendants.every(child => this.checklistSelection.isSelected(child));
      descendants.every(child => this.checklistSelectionAll.isSelected(child));
      this.checkAllParentsSelection(node);
      this.checkAllParentsSelection2(node);
    } else {
      this.checklistSelection.toggle(node);
      const descendants = this.treeControl.getDescendants(node);
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants);

      // Force update for the parent
      descendants.every(child => this.checklistSelection.isSelected(child));
      this.checkAllParentsSelection(node);
    }

  }

  /**Filter*/












  filterChanged(filterText: string) {
    // console.log("filterChanged", filterText);
    // Filter method which actually filters the tree and gives back a tree structure
    if (filterText) {
      this.database.filter(filterText);
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }


  /**Find child by Id */
  findChildById(id: number): TreeModel | null {
    const stack = [...this.dataSource.data];
    while (stack.length > 0) {
      const node = stack.pop();
      if (node) {
        if (node.id === id) {
          return node;
        }
        if (node.children) {
          stack.push(...node.children);
        }
      }
    }
    return null;
  }

  /**Find child by UserID */
  findChildByUserID(userid: number): TreeModel | null {
    const stack = [...this.dataSource.data];
    while (stack.length > 0) {
      const node = stack.pop();
      if (node) {
        if (node.userid === userid) {
          return node;
        }
        if (node.children) {
          stack.push(...node.children);
        }
      }
    }
    return null;
  }

  /**Click Node in Single no Checkbox mode*/
  clickNode(node: TreeModel) {
    if (node.id != this.selectedNode) {
      const res = [node.id];
      this.dataCtrl.setValue(node.title);
      this.dataCtrl.updateValueAndValidity();
      this.selectedNode = node.id;
      this.AutocompleteTrigger.closePanel();
      this.onChange(res);
    } else {
      this.dataCtrl.setValue("");
      this.dataCtrl.updateValueAndValidity();
      this.selectedNode = "";
      this.AutocompleteTrigger.closePanel();
      this.onChange([]);
    }
  }

  /** Clear Node if get Backspace event */
  clearNode(event: KeyboardEvent) {
    if (event.key === 'Backspace' && !this.IsMulti) {
      this.dataCtrl.setValue("");
      this.dataCtrl.updateValueAndValidity();
      this.selectedNode = "";
      this.AutocompleteTrigger.closePanel();
      this.onChange([]);
    } else {
      event.preventDefault();
    }
  }

  /**Expand Parent Node in Single no Checkbox mode*/
  expandParent(node: TreeModel) {
    if (node !== undefined && node !== null) {
      let parent = this.getParentNode(node);
      while (parent) {
        this.treeControl.expand(parent);
        parent = this.getParentNode(parent);
        if (parent) {
          this.expandParent(parent);
        }
      }
    }
  }

  public getAuthFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }


  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  selectOne(node: TreeModel): void {
    const modifiedObject = Object.keys(this).map(() => {
      if (node.id === this.iddonvi) {
        return node.userid + '##';
      } else {
        return node.id;
      }
    });

    this.onChange(modifiedObject.join(', '));
  }

  checkDisable(node) {
    if (node.type === 1 && this.DisableNodeIds) {
      const disabledIds = this.DisableNodeIds.split(',');
      return !disabledIds.includes(node.id + '');
    }
    return false;
  }
  /** End code :) */
}
