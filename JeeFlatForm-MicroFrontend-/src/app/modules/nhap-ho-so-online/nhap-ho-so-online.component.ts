import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { isBuffer } from 'lodash';
import { LayoutUtilsService } from '../crud/utils/layout-utils.service';
import { NhapHoSoOnlineEditComponent } from './nhap-ho-so-online-edit/nhap-ho-so-online-edit.component';
import { NhapHoSoOnlineService } from './Services/nhap-ho-so-online.service';

@Component({
	selector: 'm-nhap-ho-so-online-cap',
	templateUrl: './nhap-ho-so-online.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NhapHoSoOnlineComponent implements OnInit {
	constructor(
		private nhapHoSoOnlineService: NhapHoSoOnlineService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
	) { }

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			if (params.token != null && params.token != undefined && params.token != "") {
				this.nhapHoSoOnlineService.checkToken(params.token).subscribe(res => {
					if (res && res.status == 1) {
						const dialogRef = this.dialog.open(NhapHoSoOnlineEditComponent, {
							data: {
								_token: params.token,
								_username: res.data,
							},
							panelClass: 'sky-padding-0',
							disableClose: true
						});
						dialogRef.afterClosed().subscribe((res) => {
							this.router.navigateByUrl('/');
						});
					} else {
						this.router.navigateByUrl('/error/404');
					}
				})
			}
		});
	}
}
