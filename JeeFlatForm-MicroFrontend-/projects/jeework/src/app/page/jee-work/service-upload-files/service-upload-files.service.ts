import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment, version } from 'projects/jeework/src/environments/environment';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { QueryParamsModel, QueryParamsModelNew } from '../models/query-models/query-params.model';
import { TagsModel, TicketTagsModel, WorkDraftModel } from '../models/JeeWorkModel';

//api mới
const API_JEEWF_GENERAL = environment.HOST_JEEWORKFLOW_API + '/api/controllergeneral';
const API_GENERAL = environment.HOST_JEEWORK_API_2023 + '/api/general';
const API_JEEWORK_MENU = environment.HOST_JEEWORK_API_2023 + '/api/menu';
const API_WORK_2023 = environment.HOST_JEEWORK_API_2023 + '/api/work';
@Injectable({
	providedIn: 'root'
})
export class UploadFileService {
	constructor(private http: HttpClient, private httpUtils: HttpUtilsService,) { }

	//type: theo đúng quy định của type file trong worktitem_attachment. Ex:1-file đính kèm cv, 11-file đính kèm kết quả cv,...
	//id:id tương ứng với type
    upload_file(frmData: any,type: number, id: number = 0){		
		const httpHeaders = this.httpUtils.getHttpHeaderFiles();		
		const url = environment.HOST_JEEWORK_API_2023 + `/api/attachment/upload-file-new?id=${id}&type=${type}`;
		return this.http.post<any>(url,frmData, {
			headers: httpHeaders,
		});  
    }
}
