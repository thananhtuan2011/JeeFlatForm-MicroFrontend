import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { TemplateDashboardService } from '../../Services/template-dashboard.service';
import { BaseDataSource } from 'src/app/modules/auth/models/data-sources/_base.datasource';
import { QueryParamsModel, QueryResultsModel } from 'src/app/modules/auth/models/query-params.model';
export class TemplateDashboardDataSource extends BaseDataSource {
	constructor(private _TemplateDashboardService: TemplateDashboardService) {
		super();
	}

	loadList(queryParams: QueryParamsModel) {
		this._TemplateDashboardService.lastFilter$.next(queryParams);
		this.loadingSubject.next(true);

		this._TemplateDashboardService.findData(queryParams)
			.pipe(
				tap(resultFromServer => {
					this.entitySubject.next(resultFromServer.data);
					if(resultFromServer.panigator){
						var totalCount = resultFromServer.panigator.TotalCount || (resultFromServer.panigator.AllPage * resultFromServer.panigator.Size);
						this.paginatorTotalSubject.next(totalCount);
					}else{
						this.paginatorTotalSubject.next(0);
					}
					
				}),
				catchError(err => of(new QueryResultsModel([], err))),
				finalize(() => this.loadingSubject.next(false))
			).subscribe(res => {
			});
	}
}
