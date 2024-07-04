import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DangKyPhongHopModule } from './page/JeeAdminModule/dang-ky-phong-hop/dang-ky-phong-hop.module';
import { JeeAdminModule } from './page/JeeAdminModule/jeeadmin.module';
import { QuanLyPhongHopModule } from './page/JeeAdminModule/quan-ly-phong-hop/quan-ly-phong-hop.module';
import { DatPhongService } from './page/JeeAdminModule/Services/dat-phong.service';
import { JeeAdminService } from './page/JeeAdminModule/Services/jeeadmin.service';
import { VanPhongPhamService } from './page/JeeAdminModule/Services/van-phong-pham.service';
import { YeuCauVPPModule } from './page/JeeAdminModule/yeucau-vpp/yeucau-vpp.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // YeuCauVPPModule,
    // DangKyPhongHopModule,
    // QuanLyPhongHopModule,
    // JeeAdminModule,
  ],
  providers: [JeeAdminService, DatPhongService, VanPhongPhamService],
  bootstrap: [AppComponent]
})
export class AppModule { }
