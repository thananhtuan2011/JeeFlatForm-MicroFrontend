import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TreeModel } from './mat-dropdown-tree.model'

@Injectable({ providedIn: "root" })
export class FilterDatabase {
    dataChange = new BehaviorSubject<TreeModel[]>([]);
    treeData: TreeModel[] = [];

    get data(): TreeModel[] {
        return this.dataChange.value;
    }

    constructor() { }

    public setTreeData(treeData : TreeModel[]) {
        this.treeData = treeData;
        // Build the tree nodes from Json object. The result is a list of `TreeModel` with nested
        // file node as children.
        const data = treeData;

        // Notify the change.
        this.dataChange.next(data);
    }

    public filter(filterText: string) {
        let filteredTreeData: TreeModel[] = [];
        if (filterText) {
            // Filter the tree
            function filter(array: TreeModel[], text: string) {
                const getChildren = (result: TreeModel[], object: TreeModel) => {
                    if (object.title.toLowerCase().includes(text.toLowerCase())) {
                        result.push(object);
                        return result;
                    }
                    if (Array.isArray(object.children)) {
                        const children = object.children.reduce(getChildren, []);
                        if (children.length) result.push({ ...object, children });
                    }
                    return result;
                };
                return array.reduce(getChildren, []);
            }
            filteredTreeData = filter(this.treeData, filterText);
        } else {
            // Return the initial tree
            filteredTreeData = this.treeData;
        }
        // Build the tree nodes from Json object. The result is a list of `TreeModel` with nested
        // file node as children.
        const data = filteredTreeData;
        // Notify the change.
        this.dataChange.next(data);
    }
}
