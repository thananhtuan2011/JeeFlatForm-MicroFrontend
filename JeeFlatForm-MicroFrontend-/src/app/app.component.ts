import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslationService } from './modules/i18n';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { locale as viLang } from './modules/i18n/vocabs/vi';
import { SplashScreenService } from './_metronic/partials/layout/splash-screen/splash-screen.service';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutUtilsService } from './modules/crud/utils/layout-utils.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(private translationService: TranslationService,
    private splashScreenService: SplashScreenService,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService) {
    // setTimeout(() => {
    //   var auth = JSON.parse(localStorage.getItem("cusCode"))
    //   if(auth == 6){
    //     OneSignal.init({
    //       appId: "ace1abe2-efb7-421a-88fd-d1881fed35c8",
    //       serviceWorkerParam: {
    //         scope: '/assets/push/onesignal/'
    //       },
    //       serviceWorkerPath: '/assets/push/onesignal/OneSignalSDKWorker.js',
    //       serviceWorkerUpdaterPath: '/assets/push/onesignal/OneSignalSDKWorker.js'
    //     });
    //   }
    //   if(auth == 7){
    //     OneSignal.init({
    //       appId: "b10dd79f-3b1a-4c75-afbf-2e617122e737",
    //       serviceWorkerParam: {
    //         scope: '/assets/push/onesignal/'
    //       },
    //       serviceWorkerPath: '/assets/push/onesignal/OneSignalSDKWorker.js',
    //       serviceWorkerUpdaterPath: '/assets/push/onesignal/OneSignalSDKWorker.js'
    //     });
    //   }
    // }, 1000);


    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang,
      viLang
    );
  }
  ngOnInit() {
    var OneSignal = window['OneSignal'] || [];
    var domain = this.getDomainRedirect()
    if (domain == 'jee.vn') {
      OneSignal.push(["init", {
        appId: "ace1abe2-efb7-421a-88fd-d1881fed35c8",
        serviceWorkerParam: {
          scope: '/assets/push/onesignal/'
        },
        serviceWorkerPath: 'assets/push/onesignal/OneSignalSDKWorker.js',
        serviceWorkerUpdaterPath: 'assets/push/onesignal/OneSignalSDKWorker.js'
      }]);
    }
    if (domain == 'csstech.vn') {
      OneSignal.push(["init", {
        appId: "b10dd79f-3b1a-4c75-afbf-2e617122e737",
        serviceWorkerParam: {
          scope: '/assets/push/onesignal/'
        },
        serviceWorkerPath: 'assets/push/onesignal/OneSignalSDKWorker.js',
        serviceWorkerUpdaterPath: 'assets/push/onesignal/OneSignalSDKWorker.js'
      }]);
    }

    if (domain == 'egov.binhthuan.gov.vn') {
      OneSignal.push(["init", {
        appId: "a7c6e62e-239f-4c26-a6ff-29b1f131338e",
        serviceWorkerParam: {
          scope: '/assets/push/onesignal/'
        },
        serviceWorkerPath: 'assets/push/onesignal/OneSignalSDKWorker.js',
        serviceWorkerUpdaterPath: 'assets/push/onesignal/OneSignalSDKWorker.js'
      }]);
    }

    if (domain == 'dp247.vn') {
      OneSignal.push(["init", {
        appId: "1a51b2e2-6481-427e-a5a6-97d89c2d9db7",
        serviceWorkerParam: {
          scope: '/assets/push/onesignal/'
        },
        serviceWorkerPath: 'assets/push/onesignal/OneSignalSDKWorker.js',
        serviceWorkerUpdaterPath: 'assets/push/onesignal/OneSignalSDKWorker.js'
      }]);
    }

    OneSignal.push(function () {
      OneSignal.on('notificationPermissionChange', function (permissionChange) {
        var currentPermission = permissionChange.to;
        console.log('New permission state:', currentPermission);
        if (currentPermission == 'granted') {
          var auth = JSON.parse(localStorage.getItem("getAuthFromLocalStorage"))
          if (auth) {
            var username = auth.user.username
            OneSignal.push(function () {
              OneSignal.setExternalUserId(username)
              OneSignal.sendTags({
                username,
              })
            });
          }
        }
        if (currentPermission == 'denied') {
          OneSignal.push(function () {
            OneSignal.isPushNotificationsEnabled(async function (isEnabled) {
              if (isEnabled) {
                await OneSignal.setSubscription(false)
              }
            });
          });
        }
      });
    });

    OneSignal.push(function () {
      OneSignal.on('subscriptionChange', async (isSubscribed: boolean) => {
        if (isSubscribed) {
          var auth = JSON.parse(localStorage.getItem("getAuthFromLocalStorage"))
          if (auth) {
            var username = auth.user.username
            OneSignal.push(function () {
              OneSignal.setExternalUserId(username)
              OneSignal.sendTags({
                username,
              })
            });
          }
        }
      })
    });



    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.layoutUtilsService.OnWaitingRouter();
      }
      if (event instanceof NavigationEnd) {
        // clear filtration paginations and others
        // hide splash screen
        this.layoutUtilsService.OffWaitingRouter();
        this.splashScreenService.hide();
        // scroll to top on every route change
        window.scrollTo(0, 0);
      }
      if (event instanceof NavigationError) {
        this.layoutUtilsService.OffWaitingRouter();
      }
    });
    this.unsubscribe.push(routerSubscription);
  }


  getDomainRedirect(): string {
    let domain = '';
    let _hostname = window.location.hostname;
    if (_hostname == 'localhost') {
      domain = 'jee.vn'
    } else {
      let hostname = ''
      hostname = _hostname.replace(_hostname.split('.')[0] + '.', '');
      domain = hostname
    }
    return domain;
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
