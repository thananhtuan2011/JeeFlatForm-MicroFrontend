import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { YeuCauVPPComponent } from './yeucau-vpp.component';
import { YeuCauVPP_ListComponent } from './yeucau-vpp-list/yeucau-vpp-list.component';
import { YeuCauVPP_EditComponent } from './yeucau-vpp-edit/yeucau-vpp-edit.component';
import { YeuCauVPPRoutingModule } from './yeucau-vpp.routing.module';
import { GeneralModule } from '../general.module';
import './../../../../../src/styles.scss';
import { VanPhongPhamService } from '../Services/van-phong-pham.service';

@NgModule({
  imports: [
    YeuCauVPPRoutingModule,
    GeneralModule,
    TranslateModule.forRoot(), //ko thêm sẽ lỗi
  ],
  declarations: [
    YeuCauVPPComponent,
    YeuCauVPP_EditComponent,
    YeuCauVPP_ListComponent
  ],
  entryComponents: [],
  providers: [VanPhongPhamService],
})

export class YeuCauVPPModule { }
