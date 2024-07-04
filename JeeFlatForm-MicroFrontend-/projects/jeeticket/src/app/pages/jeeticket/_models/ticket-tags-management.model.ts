export class TicketTagsModel{
    public RowID: number;
    public TagID: number;
    public TicketID: number;
    public CreatedDate: string;
    public CreatedBy: number;

    clear() {
      this.RowID = 0;
      this.TagID = 0;
      this.TicketID = 0;
      this.CreatedBy = 0;
      this.CreatedDate = '';

    }
  }

  
  export interface TicketTagsDTO {
     RowID: number;
     Tag: string;
     Color: string;
     CustomerID: number;
  }
  