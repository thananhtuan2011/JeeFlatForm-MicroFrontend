import { Directive } from "@angular/core";
import { MAT_DATE_FORMATS, MatDateFormats } from "@angular/material/core";
export const MY_FORMATS: MatDateFormats = {
	parse: {
		dateInput: 'D/MM/YYYY'
	},
	display: {
		dateInput: 'DD/MM/YYYY',
		monthYearLabel: 'MMMM Y',
		dateA11yLabel: 'LL',
		monthYearA11yLabel: 'MMMM Y'
	}
};


export const MY_FORMATS_M = {
	parse: {
	  dateInput: 'MM/YYYY',
	},
	display: {
	  dateInput: 'MM/YYYY',
	  monthYearLabel: 'MMM YYYY',
	  dateA11yLabel: 'LL',
	  monthYearA11yLabel: 'MMMM YYYY',
	},
}

@Directive({
	selector: '[monthDateFormats]',
	providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_M }],
})
export class DateFormatsDirective {}