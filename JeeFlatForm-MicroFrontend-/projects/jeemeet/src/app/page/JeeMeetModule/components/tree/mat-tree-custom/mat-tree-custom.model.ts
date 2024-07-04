export class TreeModel {
    id: number;
    title: string;
    children?: TreeModel[];
    parent?: TreeModel;
    type:number;
    internal_tree: boolean;
}
