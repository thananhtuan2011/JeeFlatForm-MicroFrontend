import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LichDangKyModule } from './page/JeeCalendarModule/calendar/calendar.module';
import { BangCongModule } from './page/JeeHRModule/bang-cong/bang-cong.module';
import { DonTuModule } from './page/JeeHRModule/don-tu/don-tu.module';
import { PhepNhanVienModule } from './page/JeeHRModule/phep-nhan-vien/phep-nhan-vien.module';
import { PhieuLuongModule } from './page/JeeHRModule/phieu-luong/phieu-luong.module';
import { SoDoToChucModule } from './page/JeeHRModule/so-do-to-chuc/so-do-to-chuc.module';
import { HRModule } from './page/JeeHRModule/jeehr.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // PageGirdtersDashboardModule,
    // LichDangKyModule,
    // DonTuModule,
    // BangCongModule,
    // PhieuLuongModule,
    // PhepNhanVienModule,
    // SoDoToChucModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
