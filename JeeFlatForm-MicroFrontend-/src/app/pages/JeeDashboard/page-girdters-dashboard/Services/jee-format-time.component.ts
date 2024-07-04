import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
@Injectable()
export class FormatTimeService {
    constructor(
        private datePipe: DatePipe,) { }
    //Hàm quy tắc hiển thị nội dung theo tài liệu
    //Value: Thời gian (2021-06-08 14:33:12Z), Type: 1-Thời gian rút gọn, 2-Thời gian đầy đủ, IsTime: true có hiện thị giờ, false không hiển thị giờ
    format_convertDate(Value: any, Type: any, IsTime: boolean) {
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

        let date_return = '';

        if (Type == 1) {
            if (IsTime) {
                date_return = this.case_priority_1_istime(days, date_value, date_now, langcode)
            } else {
                date_return = this.case_priority_1_notistime(days, date_value, date_now, langcode)
            }
        } else {
            if (IsTime) {
                date_return = this.case_priority_0_istime(days, date_value, date_now, langcode)
            } else {
                date_return = this.case_priority_0_notistime(days, date_value, date_now, langcode)
            }
        }
        return date_return;
    }

    format_convertDateChat(Value: any, Type: any, IsTime: boolean) {
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

        let date_return = '';

        if (Type == 1) {
            if (IsTime) {
                date_return = this.case_priority_1_istimechat(days, date_value, date_now, langcode)
            } else {
                date_return = this.case_priority_1_notistimechat(days, date_value, date_now, langcode)
            }
        } else {
            if (IsTime) {
                date_return = this.case_priority_0_istime(days, date_value, date_now, langcode)
            } else {
                date_return = this.case_priority_0_notistime(days, date_value, date_now, langcode)
            }
        }
        return date_return;
    }
    //============================Thời gian rút gọn có hiển thị giờ==================================================
    case_priority_1_istimechat(daynum: any, date_value, date_now, langcode: string) {
        let date = '';
        if (daynum > 1) {//Sau hiện tại hơn 1 ngày
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value, 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value, 'MM/dd/yyyy');
                }
            }
        } else if (daynum == 1) {//Sau hiện tại 1 ngày
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " ngày mai";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " tomorrow";
            }
        } else if (daynum == 0) {//Ngày hiện tại
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " hôm nay";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " today";
            }
        } else if (daynum == -1) {//Trước hiện tại 1 ngày
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " hôm qua";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " yesterday";
            }
        } else if (daynum > -8) {//Trước hiện tại dưới 8 ngày
            if (langcode == "vi") {
                date = (daynum * (-1)) + " ngày";
            } else {
                date = (daynum * (-1)) + " days ago";
            }
        }
        else {//Trước hiện tại từ 8 ngày trở lên
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value, 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value, 'MM/dd/yyyy');
                }
            }
        }
        return date;
    }
    //============================Thời gian rút gọn có hiển thị giờ==================================================
    case_priority_1_istime(daynum: any, date_value, date_now, langcode: string) {
        let date = '';
        if (daynum > 1) {//Sau hiện tại hơn 1 ngày
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value, 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value, 'MM/dd/yyyy');
                }
            }
        } else if (daynum == 1) {//Sau hiện tại 1 ngày
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " ngày mai";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " tomorrow";
            }
        } else if (daynum == 0) {//Ngày hiện tại
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " hôm nay";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " today";
            }
        } else if (daynum == -1) {//Trước hiện tại 1 ngày
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " hôm qua";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " yesterday";
            }
        } else if (daynum > -8) {//Trước hiện tại dưới 8 ngày
            if (langcode == "vi") {
                date = (daynum * (-1)) + " ngày trước";
            } else {
                date = (daynum * (-1)) + " days ago";
            }
        }
        else {//Trước hiện tại từ 8 ngày trở lên
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value, 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value, 'MM/dd/yyyy');
                }
            }
        }
        return date;
    }

    case_priority_1_notistimechat(daynum: any, date_value, date_now, langcode: string) {
        let date = '';
        if (daynum > 1) {//Sau hiện tại hơn 1 ngày
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value, 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value, 'MM/dd/yyyy');
                }
            }
        } else if (daynum == 1) {//Sau hiện tại 1 ngày
            if (langcode == "vi") {
                date = "Ngày mai";
            } else {
                date = "Tomorrow";
            }
        } else if (daynum == 0) {//Ngày hiện tại
            if (langcode == "vi") {
                date = "Hôm nay";
            } else {
                date = "Today";
            }
        } else if (daynum == -1) {//Trước hiện tại 1 ngày
            if (langcode == "vi") {
                date = "Hôm qua";
            } else {
                date = "Yesterday";
            }
        } else if (daynum > -8) {//Trước hiện tại dưới 8 ngày
            if (langcode == "vi") {
                date = (daynum * (-1)) + " ngày";
            } else {
                date = (daynum * (-1)) + " days ago";
            }
        } else {//Trước hiện tại từ 8 ngày trở lên
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value, 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value, 'MM/dd/yyyy');
                }
            }
        }
        return date;
    }
    //=======================Thời gian rút gọn không có hiển thị giờ==================================
    case_priority_1_notistime(daynum: any, date_value, date_now, langcode: string) {
        let date = '';
        if (daynum > 1) {//Sau hiện tại hơn 1 ngày
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value, 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value, 'MM/dd/yyyy');
                }
            }
        } else if (daynum == 1) {//Sau hiện tại 1 ngày
            if (langcode == "vi") {
                date = "Ngày mai";
            } else {
                date = "Tomorrow";
            }
        } else if (daynum == 0) {//Ngày hiện tại
            if (langcode == "vi") {
                date = "Hôm nay";
            } else {
                date = "Today";
            }
        } else if (daynum == -1) {//Trước hiện tại 1 ngày
            if (langcode == "vi") {
                date = "Hôm qua";
            } else {
                date = "Yesterday";
            }
        } else if (daynum > -8) {//Trước hiện tại dưới 8 ngày
            if (langcode == "vi") {
                date = (daynum * (-1)) + " ngày trước";
            } else {
                date = (daynum * (-1)) + " days ago";
            }
        } else {//Trước hiện tại từ 8 ngày trở lên
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value, 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value, 'MM/dd/yyyy');
                }
            }
        }
        return date;
    }

    //============================Thời gian đầy đủ có hiển thị giờ==================================================
    case_priority_0_istime(daynum: any, date_value, date_now, langcode: string) {
        let date = '';
        if (daynum > 1) {//Sau hiện tại hơn 1 ngày
            if (langcode == "vi") {
                date = this.f_date_thu(date_value);
            } else {
                date = this.datePipe.transform(date_value, 'EEEE, MM/dd/yyy HH:mm');
            }
        } else if (daynum == 1) {//Sau hiện tại 1 ngày
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " ngày mai";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " tomorrow";
            }
        } else if (daynum == 0) {//Ngày hiện tại
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " Hôm nay";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " today";
            }
        } else if (daynum == -1) {//Trước hiện tại 1 ngày
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " hôm qua";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " yesterday";
            }
        } else {//Trước hiện tại trên 1 ngày
            if (langcode == "vi") {
                date = this.f_date_thu(date_value);
            } else {
                date = this.datePipe.transform(date_value, 'EEEE, MM/dd/yyy HH:mm');
            }
        }
        return date;
    }

    //=======================Thời gian đầy đủ không có hiển thị giờ==================================
    case_priority_0_notistime(daynum: any, date_value, date_now, langcode: string) {
        let date = '';
        if (daynum > 1) {//Sau hiện tại hơn 1 ngày
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2) + ", " + date_value.getFullYear();
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d, yyyy');
                }
            }
        } else if (daynum == 1) {//Sau hiện tại 1 ngày
            if (langcode == "vi") {
                date = "Ngày mai";
            } else {
                date = "Tomorrow";
            }
        } else if (daynum == 0) {//Ngày hiện tại
            if (langcode == "vi") {
                date = "Hôm nay";
            } else {
                date = "Today";
            }
        } else if (daynum == -1) {//Trước hiện tại 1 ngày
            if (langcode == "vi") {
                date = "Hôm qua";
            } else {
                date = "Yesterday";
            }
        } else if (daynum > -8) {//Trước hiện tại dưới 8 ngày
            if (langcode == "vi") {
                date = (daynum * (-1)) + " ngày trước";
            } else {
                date = (daynum * (-1)) + " days ago";
            }
        } else {//Trước hiện tại từ 8 ngày trở lên
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2) + ", " + date_value.getFullYear();
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d, yyyy');
                }
            }
        }
        return date;
    }
    //=====================Đổi tiếng anh qua tiếng việt nếu là thứ ngày===========
    f_date_thu(value: any): any {
        let e = this.datePipe.transform(value, 'EEEE');
        let latest_date = this.datePipe.transform(value, 'EEEE, dd/MM/yyy HH:mm');
        switch (e) {
            case "Monday":
                latest_date = latest_date.replace("Monday", "Thứ hai");
                break;
            case "Tuesday":
                latest_date = latest_date.replace("Tuesday", "Thứ ba");
                break;
            case "Wednesday":
                latest_date = latest_date.replace("Wednesday", "Thứ tư");
                break;
            case "Thursday":
                latest_date = latest_date.replace("Thursday", "Thứ năm");
                break;
            case "Friday":
                latest_date = latest_date.replace("Friday", "Thứ sáu");
                break;
            case "Saturday":
                latest_date = latest_date.replace("Saturday", "Thứ bảy");
                break;
            default:
                latest_date = latest_date.replace("Sunday", "Chủ nhật");
                break;
        }
        return latest_date;
    }

    f_date_thuso(value: any): any {
        if(value == null || value == ""){
            return "";
        }
        let e = this.datePipe.transform(value, 'EEEE');
        let latest_date = this.datePipe.transform(value, 'EEEE, dd/MM/yyy');
        switch (e) {
            case "Monday":
                latest_date = latest_date.replace("Monday", "Thứ 2");
                break;
            case "Tuesday":
                latest_date = latest_date.replace("Tuesday", "Thứ 3");
                break;
            case "Wednesday":
                latest_date = latest_date.replace("Wednesday", "Thứ 4");
                break;
            case "Thursday":
                latest_date = latest_date.replace("Thursday", "Thứ 5");
                break;
            case "Friday":
                latest_date = latest_date.replace("Friday", "Thứ 6");
                break;
            case "Saturday":
                latest_date = latest_date.replace("Saturday", "Thứ 7");
                break;
            default:
                latest_date = latest_date.replace("Sunday", "Chủ nhật");
                break;
        }
        return latest_date;
    }
    //===============================================================================================
    format_convertDate_W(Value: any, Type: any, IsTime: boolean) {//Dùng cho JeeWork
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
        let str_tmp1 = this.datePipe.transform(date_value + 'z', 'MM/dd/yyyy');
        let str_tmp2 = this.datePipe.transform(date_now, 'MM/dd/yyyy');

        //Part giá trị này về lại dạng ngày
        var date_tmp1 = new Date(str_tmp1);
        var date_tmp2 = new Date(str_tmp2);
        //Tính ra số ngày
        let days = (date_tmp1.getTime() - date_tmp2.getTime()) / 1000 / 60 / 60 / 24;

        let date_return = '';

        if (Type == 1) {
            if (IsTime) {
                date_return = this.case_priority_1_istime(days, date_value, date_now, langcode)
            } else {
                date_return = this.w_case_priority_1_notistime(days, date_value, date_now, langcode)
            }
        } else {
            if (IsTime) {
                date_return = this.case_priority_0_istime(days, date_value, date_now, langcode)
            } else {
                date_return = this.case_priority_0_notistime(days, date_value, date_now, langcode)
            }
        }
        return date_return;
    }

    w_case_priority_1_notistime(daynum: any, date_value, date_now, langcode: string) {
        let date = '';
        if (daynum > 8) {//Sau hiện tại hơn 1 ngày
            if (this.datePipe.transform(date_value + 'z', 'yyyy') == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (this.datePipe.transform(date_value + 'z', 'dd'))).slice(-2) + " thg " + ("0" + (this.datePipe.transform(date_value + 'z', 'MM'))).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value + 'z', 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value + 'z', 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value + 'z', 'MM/dd/yyyy');
                }
            }
        } else if (daynum > 1) {//Sau hiện tại hơn 1 ngày
            if (langcode == "vi") {
                date = daynum + " ngày sau";
            } else {
                date = daynum + " days later";
            }
        } else if (daynum == 1) {//Sau hiện tại 1 ngày
            if (langcode == "vi") {
                date = "Ngày mai";
            } else {
                date = "Tomorrow";
            }
        } else if (daynum == 0) {//Ngày hiện tại
            if (langcode == "vi") {
                date = "Hôm nay";
            } else {
                date = "Today";
            }
        } else if (daynum == -1) {//Trước hiện tại 1 ngày
            if (langcode == "vi") {
                date = "Hôm qua";
            } else {
                date = "Yesterday";
            }
        } else if (daynum > -8) {//Trước hiện tại dưới 8 ngày
            if (langcode == "vi") {
                date = (daynum * (-1)) + " ngày trước";
            } else {
                date = (daynum * (-1)) + " days ago";
            }
        } else {//Trước hiện tại từ 8 ngày trở lên
            if (moment(date_value + 'z').format('yyyy') == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (this.datePipe.transform(date_value + 'z', 'dd'))).slice(-2) + " thg " + ("0" + (this.datePipe.transform(date_value + 'z', 'MM'))).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value + 'z', 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value + 'z', 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value + 'z', 'MM/dd/yyyy');
                }
            }
        }
        return date;
    }
}
