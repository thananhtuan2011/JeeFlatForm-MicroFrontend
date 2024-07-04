import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxOrgChartComponent } from './ngx-org-chart.component';
import { NgxChartDesignerModule } from '../ngx-chart-designer/ngx-chart-designer.module';

@NgModule({
  declarations: [
    NgxOrgChartComponent
  ],
  imports: [
    CommonModule,
    NgxChartDesignerModule
  ],
  bootstrap: [NgxOrgChartComponent],
  exports: [NgxOrgChartComponent]
})
export class NgxOrgChartModule { }
