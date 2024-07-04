export class TreeModel {
    id: any;
    title: string;
    icon?: string;
    children?: TreeModel[];
    parent?: TreeModel;
    expanded:true;
    userid:number;
    type:number;
}

/**
 * id: id của node (string hoặc number)
 * title: text hiển thị (string)
 * icon: icon material
 * children: list object con
 * parent: object cha (tự genarate)
 */
