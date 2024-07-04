import { BaseModel } from "../../../models/_base.model";

export class CustomWidget extends BaseModel {
    RowID:number;
	id: number;
    Title:string;
    Operators:Operators[];
    customid:number;
    FieldSQL:string;
    SQL_Custom:string;
	clear() {
        this.RowID=0;
		this.id = 0;
        this.Title='';
        this.Operators=[];
		this.customid = 0;
		this.FieldSQL="";
        this.SQL_Custom="";
	}
}
export class Operators extends BaseModel {

    startdate:string;
    operators:string;
    operators_title:string;
    type:boolean;
	clear() {

		this.startdate = "";
        this.operators="";
        this.operators_title="";
        this.type=false;
	}
}