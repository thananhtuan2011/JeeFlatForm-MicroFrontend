import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { TimezonePipe } from '../pipe/timezone.pipe';

@Component({
  selector: 'app-task-datetime-pc',
  templateUrl: './task-datetime-pc.component.html',
  styleUrls: ['./task-datetime-pc.component.scss'],
  providers: [TimezonePipe]
})
export class TaskDatetimePCComponent implements OnInit, OnChanges {

  @Input() fieldname = '';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<any>();
  @Input() role = '';
  @Input() showall = true;
  isToday = false;
  date: any = '';
  constructor(
    private pipetimezone: TimezonePipe,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit(): void {
  }

  getIconCalendar() {
    if (this.fieldname == 'deadline')
      return 'flaticon-calendar-3';
    else if (this.fieldname == 'start_date')
      return 'flaticon-calendar-2';
    else
      return 'flaticon-calendar-1';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.value) {
      this.isToday = moment(this.value + 'z').format('MM/DD/YYYY') === moment(new Date()).format('MM/DD/YYYY');
    }
    this.date = this.pipetimezone.transform(this.value, 'YYYY-MM-DD') + 'T' + this.pipetimezone.transform(this.value, 'HH:mm:ss');
    this.cd.detectChanges()
  }

  getClassdate() {
    //Convert ngày về dạng string MM/dd/yyyy
    let str_tmp1 = this.datePipe.transform(new Date(this.value) + 'z', 'MM/dd/yyyy HH:mm:ss');
    let str_tmp2 = this.datePipe.transform(new Date(), 'MM/dd/yyyy HH:mm:ss');
    //Part giá trị này về lại dạng ngày
    var date_tmp1 = new Date(str_tmp1);
    var date_tmp2 = new Date(str_tmp2);
    let days = (date_tmp1.getTime() - date_tmp2.getTime()) / 1000 / 60 / 60 / 24;
    // moment(new Date(this.value + 'z')).format('MM/DD/YYYY HH:mm:ss') < moment(new Date()).format('MM/DD/YYYY HH:mm:ss')
    if (this.fieldname == 'deadline' && days < 0) {
      return 'trehan';
    }
    if (this.fieldname == 'deadline' && this.isToday)
      return 'homnay';
    return '';
  }
  updateDate(value) {
    this.valueChange.emit(moment(value).utc().format("MM/DD/YYYY HH:mm"));
    // this.valueChange.emit(moment(value).format("MM/DD/YYYY HH:mm"));
  }

  RemoveKey() {
    this.valueChange.emit(null);

  }

  GetDatetime(value) {
    if (value) {
      if (moment(value + 'z').format('MM/DD/YYYY') === moment(new Date()).format('MM/DD/YYYY') && this.fieldname == 'deadline') {
        return 'Hôm nay';
      } else {
        return this.pipetimezone.transform(value, 'DD/MM/YYYY');
      }
    }
    return value;
  }
}
