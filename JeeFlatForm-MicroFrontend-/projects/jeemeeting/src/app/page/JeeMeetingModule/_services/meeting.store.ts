
import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class MeetingStore {
	constructor(
	) {
	}
	private readonly _data_shareLoad = new BehaviorSubject<any>(
		undefined
	);
	readonly data_shareLoad$ = this._data_shareLoad.asObservable();

	get data_shareLoad() {
		return this._data_shareLoad.getValue();
	}
	set data_shareLoad(val) {
		this._data_shareLoad.next(val);
	}

    private readonly _data_shareActived = new BehaviorSubject<any>(
		undefined
	);
	readonly data_shareActived$ = this._data_shareActived.asObservable();

	get data_shareActived() {
		return this._data_shareActived.getValue();
	}
	set data_shareActived(val) {
		this._data_shareActived.next(val);
	}
}
