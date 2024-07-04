import { BaseDataSource } from 'src/app/pages/models/data-sources/_base.datasource';
import { NhanHoSoOnlineService } from '../../Services/nhan-ho-so-online.service';

export class NhanHoSoOnlineDataSource extends BaseDataSource {
	constructor(private NhanHoSoOnlineService: NhanHoSoOnlineService) {
		super();
	}
}
