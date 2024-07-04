import { BaseModel } from "../../../models/_base.model";

export class QuanLyThietBiModel extends BaseModel {
	ID: number;
	Name: string;
	IP: string;
	Port: string;
	Type: string;
	IsPrimaryDevice: string;
	madiadiem: string;
	matkhau: string;
	clear() {
		this.ID = 0;
		this.Name = '';
		this.IP = '';
		this.Port = '4370';
		this.Type = 'ZM_TFT';
		this.IsPrimaryDevice = '';
		this.madiadiem = '';
		this.matkhau = '';
	}
}

export class TimeModel extends BaseModel {
	ID: number;
	StartReadTime: string;
	Time: string;
	clear() {
		this.ID = 0;
		this.StartReadTime = '';
		this.Time = '';
	}
}