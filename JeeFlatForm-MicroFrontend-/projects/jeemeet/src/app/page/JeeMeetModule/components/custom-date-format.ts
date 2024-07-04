import { MatDateFormats } from "@angular/material/core"; 
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
