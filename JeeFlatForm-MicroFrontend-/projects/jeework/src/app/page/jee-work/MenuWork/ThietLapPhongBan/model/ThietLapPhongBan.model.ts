export class MenuModel{
    id_priority:number;
    isHidden:boolean;
    loainhiemvu:string;
    nameEdit: string;
    langkey: string;
    FilterID0 : boolean;
    FilterID1 : boolean;
    FilterID2 : boolean;
    FilterID3 : boolean;
    FilterID4 : boolean;
    FilterID5 : boolean;
    FilterID6 : boolean;
    FilterID7 : boolean;
    FilterID8 : boolean;

    emty(){
        this.id_priority = 0;
        this.isHidden = false;
        this.loainhiemvu = '';
        this.nameEdit = '';
        this.langkey = '';
        this.FilterID0 = false;
        this.FilterID1 = false;
        this.FilterID2 = false;
        this.FilterID3 = false;
        this.FilterID4 = false;
        this.FilterID5 = false;
        this.FilterID6 = false;
        this.FilterID7 = false;
        this.FilterID8 = false;
    }
}