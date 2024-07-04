import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'action-confirm-config-dialog',
  templateUrl: './action-confirm-config.component.html',
})
export class ConfirmConfigDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() btnLater: string;
  @Input() btnAgree: string;
  @Input() btnCancelText: string;
  @ViewChild('btnRef') buttonRef: MatButton;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    // this.buttonRef.focus();
  }

  public decline() {
    this.activeModal.close(false);

  }
  ngAfterViewInit() {
    this.buttonRef.focus();
  }
  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {// save and close
    this.activeModal.dismiss('pad');
  }

}