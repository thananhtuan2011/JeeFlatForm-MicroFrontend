import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'timeAgoCus' })
export class TimeAgoPipeCus implements PipeTransform {
  transform(d: any): string {
    let currentDate = new Date(new Date().toString());
    let date = new Date(d);

    let year = currentDate.getFullYear() - date.getFullYear();
    let month = currentDate.getMonth() - date.getMonth();
    let day = currentDate.getDate() - date.getDate();
    let hour = currentDate.getHours() - date.getHours();
    let minute = currentDate.getMinutes() - date.getMinutes();
    let second = currentDate.getSeconds() - date.getSeconds();

    let createdSecond = (year * 31556926) + (month * 2629746) + (day * 86400) + (hour * 3600) + (minute * 60) + second;

    if (createdSecond >= 31556926) {
      let yearAgo = Math.floor(createdSecond / 31556926);
      return yearAgo > 1 ? yearAgo + " năm trước" : yearAgo + " năm trước";
    } else if (createdSecond >= 2629746) {
      let monthAgo = Math.floor(createdSecond / 2629746);
      return monthAgo > 1 ? monthAgo + " tháng trước" : monthAgo + " tháng trước";
    } else if (createdSecond >= 86400) {
      let dayAgo = Math.floor(createdSecond / 86400);
      return dayAgo > 1 ? dayAgo + " ngày trước" : dayAgo + " ngày trước";
    } else if (createdSecond >= 3600) {
      let hourAgo = Math.floor(createdSecond / 3600);
      return hourAgo > 1 ? hourAgo + " giờ trước" : hourAgo + " giờ trước";
    } else if (createdSecond >= 60) {
      let minuteAgo = Math.floor(createdSecond / 60);
      return minuteAgo > 1 ? minuteAgo + " phút trước" : minuteAgo + " phúc trước";
    } else if (createdSecond < 60 && createdSecond >= 0) {
      return createdSecond > 1 ? createdSecond + " giây trước" : createdSecond + " giây trước";
    } else if (createdSecond < 0) {
      let dayAgo = Math.floor(createdSecond / -86400);
      if(dayAgo < 1){
        return this.convertHour(date) + " hôm nay"
      }else
      if(dayAgo == 1){
        return this.convertHour(date) + " ngày mai"
      }else{
        return this.convertHour(date) + " " + this.convertDate(date)
      }
    }
  }

  convertDate(d:any){
    return moment(d).format("DD/MM/YYYY");
  }

  convertHour(v: any) {
    if (v != "" && v != null) {
      let a = new Date(v);
      return (
      ("0" + a.getHours()).slice(-2) + ":" + ("0" + a.getMinutes()).slice(-2)
      );
    }
  }
}
