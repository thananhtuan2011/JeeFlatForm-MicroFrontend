import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { TourGuideComponent } from './tour-guide.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';

const API_PRODUCTS_URL = environment.HOST_JEELANDINGPAGE_API + '/api/tourguide';

@Injectable()
export class TourGuideService {

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }
  private overlays: Map<number, TourGuideComponent> = new Map();
  public page: string = '';
  public lastID: number;
  public checkTourGuide(page: string, lastID: number) {
    this.page = page;
    this.lastID = lastID;
    this.GetTourGuide(this.page).subscribe((res) => {
      if (res.status == 1) {
        this.showOverlay(1);
      } else {
        return;
      }
    });
  }

  getSrcImage(imgName): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_PRODUCTS_URL + '/Get_Image?imgName=' + imgName, { headers: httpHeaders });
  }

  GetTourGuide(page): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_PRODUCTS_URL + '/Get_Information?page=' + page, { headers: httpHeaders });
  }

  CreateTourGuide(page: string): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_PRODUCTS_URL + '/Insert_Tourguide?page=' + page, { headers: httpHeaders });
  }

  public showOverlay(id: number) {
    const overlay = this.overlays.get(id);
    if (overlay) {
      overlay.showOverlay();
    }
  }

  public registerOverlay(overlay: TourGuideComponent) {
    this.overlays.set(overlay.id, overlay)
  }

  public destroyOverlay(overlay: TourGuideComponent) {
    this.overlays.delete(overlay.id);
  }

  public wasClosed(overlayId: number) {
    const overlay = this.overlays.get(overlayId + 1);
    if (overlay) {
      setTimeout(() => overlay.showOverlay(), 500);
    }
  }

}