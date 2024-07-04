export class TagsModel{
  public RowID: number;
  public Tag: string;
  public Color: string;
  public CreatedBy: number;
  public CreateDate: string;
  public CustomerID: number;
  public ListTags: string[];

  clear() {
    this.RowID = 0;
    this.Tag = '';
    this.Color = '';
    this.CreatedBy = 0;
    this.CreateDate = '';
    this.CustomerID = 0;
    this.ListTags = [];

  }
}


export interface TagsDTO {
   RowID: number;
   Tag: string;
   Color: string;
   CustomerID: number;
}
