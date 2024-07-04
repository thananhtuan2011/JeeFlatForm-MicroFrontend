import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, forwardRef, ElementRef, ViewEncapsulation, Input, OnChanges, AfterViewChecked, Inject } from '@angular/core';
import { FormControl, ControlValueAccessor, Validator, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { map, debounceTime, distinctUntilChanged, tap, startWith } from 'rxjs/operators';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DangKyCuocHopService } from '../../../_services/dang-ky-cuoc-hop.service';
import { QueryParamsModelNew } from '../../../../models/query-models/query-params.model';
import { QuanLyCuocHopService } from '../../../_services/quan-ly-cuoc-hop.service';
@Component({
  selector: 'app-tree-menber',
  templateUrl: './tree-menber.component.html',
  styleUrls: ['./tree-menber.component.scss']
})
export class TreeMenberComponent implements OnInit {
  anOption = true
  type_nember = 3
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TreeMenberComponent>,
    public _JeeChooseMemberService: QuanLyCuocHopService,
    private changeDetectorRefs: ChangeDetectorRef
) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.dialogRef.close();
  }

  goBack() {
    this.dialogRef.close();
  }

  changeTypeMember(ev) {
    this.type_nember = ev.value
  }
}
