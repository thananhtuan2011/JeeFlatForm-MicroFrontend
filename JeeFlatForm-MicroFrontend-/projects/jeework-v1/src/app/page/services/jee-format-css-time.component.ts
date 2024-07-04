import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
@Injectable()
export class FormatCSSTimeService {
    constructor(
        private datePipe: DatePipe,) { }
    //Hàm hiển thị CSS
    //Value: Thời gian (2021-06-08 14:33:12Z), Type: 1 - background, 2 - color
    //20/04/2022 Đổi lại trả về class để sử dụng cho dark theme
    format_convertDate(Value: any, Type: any) {// Dùng cho thông tin Hạn chót JeeWF
        if (Value == "" || Value == null) {
            return "";
        }

        let langcode = "";
        if (localStorage.getItem('language') == null) {
            langcode = "vi";
        } else {
            langcode = localStorage.getItem('language');
        }
        //Giá trị đầu vào
        let date_value = new Date(Value);
        let date_now = new Date();

        //Convert ngày về dạng string MM/dd/yyyy
        let str_tmp1 = this.datePipe.transform(date_value, 'MM/dd/yyyy');
        let str_tmp2 = this.datePipe.transform(date_now, 'MM/dd/yyyy');

        //Part giá trị này về lại dạng ngày
        var date_tmp1 = new Date(str_tmp1);
        var date_tmp2 = new Date(str_tmp2);
        //Tính ra số ngày
        let days = (date_tmp1.getTime() - date_tmp2.getTime()) / 1000 / 60 / 60 / 24;

        let css = '';
        if (Type == 1) {
            css = this.getCSSBg(days)
        } else {
            css = this.getCSSColor(days)
        }
        return css;
    }

    //===========================Xử lý css đôi với hạn chót hiển thị trên giao diện kanban==================================================
    getCSSBg(daynum: any) {
        let css = '';
        if (daynum > 0) {//Sau hiện tại
            css = 'bg-sau';
        } else if (daynum == 0) {//Ngày hiện tại
            css = 'bg-hientai';
        } else {//Trước hiện tại
            css = 'bg-truoc';
        }
        return css;
    }
    getCSSColor(daynum: any) {
        let css = '';
        if (daynum > 0) {//Sau hiện tại
            css = 'cl-sau';
        } else if (daynum == 0) {//Ngày hiện tại
            css = 'cl-hientai';
        } else {//Trước hiện tại
            css = 'cl-truoc';
        }
        return css;
    }

    //===========================================================================================
    format_convertDate_W(Value: any, Type: any) {// Dùng cho thông tin Hạn chót JeeWork
        if (Value == "" || Value == null) {
            return "";
        }

        let langcode = "";
        if (localStorage.getItem('language') == null) {
            langcode = "vi";
        } else {
            langcode = localStorage.getItem('language');
        }
        //Giá trị đầu vào
        let date_value = new Date(Value);
        let date_now = new Date();

        //Convert ngày về dạng string MM/dd/yyyy
        let str_tmp1 = this.datePipe.transform(date_value + 'z', 'MM/dd/yyyy HH:mm:ss');
        let str_tmp2 = this.datePipe.transform(date_now, 'MM/dd/yyyy HH:mm:ss');

        let isToday = moment(date_value).format('MM/DD/YYYY') === moment(new Date()).utc().format('MM/DD/YYYY');
        //Part giá trị này về lại dạng ngày
        var date_tmp1 = new Date(str_tmp1);
        var date_tmp2 = new Date(str_tmp2);
        //Tính ra số ngày
        let days = (date_tmp1.getTime() - date_tmp2.getTime()) / 1000 / 60 / 60 / 24;

        let css = '';
        if (Type == 1) {
            css = this.getColor(days, isToday)
        } else {
            css = this.getColor(days, isToday)
        }
        return css;
    }

    getColor(daynum: any, isToday) {
        let css = '';
        if(isToday){
            if (daynum >= 0){
                css = '#FF6A00';
            }else{
                css = '#FF0000';
            }
        }else{
            if (daynum >= 0){
                css = '#00975C';
            }else{
                css = '#FF0000';
            }
        }
        return css;
    }
}
