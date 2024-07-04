import { NgModule } from "@angular/core";
import { LayoutUtilsService } from "src/app/modules/crud/utils/layout-utils.service";
import { NgxOrgChartModule } from "../ngx-org-chart/lib/ngx-org-chart/ngx-org-chart.module";
import { DanhMucChungService } from "../services/danhmuc.service";
import { PanelDashboardService } from "./panel-dashboard/Services/panel-dashboard.service";
import { MenuWorkService } from "./services/menu-work.services";
import { BaoCaoDoanhNghiepService } from "./bao-cao-doanh-nghiep/Services/bao-cao-doanh-nghiep.service";

const MY_FORMATS_EDIT: any = {
  parse: {
    dateInput: 'D/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM Y',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Y',
  },
};

@NgModule({
  declarations: [
  ],
  imports: [
    NgxOrgChartModule
  ],
  entryComponents: [
  ],
  providers: [
    MenuWorkService,
    DanhMucChungService,
    LayoutUtilsService,
    PanelDashboardService,
    BaoCaoDoanhNghiepService,
  ],
  exports: [
  ],
})
export class MenuWorkRefModule { }
