import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxChartDesignerComponent } from './ngx-chart-designer.component';
import { NgxChartNodeModule } from '../ngx-chart-node/ngx-chart-node.module';


@NgModule({
  declarations: [
    NgxChartDesignerComponent
  ],
  imports: [
    CommonModule,
    NgxChartNodeModule
  ],
  bootstrap: [NgxChartDesignerComponent],
  exports: [NgxChartDesignerComponent]
})
export class NgxChartDesignerModule { }
