import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateAgoPipe' })
export class DateAgoPipe implements PipeTransform {
    transform(d: any): string { 
        let currentDate = new Date(new Date().toLocaleString());
        let date = new Date(d);

        let year1 = date.getFullYear();
        let month1 = (date.getMonth() + 1) < 10 ? "0" +  (date.getMonth() + 1) : (date.getMonth() + 1);
        let day1 = date.getDate()< 10 ? "0" + date.getDate() :  date.getDate();
        let hour1 = date.getHours() < 10 ? "0" + date.getHours() :  date.getHours();
        let minute1 = date.getMinutes() < 10 ? "0" + date.getMinutes() :  date.getMinutes();

        let year = currentDate.getFullYear() - date.getFullYear();
        let month = currentDate.getMonth() - date.getMonth();
        let day = currentDate.getDate() - date.getDate();
        let hour = currentDate.getHours() - date.getHours();
        let minute = currentDate.getMinutes() - date.getMinutes();
        let second = currentDate.getSeconds() - date.getSeconds();

        let createdSecond = (year * 31556926) + (month * 2629746) + (day * 86400) + (hour * 3600) + (minute * 60) + second;

        if (createdSecond >= 86400) {
            return hour1 + ":" + minute1 +  ", ngày " + day1 + "/" + month1 + "/" + year1
        } 
        else if (createdSecond >= 3600) {
            let hourAgo = Math.floor(createdSecond / 3600);
            return hourAgo > 1 ? hourAgo + " giờ trước" : hourAgo + " giờ trước";
        } 
        else if (createdSecond >= 60) {
            let minuteAgo = Math.floor(createdSecond / 60);
            return minuteAgo > 1 ? minuteAgo + " phút trước" : minuteAgo + " phút trước";
        } 
        else if (createdSecond < 60) {
            return createdSecond > 1 ? createdSecond + " giây trước" : createdSecond + " giây trước";
        } 
        else if (createdSecond < 0) {
            return "0 giây trước";
        }
    }
}