export interface UserInfo {
	email: string;
	password: string;
}

export interface ManufacturerApiResult {
	Mfr_ID: string;
	Country?: string;
	Mfr_Name?: string;
	Mfr_CommonName?: string;
	VehicleTypes?: Array<{}>;
}

export interface MakeApiResult {
	Make_ID: string;
	Make_Name?: string;
}

export interface ModelApiResult extends MakeApiResult{
	Model_ID: string;
	Model_Name?: string;
}

export interface Response<T>{
	message?: string;
	items: T; 
}
