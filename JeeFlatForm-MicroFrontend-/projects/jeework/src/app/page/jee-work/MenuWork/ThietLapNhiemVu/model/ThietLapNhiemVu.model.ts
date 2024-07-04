export class MenuModel {
    id_priority: number;
    isHidden: boolean;
    loainhiemvu: string;
    nameEdit: string;
    langkey: string;
    FilterID0: boolean;
    FilterID1: boolean;
    FilterID2: boolean;
    FilterID3: boolean;
    FilterID4: boolean;
    FilterID5: boolean;
    FilterID6: boolean;
    FilterID7: boolean;
    FilterID8: boolean;
    Filter_StatusTypeID0: any;
    Filter_StatusTypeID1: any;
    Filter_StatusTypeID2: any;
    Filter_StatusTypeID3: any;
    Filter_StatusTypeID4: any;
    Filter_StatusTypeID5: any;
    Filter_StatusTypeID6: any;
    Filter_StatusTypeID7: any;
    Filter_StatusTypeID8: any;
    Filter_StatusTags: any;

    emty() {
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

export class PositionModelBasic {
    id_row: number;
    position: number;
    clear() {
        this.id_row = 0;
        this.position = 0;
    }
}
export class ListPositionModelBasic {
    data: PositionModelBasic[];
    clear() {
        this.data = [];
    }
}