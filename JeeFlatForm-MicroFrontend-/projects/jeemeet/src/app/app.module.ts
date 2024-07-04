import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JeeMeetModule } from './page/JeeMeetModule/jeemeet.module';
import { QuanLyYKienGopYModule } from './page/JeeMeetModule/ql-ykien-gopy/ql-ykien-gopy.module';
import { QuanLyBangKhaoSatModule } from './page/JeeMeetModule/quan-ly-bang-khao-sat/quan-ly-bang-khao-sat.module';
import { QuanLyCauHoiKhaoSatModule } from './page/JeeMeetModule/quan-ly-cau-hoi-khao-sat/quan-ly-cau-hoi-khao-sat.module';
import { QuanLyPhieuLayYkienModule } from './page/JeeMeetModule/quan-ly-phieu-lay-y-kien/quan-ly-phieu-lay-y-kien.module';
import { QuanLySoTayCuocHopModule } from './page/JeeMeetModule/quan-ly-so-tay-cuoc-hop/quan-ly-so-tay-cuoc-hop.module';
import { QuanLyNhomCuocHopModule } from './page/JeeMeetModule/quan-ly-nhom-cuoc-hop/quan-ly-nhom-cuoc-hop.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    JeeMeetModule,
    QuanLyYKienGopYModule,
    QuanLyBangKhaoSatModule,
    QuanLyCauHoiKhaoSatModule,
    QuanLyPhieuLayYkienModule,
    QuanLySoTayCuocHopModule,
    QuanLyNhomCuocHopModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
