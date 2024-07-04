export class LinhvucyeucauModel {
    public RowID: number;
    public Title: string;
    clear() {
      this.RowID = 0;
      this.Title = '';
    }
  }
  
  export interface LinhvucyeucauDTO {
    Title: string;
    Status: boolean;
    RowID: number;
    CreatedBy: number;
    CreatedDate: Date;
  }
  