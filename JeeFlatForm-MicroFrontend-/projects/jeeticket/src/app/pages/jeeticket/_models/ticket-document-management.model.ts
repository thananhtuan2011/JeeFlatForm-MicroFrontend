export class TicketDocumentDTO {
  RowID: number;
  Link: string;

  clear() {
    this.RowID = 0;
    this.Link = "";
  }
}

export class TicketDocumentModel {
  RowID: number;
  Link: string;
  TicketID: number;
  Fille: File;

  clear() {
    this.RowID = 0;
    this.Link = "";
  }
}
export class File {
  strBase64: string;
  filename: string;
}
