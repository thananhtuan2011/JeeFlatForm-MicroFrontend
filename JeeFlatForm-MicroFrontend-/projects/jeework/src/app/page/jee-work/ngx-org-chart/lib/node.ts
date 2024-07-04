export interface INode {
  name: string;
  cssClass: string;
  image: string;
  title: string;
  childs: INode[];
  deadline: string;//Bổ sung thêm
  trangthaitext: string;//Bổ sung thêm
  trangthai: number;//Bổ sung thêm
  id_row: string;//Bổ sung thêm
  PhoneNumber: string;//Bổ sung thêm
  chucvu: string;//Bổ sung thêm
  project_name: string;//Bổ sung thêm

  //cho luồng tiến độ
  progressID: string;
  progressText: string;
  color: string;
  pass: boolean;
}

export class Node implements INode {
  name: string;
  cssClass: string;
  image: string;
  title: string;
  childs: Node[];
  parent?: Node;
  deadline: string;//Bổ sung thêm
  trangthaitext: string;//Bổ sung thêm
  trangthai: number;//Bổ sung thêm
  id_row: string;//Bổ sung thêm
  PhoneNumber: string;//Bổ sung thêm
  chucvu: string;//Bổ sung thêm
  project_name: string;//Bổ sung thêm

  //cho luồng tiến độ
  progressID: string;
  progressText: string;
  color: string;
  pass: boolean;

  constructor(structure: string[], parent?: Node) {
    this.parent = parent;
    const [name, ...reports] = structure;
    this.name = name.split('(')[0].trim();
    const titleMatch = name.match(/\(([^)]+)\)/);
    this.title = titleMatch && titleMatch[1].trim();

    this.childs = reports.map(r => r.substring(1))
      .reduce((previous, current) => {
        if (!current.startsWith(' ')) {
          previous.push([]);
        }

        previous[previous.length - 1].push(current);
        return previous;
      }, [] as string[][])
      .map(r => new Node(r, this));
  }
}
