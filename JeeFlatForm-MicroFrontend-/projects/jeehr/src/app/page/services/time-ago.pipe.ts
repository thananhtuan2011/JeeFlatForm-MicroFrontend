import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform {
  transform(d: any): string {
    debugger
    let currentDate = new Date(new Date().toUTCString());
    let date = new Date(d);

    // let year = currentDate.getFullYear() - date.getFullYear();
    // let month = currentDate.getMonth() - date.getMonth();
    // let day = currentDate.getDate() - date.getDate();
    // let hour = currentDate.getHours() - date.getHours();
    // let minute = currentDate.getMinutes() - date.getMinutes();
    // let second = currentDate.getSeconds() - date.getSeconds();

    // let createdSecond = (year * 31556926) + (month * 2629746) + (day * 86400) + (hour * 3600) + (minute * 60) + second;

    // if (createdSecond >= 31556926) {
    //   let yearAgo = Math.floor(createdSecond / 31556926);
    //   return yearAgo > 1 ? yearAgo + " năm" : yearAgo + " năm";
    // } else if (createdSecond >= 2629746) {
    //   let monthAgo = Math.floor(createdSecond / 2629746);
    //   return monthAgo > 1 ? monthAgo + " tháng" : monthAgo + " tháng";
    // } else if (createdSecond >= 86400) {
    //   let dayAgo = Math.floor(createdSecond / 86400);
    //   return dayAgo > 1 ? dayAgo + " ngày" : dayAgo + " ngày";
    // } else if (createdSecond >= 3600) {
    //   let hourAgo = Math.floor(createdSecond / 3600);
    //   return hourAgo > 1 ? hourAgo + " giờ" : hourAgo + " giờ";
    // } else if (createdSecond >= 60) {
    //   let minuteAgo = Math.floor(createdSecond / 60);
    //   return minuteAgo > 1 ? minuteAgo + " phút" : minuteAgo + " phút";
    // } else if (createdSecond < 60 && createdSecond >= 0) {
    //   return createdSecond > 1 ? createdSecond + " giây" : createdSecond + " giây";
    // } else if (createdSecond < 0) {
    //   return "0 giây";
    // }

    //====================Xử lý lại ===================
    let year = (currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24 / 30 / 12;
    let month = (currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24 / 30;
    let day = (currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24;
    let hour = (currentDate.getTime() - date.getTime()) / 1000 / 60 / 60;
    let minute = (currentDate.getTime() - date.getTime()) / 1000 / 60;
    let second = (currentDate.getTime() - date.getTime()) / 1000;
    if (second < 60) {
      return Math.floor(second).toString() + " giây";
    }
    if (minute < 60) {
      return Math.floor(minute).toString() + " phút";
    }
    if (hour < 24) {
      return Math.floor(hour).toString() + " giờ";
    }
    if (hour >= 24 && day < 30) {
      return Math.floor(day).toString() + " ngày";
    }
    if (day >= 30 && month < 12) {
      return Math.floor(month).toString() + " tháng";
    }
    if (month >= 12) {
      return Math.floor(year).toString() + " năm";
    }
  }
}
// if (value) {
//   const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
//   const today = new Date();
//   const firstDate = new Date(today.getFullYear(),  today.getMonth() + 1, today.getDate());

//   const nextDate = new Date(value);
//   const secondDate = new Date(nextDate.getFullYear(),  nextDate.getMonth() + 1, nextDate.getDate());
//   const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
// if (diffDays === 0) {
//       return 'Hôm nay';
//   } else {
//       return diffDays + ' ngày';
//   }
// }
// return value;
// }
// }