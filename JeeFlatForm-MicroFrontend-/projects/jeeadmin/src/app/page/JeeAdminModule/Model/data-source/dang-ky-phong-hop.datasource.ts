import { BaseDataSource } from 'projects/jeeadmin/src/app/models/data-sources/_base.datasource';
import { QueryParamsModel } from 'projects/jeeadmin/src/app/models/query-models/query-params.model';
import { QueryResultsModel } from 'projects/jeeadmin/src/app/models/query-models/query-results.model';
import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { DatPhongService } from '../../Services/dat-phong.service';

export class DangKyPhongHopDataSource extends BaseDataSource {
	constructor(private objectServices: DatPhongService) {
		super();
	}

	loadListHuy(queryParams: QueryParamsModel) {
		this.objectServices.lastFilter$.next(queryParams);
		this.loadingSubject.next(true);

		this.objectServices.getHuyDatPhong(queryParams)
			.pipe(
				tap(resultFromServer => {
					this.entitySubject.next(resultFromServer.data);
					var totalCount = resultFromServer.page.TotalCount || (resultFromServer.page.AllPage * resultFromServer.page.Size);
					this.paginatorTotalSubject.next(totalCount);
				}),
				catchError(err => of(new QueryResultsModel([], err))),
				finalize(() => this.loadingSubject.next(false))
			).subscribe();
	}
}
