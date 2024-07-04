import { Component, EventEmitter, Input, Output } from '@angular/core';

import { INode } from '../node';
import { FormatTimeService } from 'projects/jeework-v1/src/app/page/services/jee-format-time.component';

@Component({
  selector: 'ngx-chart-node',
  templateUrl: './ngx-chart-node.component.html',
  styleUrls: ['./ngx-chart-node.component.scss']
})
export class NgxChartNodeComponent {

  @Input()
  node: INode;

  @Input()
  hasParent = false;

  @Input()
  direction: 'vertical' | 'horizontal' = 'vertical';

  @Output() itemClick = new EventEmitter<INode>();

  constructor(
    public _FormatTimeService: FormatTimeService,
) {

}
}
