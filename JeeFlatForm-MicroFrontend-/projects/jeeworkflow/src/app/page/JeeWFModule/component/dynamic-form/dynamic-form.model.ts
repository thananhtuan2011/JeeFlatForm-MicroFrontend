import { BaseModel } from "../../../models/_base.model";

export class ChuyenGiaiDoanData extends BaseModel {
    NodeID: number;
    InfoChuyenGiaiDoanData: any[] = [];
    clear() {
        this.NodeID = 0;
        this.InfoChuyenGiaiDoanData = [];
    }
}