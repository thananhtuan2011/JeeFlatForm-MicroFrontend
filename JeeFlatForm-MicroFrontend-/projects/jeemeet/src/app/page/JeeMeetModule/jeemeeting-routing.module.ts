import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuCuocHopComponent } from './components/menu-cuoc-hop/menu-cuoc-hop.component';
import { ChiTietCuocHopComponent } from './components/cuoc-hop-chi-tiet/cuoc-hop-chi-tiet.component';
import { QuanLySoTayCuocHopComponent } from './quan-ly-so-tay-cuoc-hop/quan-ly-so-tay-cuoc-hop.component';
import { QuanLySoTayCuocHopListComponent } from './quan-ly-so-tay-cuoc-hop/quan-ly-so-tay-cuoc-hop-list/quan-ly-so-tay-cuoc-hop-list.component';
import { QuanLyNhomCuocHopListComponent } from './quan-ly-nhom-cuoc-hop/quan-ly-nhom-cuoc-hop-list/quan-ly-nhom-cuoc-hop-list.component';
import { LichHopDonViPageComponent } from './lich-hop-don-vi/components/lich-hop-don-vi-page.component';
import { ThongKeHopDonViPageComponent } from './thong-ke-hop-don-vi/components/thong-ke-hop-don-vi-page/thong-ke-hop-don-vi-page.component';
import { MeetDetailComponent } from './components/meet-v2/meet-detail/meet-detail.component';
import { MeetListComponent } from './components/meet-v2/meet-list/meet-list.component';
import { ThongKeHopDaXuLyPageComponent } from './thong-ke-hop-don-vi/components/thong-ke-hop-da-xu-ly-page/thong-ke-hop-don-vi-page.component';
import { ViewPdfLichHopComponent } from './components/meet-v2/view-pdf-lich-hop/view-pdf-lich-hop.component';
import { ThongKeHopDonViThamGiaPageComponent } from './thong-ke-hop-don-vi/components/thong-ke-hop-don-vi-tg-page/thong-ke-hop-don-vi-page.component';
import { ThongKeHopTheoChucVuPageComponent } from './thong-ke-hop-don-vi/components/thong-ke-hop-theo-chuc-vu-page/thong-ke-hop-don-vi-page.component';


// const routes: Routes = [
//   {
//     path: '',
//     component: MenuCuocHopComponent,
//     children: [

//       {
//         path: 'so-tay-cuoc-hop',
//         component: QuanLySoTayCuocHopListComponent
//       }, {
//         path: 'lich-hop-don-vi',
//         component: LichHopDonViPageComponent
//       }, {
//         path: 'thong-ke-hop-don-vi',
//         component: ThongKeHopDonViPageComponent
//       },
//       {
//         path: 'group-user',
//         component: QuanLyNhomCuocHopListComponent
//       },
//       {
//         path: ':id',
//         component: ChiTietCuocHopComponent
//       },

//     ]
//   }

// ];


//v2 meet ----------------------------------------------------------------

const routes: Routes = [
  {
    path: '',
    component: MeetListComponent,
    children: [

      {
        path: 'so-tay-cuoc-hop',
        component: QuanLySoTayCuocHopListComponent
      }, {
        path: 'lich-hop-don-vi',
        component: LichHopDonViPageComponent
      }, {
        path: 'thong-ke-hop-don-vi',
        component: ThongKeHopDonViPageComponent
      }, {
        path: 'thong-ke-cuoc-hop-don-vi-tham-gia',
        component: ThongKeHopDonViThamGiaPageComponent
      }, {
        path: 'thong-ke-cuoc-hop-theo-chuc-vu',
        component: ThongKeHopTheoChucVuPageComponent
      },
      {
        path: 'group-user',
        component: QuanLyNhomCuocHopListComponent
      },
      {
        path: 'luu-tru',
        component: ThongKeHopDaXuLyPageComponent
      },
      {
        path: 'lich-cong-tac',
        component: ViewPdfLichHopComponent
      },
      {
        path: ':id',
        component: MeetDetailComponent
      },

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JeeMeetingRoutingModule { }
