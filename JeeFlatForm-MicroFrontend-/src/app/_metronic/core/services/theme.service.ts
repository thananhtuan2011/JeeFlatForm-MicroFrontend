import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { MessageService } from 'projects/jeechat/src/app/page/jee-chat/services/message.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private colorTheme: string;

  constructor(rendererFactory: RendererFactory2, private messageService: MessageService) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  // private readonly them = new BehaviorSubject<any>(null);

  // readonly them$ = this.them.asObservable();

  // get data_share() {
  // 	return this.them.getValue();
  // }
  // set data_share(val) {
  // 	this.them.next(val);

  // }
  initTheme() {
    this.getColorTheme();
    this.renderer.addClass(document.body, this.colorTheme);
    // this.SetStyleSCSS();
    this.getIframe();
  }

  update(theme: 'dark-mode' | 'light-mode') {


    this.setColorTheme(theme);
    const event = new CustomEvent('event', { detail: "UpdateTheme" });
    dispatchEvent(event)
    const previousColorTheme =
      theme === 'dark-mode' ? 'light-mode' : 'dark-mode';
    this.renderer.removeClass(document.body, previousColorTheme);
    this.renderer.addClass(document.body, theme);
    // this.SetStyleSCSS();
  }

  isDarkMode() {
    return this.colorTheme === 'dark-mode';
  }

  private setColorTheme(theme) {
    this.colorTheme = theme;
    localStorage.setItem('user-theme', theme);
  }

  private getColorTheme() {
    if (localStorage.getItem('user-theme')) {
      this.colorTheme = localStorage.getItem('user-theme');
    } else {
      this.colorTheme = 'light-mode';
    }
  }

  private readonly _updateEvent = new BehaviorSubject<boolean>(false);
  readonly updateEvent$ = this._updateEvent.asObservable();

  get updateEvent(): boolean {
    return this._updateEvent.getValue();
  }

  set updateEvent(val: boolean) {
    this._updateEvent.next(val);
  }

  SetStyleSCSS() {
    let _hostname = window.location.hostname;
    if (_hostname == 'localhost') {
      this.renderer.addClass(document.body, "test");
    } else {
      let _host = _hostname.split('.')[_hostname.split('.').length - 2];
      if (_host != "jee") {
        this.renderer.addClass(document.body, _host);
      }
    }
  }
  //=======================Sử dụng Iframe=======================
  private frame: string;

  isIframe() {
    return this.frame === 'yes';
  }

  updateIframe(theme: 'yes' | 'no') {
    this.setIframe(theme);
  }

  private setIframe(theme) {
    this.frame = theme;
    localStorage.setItem('use-iframe', theme);
  }

  private getIframe() {
    if (localStorage.getItem('use-iframe')) {
      this.frame = localStorage.getItem('use-iframe');
    } else {
      this.frame = 'yes';
    }
  }
}
