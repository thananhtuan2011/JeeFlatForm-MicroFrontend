import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule, TranslateStore } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LayoutUtilsService } from './modules/crud/utils/layout-utils.service';
import { MatDialogModule } from '@angular/material/dialog';
import { SocketioService } from './_metronic/core/services/socketio.service';
import { RemindService } from './modules/auth/services/remind.service';
import { TokenStorage } from './modules/auth/services/token-storage.service';
import { DatePipe } from '@angular/common';
import { NotifyServices } from './_metronic/core/services/notify.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActionNotificationComponent } from './modules/crud/action-natification/action-notification.component';
import { SocketioChatService } from './_metronic/core/services/socketiochat.service';
import { DeleteEntityDialogComponent } from './modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { DanhMucChungService } from './_metronic/core/services/danhmuc.service';
import { HttpRequestInterceptor } from './modules/auth/services/econnrefused.interceptor';
// #fake-end#

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

@NgModule({
  declarations: [AppComponent,
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
  ],
  entryComponents: [ActionNotificationComponent, DeleteEntityDialogComponent,],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    SplashScreenModule,//Module sử dụng logo load
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    NgbTooltipModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    ,
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    LayoutUtilsService,
    SocketioService,
    SocketioChatService,
    RemindService,
    TokenStorage,
    DatePipe,
    NotifyServices,
    TranslateStore,
    DanhMucChungService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
