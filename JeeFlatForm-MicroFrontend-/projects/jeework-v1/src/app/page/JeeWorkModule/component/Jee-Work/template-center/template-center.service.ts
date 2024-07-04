import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/jeework-v1/src/environments/environment';
import { HttpUtilsService } from 'projects/jeework-v1/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel } from '../../../../models/query-models/query-params.model';

const API_Template = environment.HOST_JEEWORK_API + '/api/tp-template';
const API_Lite = environment.HOST_JEEWORK_API + '/api/tp-lite';
const API_Template_JeeWF = environment.HOST_JEEWORKFLOW_API + '/api/process';
@Injectable({
  providedIn: 'root'
})
export class TemplateCenterService {

  constructor(private http: HttpClient,
    private httpUtils: HttpUtilsService) { }

  getTemplateCenter(queryParams: QueryParamsModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParms = this.httpUtils.getFindHTTPParams(queryParams)

    return this.http.get<any>(API_Template + '/get-list-template-center',
      { headers: httpHeaders, params: httpParms });

  }
  getDetailTemplate(id, istemplatelist = false): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_Template + `/detail?id=${id}&istemplatelist=${istemplatelist}`,
      { headers: httpHeaders });
  }
  getListTemplateUser(queryParams: QueryParamsModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParms = this.httpUtils.getFindHTTPParams(queryParams)
    return this.http.get<any>(API_Template + '/get-template-by-user', //get-template-by-user update-template-center
      { headers: httpHeaders, params: httpParms });
  }
  //lite_template_types
  getTemplateTypes(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_Lite + '/lite_template_types',
      { headers: httpHeaders });
  }
  Lite_WorkSpace_tree_By_User(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_Lite + '/lite-workspace-tree-by-user',
      { headers: httpHeaders });
  }
  LiteListField(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_Lite + '/list-field-template',
      { headers: httpHeaders });
  }
  UpdateFileTemplate(file, istemplatelist): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(API_Template + `/save-image?istemplatelist=${istemplatelist}`, file,
      { headers: httpHeaders });
  }
  add_template_library(data): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(API_Template + `/add-template-library`, data,
      { headers: httpHeaders });
  }
  Sudungmau(data, istemplatelist): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(API_Template + `/use-template?istemplatelist=${istemplatelist}`, data,
      { headers: httpHeaders });
  }
  delete_library(id): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_Template + `/delete-library/${id}`,
      { headers: httpHeaders });
  }
  SudungmauJeeWF(data): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(API_Template_JeeWF + `/template/update`, data,
      { headers: httpHeaders });
  }
}
