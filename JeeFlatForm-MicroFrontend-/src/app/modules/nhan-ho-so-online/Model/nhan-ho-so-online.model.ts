import { BaseModel } from "../../auth/models/_base.model";

export class NhanHoSoOnlineModel extends BaseModel {
	ID_Row: number;
	fullName: string;
	gender: string;

	DOB: string;
	POB: number;
	POBId: number;

	ID: number;
	issuedDate: string;
	issuedPlaceId: number;

	permanentAddress: string;
	ID_Phuong: number;

	currentAddress: string;

	email: string;
	phone: string;

	salary: number;
	workDate: string;

	trainLevelId: number;
	Train_Level: number;
	graduationYear: number;
	school: string;
	specialize: string;
	major: string;
	infoSourcesId: number;

	FileName: string;
	File: string;
	strBase64: string;

	vacancyId: string;
	StepID: string;
	GCCode: string;
	customerID: number;
	LangCode: string;
	recentJob: string;
	clear() {
		this.ID_Row = 0;
		this.fullName = '';
		this.gender = '';
		this.DOB = '';
		this.POB = 0;
		this.ID = 0;
		this.issuedDate = '';
		this.issuedPlaceId = 0;
		this.permanentAddress = '';
		this.ID_Phuong = 0;
		this.currentAddress = '';
		this.email = '';
		this.phone = '';
		this.salary = 0;
		this.workDate = '';
		this.Train_Level = 0;
		this.graduationYear = 0;
		this.school = '';
		this.specialize = '';
		this.major = '';
		this.infoSourcesId = 0;
		this.FileName = '';
		this.File = '';
		this.strBase64 = '';
		this.vacancyId = '';
		this.StepID = '';
		this.GCCode = '';
		this.customerID = 0;
	}
}

export class DuyetModel extends BaseModel {
	VCID: string;
	StepID: string;
	Result: boolean;
	StatusID: string;
	clear() {
		this.VCID = '';
		this.StepID = '';
		this.Result = false;
		this.StatusID = '';
	}
}
