import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/jeeworkflow/src/environments/environment';
import { HttpUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel } from '../../../../models/query-models/query-params.model';

const API_TemPlate = environment.HOST_JEEWORK_API_2023 + '/api/template';
const API_TemPlate_JeeWF = environment.HOST_JEEWORKFLOW_API + '/api/process';
@Injectable({
  providedIn: 'root'
})
export class TemplateCenterService {

  constructor(private http: HttpClient,
    private httpUtils: HttpUtilsService) { }

  getTemplateCenter(queryParams: QueryParamsModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParms = this.httpUtils.getFindHTTPParams(queryParams)

    return this.http.get<any>(API_TemPlate + '/get-list-template-center',
      { headers: httpHeaders, params: httpParms });

  }
  getDetailTemplate(id, istemplatelist = false): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_TemPlate + `/detail?id=${id}&istemplatelist=${istemplatelist}`,
      { headers: httpHeaders });
  }
  getListTemplateUser(queryParams: QueryParamsModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParms = this.httpUtils.getFindHTTPParams(queryParams)
    return this.http.get<any>(API_TemPlate + '/get-template-by-user', //get-template-by-user update-template-center
      { headers: httpHeaders, params: httpParms });
  }
  //lite_template_types
  getTemplateTypes(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_TemPlate + '/lite_template_types',
      { headers: httpHeaders });
  }
  Lite_WorkSpace_tree_By_User(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_TemPlate + '/lite-workspace-tree-by-user',
      { headers: httpHeaders });
  }
  LiteListField(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_TemPlate + '/list-field-template',
      { headers: httpHeaders });
  }
  UpdateFileTemplate(file, istemplatelist): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(API_TemPlate + `/save-image?istemplatelist=${istemplatelist}`, file,
      { headers: httpHeaders });
  }
  add_template_library(data): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(API_TemPlate + `/add-template-library`, data,
      { headers: httpHeaders });
  }
  Sudungmau(data, istemplatelist): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(API_TemPlate + `/use-template?istemplatelist=${istemplatelist}`, data,
      { headers: httpHeaders });
  }
  delete_library(id): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_TemPlate + `/delete-library/${id}`,
      { headers: httpHeaders });
  }
  SudungmauJeeWF(data): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(API_TemPlate_JeeWF + `/template/update`, data,
      { headers: httpHeaders });
  }
}
