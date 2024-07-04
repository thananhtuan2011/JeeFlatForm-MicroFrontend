import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { BaseDataSource } from '../../../../models/data-sources/_base.datasource';
import { QueryParamsModel } from '../../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../../models/query-models/query-results.model';
import { BangCongService } from '../../Services/bang-cong.service';

export class BangCongDataSource extends BaseDataSource {
	constructor(private _BangCongService: BangCongService) {
		super();
	}
	async loaddata(queryParams: QueryParamsModel) {
		this._BangCongService.lastFilter$.next(queryParams);
		this.loadingSubject.next(true);
		try {
			return (await this._BangCongService.findData(queryParams).toPromise()).data;
		} catch (error) {
			return null;
		}
	}
	loadList(queryParams: QueryParamsModel, objData: any) {
		 
		this._BangCongService.lastFilter$.next(queryParams);
		this.loadingSubject.next(true);

		this._BangCongService.findDuLieuChamCong(queryParams)
			.pipe(
				tap(resultFromServer => {
					this.entitySubject.next(resultFromServer.data);
					if (resultFromServer.page != undefined) {
						var totalCount = resultFromServer.page.TotalCount || (resultFromServer.page.AllPage * resultFromServer.page.Size);
						this.paginatorTotalSubject.next(totalCount);
					} else {
						let totalCount = 0;
						this.paginatorTotalSubject.next(totalCount);
					}
				}),
				catchError(err => of(new QueryResultsModel([], err))),
				finalize(() => this.loadingSubject.next(false))
			).subscribe(
				res => {
					if (res && res.status == 1) {
						objData.data = res.data;
						objData.list = res.columnlist ? res.columnlist : [];
					}
					else {
						objData.data = [];
					}
				}
			);
	}
}
