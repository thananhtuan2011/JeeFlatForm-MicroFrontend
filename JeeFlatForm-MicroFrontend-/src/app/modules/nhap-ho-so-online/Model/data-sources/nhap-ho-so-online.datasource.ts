import { BaseDataSource } from 'src/app/pages/models/data-sources/_base.datasource';
import { NhapHoSoOnlineService } from '../../Services/nhap-ho-so-online.service';

export class NhapHoSoOnlineDataSource extends BaseDataSource {
	constructor(private NhapHoSoOnlineService: NhapHoSoOnlineService) {
		super();
	}
}
