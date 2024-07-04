import { BaseModel } from "../../auth/models/_base.model";

export class NhapHoSoOnlineModel extends BaseModel {
	username: string;
	expirationDate: string;
	token: string;

	fullName:string;
	gender: number;

	dob: string;
	podId: number;

	phone: string;
	email: string;
	nationality: string;

	id: string;
	issuedDate: string;
	issuedPlaceId: number;

	permanentAddress: string;
	permanentWardsId: number;

	currentAddress: string;

	nattionId: number;
	religionId: number;

	trainLevelId: number;
	maritalStatusId: number;

	taxCode: string;
	taxCode_IssuedDate: string;
	taxCode_IssuedPlace: string;

	passport: string;
	passport_IssuedPlace: string;

	passport_IssuedDate: string;
	passport_ExpirationDate: string;

	accountNumber: string;
	accountHolder: string;

	bank: string;
	bank_Branch: string;

	socialInsurance: string;
	socialInsurance_IssuedDate: string;

	contact_FullName: string;
	contact_Phone: string;
	contact_Relationship: string;
	
	password: string;
	clear() {
		
	}
}