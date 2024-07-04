
export class TemplateDashboardModel {
	RowID: number;
	title: string;
	clear() {
		this.RowID = 0;
		this.title = '';
	}
}
