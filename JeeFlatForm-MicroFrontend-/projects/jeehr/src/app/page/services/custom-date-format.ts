import { MatDateFormats } from "@angular/material/core/datetime";

export const MY_FORMATS_JeeHR: MatDateFormats = {
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
