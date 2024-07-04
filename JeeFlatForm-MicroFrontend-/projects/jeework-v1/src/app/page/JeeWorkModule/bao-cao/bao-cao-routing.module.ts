import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaoCaoChiTietTheoThanhVienComponent } from './bao-cao-chi-tiet-theo-thanh-vien/bao-cao-chi-tiet-theo-thanh-vien.component';
import { BaoCaoCongViecComponent } from './bao-cao-cong-viec/bao-cao-cong-viec.component';
import { BaoCaoDuAnComponent } from './bao-cao-du-an/bao-cao-du-an.component';
import { BaoCaoListComponent } from './bao-cao-list/bao-cao-list.component';
import { BaoCaoNhiemVuDuocGiaoComponent } from './bao-cao-nhiem-vu-duoc-giao/bao-cao-nhiem-vu-duoc-giao.component';
import { BaoCaoNhiemVuDuocTaoComponent } from './bao-cao-nhiem-vu-duoc-tao/bao-cao-nhiem-vu-duoc-tao.component';
import { BaoCaoTheoDoiTinhHinhTHNVComponent } from './bao-cao-thoe-doi-tinh-hinh-thuc-hien-nhiem-vu/bao-cao-thoe-doi-tinh-hinh-thuc-hien-nhiem-vu.component';
import { BaoCaoThoiHanNhiemVuComponent } from './bao-cao-thoi-han-nhiem-vu/bao-cao-thoi-han-nhiem-vu.component';
import { BaoCaoComponent } from './bao-cao.component';
const routes: Routes = [
	{
		path: '',
		component: BaoCaoComponent,
		children: [
			{
				path: '',
				component: BaoCaoListComponent,
				children: [
					// {
					// 	path: 'CongViec/:id/:type/:start/:end/:project',
					// 	component: BaoCaoCongViecComponent,
					// },
					// {
					// 	path: 'DuAn/:id/:type/:start/:end/:project',
					// 	component: BaoCaoDuAnComponent,
					// },
					// {
					// 	path: 'TheoDoiNV/:id',
					// 	component: BaoCaoTheoDoiTinhHinhTHNVComponent,
					// },
					// {
					// 	path: 'CongViecDuocGiao/:id/:type/:start/:end/:project',
					// 	component: BaoCaoNhiemVuDuocGiaoComponent,
					// },
					// {
					// 	path: 'CongViecDuocTao/:id/:type/:start/:end/:project',
					// 	component: BaoCaoNhiemVuDuocTaoComponent,
					// },
					// {
					// 	path: 'ThanhVien/:id',
					// 	component: BaoCaoChiTietTheoThanhVienComponent,
					// },
					// {
					// 	path: 'ThoiHanNhiemVu/:id',
					// 	component: BaoCaoThoiHanNhiemVuComponent,
					// },
				]
			},
			
		]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BaoCaoRoutingModule { }
