import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';


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
        if(browser != 'firefox'){
            let fm = 'DD/MM/YYYY HH:mm';
            if (format !== ''){
                fm = format;
            }
            var t = moment(d + 'z').format(fm);
            if (moment(d + 'z').format(fm) === 'Invalid date') {
                return d;
            }
            // if (!isServer) {
            //     return moment(d).format(fm);
            // }
            return moment(d + 'z').format(fm);
        }
        else{
            let fm = 'DD/MM/YYYY HH:mm';
            let fm2 = 'YYYY/MM/DD HH:mm';
            if (format !== ''){
                fm = format;
            }
            var t = moment(d + 'z',fm2).format(fm);
            if (moment(d + 'z',fm2).format(fm) === 'Invalid date') {
                return d;
            }
            // if (!isServer) {
            //     return moment(d).format(fm);
            // }
            return moment(d + 'z',fm2).format(fm);
        }
        
    }

    // convertDate(d: any, format: string = '') {
    //     debugger
    //     let fm = 'DD/MM/YYYY HH:mm';
    //     if (format !== ''){
    //         fm = format;
    //     }
    //     if (moment(d + 'z').format(fm) === 'Invalid date') {
    //         return d;
    //     }
    //     // if (!isServer) {
    //     //     return moment(d).format(fm);
    //     // }
    //     return moment(d + 'z').format(fm);
    // }

}
