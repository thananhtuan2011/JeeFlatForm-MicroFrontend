import { ChangeDetectorRef, Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

//TreeNested not TreeFlat
import { MatTreeNestedDataSource, /** MatTreeFlattener, MatTreeFlatDataSource */ } from '@angular/material/tree';

//CDK
import { NestedTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from "@angular/cdk/collections";

//Model:
import { TreeModel, /** InputData */ } from './mat-tree-custom.model'

@Component({
    selector: 'app-mat-tree-custom',
    templateUrl: './mat-tree-custom.component.html',
    styleUrls: ['./mat-tree-custom.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MatTreeCustomComponent),
            multi: true
        }
    ],
})

export class MatTreeCustomComponent implements ControlValueAccessor, OnChanges {
    /** InputData */
    @Input() InputData: TreeModel[] = []; //Dữ liệu đầu vào

    @Input() Disabled: boolean = false; //Đơn giản là disable :)

    /** Multi/Single Selection */
    @Input() IsMulti: boolean = true; // True - Chọn nhiều, False - chọn một

    iddonvi:number;
    /** Input Value */
    inputValue: any[];

    /** CDK: */
    recursive: boolean = false;
    treeControl: NestedTreeControl<TreeModel>;
    dataSource: MatTreeNestedDataSource<TreeModel>;

    /** ControlValueAccessor: */
    onChange: any = () => { };
    onTouch: any = () => { };

    /** Selection Item: */
    checklistSelection = new SelectionModel<TreeModel>(true /*false - single, true - multi*/);

    selectedNode: any;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) {
     this.iddonvi = Number(this.getAuthFromLocalStorage()['user']['customData']['personalInfo'].DepartmemtID);
     }

    ngOnChanges(changes: SimpleChanges): void {
        if (Array.isArray(changes.InputData.currentValue)) {
            //CheckList
            this.checklistSelection = new SelectionModel<TreeModel>(this.IsMulti);

            //Tree Control
            this.treeControl = new NestedTreeControl<TreeModel>(this.getChildren);
            //Data Source
            this.dataSource = new MatTreeNestedDataSource<TreeModel>();
            //Set InputData
            this.dataSource.data = this.InputData;
            this.treeControl.collapseAll();
            //Set parent:
            Object.keys(this.dataSource.data).forEach(x => {
                this.setParent(this.dataSource.data[x], null);
            });

            //Write value:
            this.checklistSelection.changed.subscribe(listSelection => {
                const ListSelection = listSelection.source.selected.filter(item => item.children == null)
                this.onChange(ListSelection.map((obj) => obj.id));
            });
            //Set value:
            if (this.inputValue) {
                this.SetValue();
            }
        }
    }

    /** ControlValueAccessor */
    writeValue(value: any): void {
        if (value) {
            if (Array.isArray(value)) {
                this.inputValue = value;
                this.SetValue();
            } else {
                this.inputValue = [value];
                this.SetValue();
            }
        }
    }

    SetValue() {
        this.checklistSelection.clear();
        for (const id of this.inputValue) {
            const child = this.findById(id);
            if (!child) continue;
            switch (true) {
                case !this.IsMulti:
                    this.clickNode(child);
                    this.expandParent(child);
                    break;
                case this.IsMulti:
                    this.todoItemSelectionToggle(child);
                    this.expandParent(child);
                    break;
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
    }

    /** Set data for Parent: */
    setParent(data, parent) {
        data.parent = parent;
        if (data.children) {
            data.children.forEach(x => {
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
        // return node.children.value.length > 0;
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
    todoLeafItemSelectionToggle(node: TreeModel): void {
        //Check Select single
        if (this.IsMulti == false) {
            this.checklistSelection.clear();
        }
        this.checklistSelection.toggle(node);
        //Check All Parents
        this.checkAllParentsSelection(node);
    }

    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: TreeModel): void {
        let parent: TreeModel | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
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

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: TreeModel): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        return descAllSelected;
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: TreeModel): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child =>
            this.checklistSelection.isSelected(child)
        );
        return result && !this.descendantsAllSelected(node);
    }

    /**Toggle the to-do item selection. Select/deselect all the descendants node*/
    todoItemSelectionToggle(node: TreeModel): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.every(child => this.checklistSelection.isSelected(child));
        this.checkAllParentsSelection(node);
    }

    /**Find Node by Id*/
    findById(id: number): TreeModel | null {
        const stack = [...this.dataSource.data];
        while (stack.length > 0) {
            const node = stack.pop();
            if (node.id === id) {
                return node;
            }
            if (node.children) {
                stack.push(...node.children);
            }
        }
        return null;
    }

    /**Click Node in Single no Checkbox mode*/
    clickNode(node) {
        const res = [];
        res.push(node.id);
        this.onChange(res);
        this.selectedNode = node.id;
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

    expandItem(node)
    {
        node.expanded = !node.expanded;
    }
    /** End code :) */


    public getAuthFromLocalStorage(): any {
      return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
    }
}
