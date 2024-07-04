import { BaseDataSource } from "../../../../models/data-sources/_base.datasource";
import { ProcessWorkService } from "../../../../services/process-work.service";

export class ProcessWorkDataSource extends BaseDataSource {
	constructor(private _ProcessWorkService: ProcessWorkService) {
		super();
	}

	
}
