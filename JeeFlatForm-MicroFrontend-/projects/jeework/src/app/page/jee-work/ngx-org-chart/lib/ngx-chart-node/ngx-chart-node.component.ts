import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormatTimeService } from '../../../services/jee-format-time.component';

import { INode } from '../node';
import { DomSanitizer } from '@angular/platform-browser';

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

  @Input()
  type = 1;

  @Output() itemClick = new EventEmitter<INode>();

  constructor(
    public _FormatTimeService: FormatTimeService,
    private sanitizer: DomSanitizer,
) {
}
  transformHtml(htmlTextWithStyle) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle);
  }
}
