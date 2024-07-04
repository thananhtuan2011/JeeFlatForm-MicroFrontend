import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from 'src/app/_metronic/core/services/theme.service';

@Component({
  selector: 'm-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['iframe.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IframeComponent implements OnInit {
  name = 'Set iframe source';
  url: string = '';
  urlSafe: SafeResourceUrl;
  public appID: number = 0;
  isIframe: boolean;
  constructor(public sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef, public themeService: ThemeService,
    private router: Router,) {
    this.themeService.initTheme();
    this.isIframe = this.themeService.isIframe();
  }

  ngOnInit() {
    if (!this.isIframe) {
      this.activatedRoute.params.subscribe(params => {
        const url = window.location.href;
        if (url.includes('?')) {
          const httpParams = new HttpParams({ fromString: url.split('?')[1] });
          if (httpParams.get('redirectUrl') != "") {
            this.url = httpParams.get('redirectUrl');
            this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
            this.changeDetectorRef.detectChanges();
          }
        }
      });
    } else {
      this.router.navigateByUrl("/");
    }
  }

  getHeight(): any {
    let tmp_height = window.innerHeight - 5;
    return tmp_height + "px";
  }
}
