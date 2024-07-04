// import {environment} from './../../../../environments/environment';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

// const isServer = environment.SERVERLIVE;

@Pipe({
    name: 'timezone'
})
export class TimezonePipe implements PipeTransform {

    transform(value: any, format: string = ''): any {

        if (value) {
            return this.convertDate(this.DMYtoMDY(value), format);
        } else {
            return '';
        }
    }

    DMYtoMDY(value) {
        const cutstring = value.toString().split('/');
        if (cutstring.length === 3) {
            return cutstring[1] + '/' + cutstring[0] + '/' + cutstring[2];
        }
        return value;
    }

    public getBrowserName() {
        const agent = window.navigator.userAgent.toLowerCase()
        switch (true) {
            case agent.indexOf('edge') > -1:
                return 'edge';
            case agent.indexOf('opr') > -1 && !!(<any>window).opr:
                return 'opera';
            case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
                return 'chrome';
            case agent.indexOf('trident') > -1:
                return 'ie';
            case agent.indexOf('firefox') > -1:
                return 'firefox';
            case agent.indexOf('safari') > -1:
                return 'safari';
            default:
                return 'other';
        }
    }

    convertDate(d: any, format: string = '') {
        var browser = this.getBrowserName();
        if (browser != 'firefox') {
            let fm = 'DD/MM/YYYY HH:mm';
            if (format !== '') {
                fm = format;
            }

            if (moment(d + 'z').format(fm) === 'Invalid date') {
                return d;
            }

            return moment(d + 'z').format(fm);
        }
        else {
            let fm = 'DD/MM/YYYY HH:mm';
            let fm2 = 'YYYY/MM/DD HH:mm';
            if (format !== '') {
                fm = format;
            }

            if (moment.utc(d + 'z', fm2).format(fm) === 'Invalid date') {
                return "";
            }

            let newDate = this.f_convertDateTimeUTC_FireFox(moment.utc(d + 'z', fm2));
            if (moment(newDate, fm2).format(fm) === 'Invalid date') {
                return "";
            }
            return moment(newDate, fm2).format(fm);
        }

    }

    f_convertDateTimeUTC_FireFox(v: any) {
        if (v != "" && v != undefined) {
            let a = new Date(v);
            return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + " " + ("0" + (a.getHours())).slice(-2) + ":" + ("0" + (a.getMinutes())).slice(-2) + ":00.000";
        }
    }
}
