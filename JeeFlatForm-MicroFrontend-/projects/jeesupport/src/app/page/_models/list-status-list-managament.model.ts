export class ListStatusModel {

    public RowID: number;
    public Title: string;
    public Color: string;

    public IsClosed:number;
    public CustomerID: number;

    clear() {
      this.RowID = 0;
      this.Title = '';
      this.Color = '';


      this.IsClosed=0;
      this.CustomerID = 0;

    }
  }

  
  export interface ListStatusDTO {
     RowID: number;
     Title: string;
     Color: string;
     IsClosed:number;
     CustomerID: number;
  }
  