import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Input, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { TourGuideService } from './tour-guide.service'

@Component({
  selector: 'app-tour-guide',
  templateUrl: './tour-guide.component.html',
  styleUrls: ['./tour-guide.component.scss']
})
export class TourGuideComponent implements OnInit, OnDestroy {

  @Input() connectedTo: any;
  @Input() text: string;
  @Input() get id(): number {
    return this._id;
  };
  @Input() position: string;
  @Input() src?: string;
  set id(id: number) {
    if (typeof id === 'string') {
      this._id = parseInt(id);
    } else {
      this._id = id;
    }
  }
  private _id: number;
  @Output() closed = new EventEmitter<any>();
  @ViewChild(CdkPortal) portal: ElementRef;
  overlayRef: OverlayRef;
  boundingRect: any;
  private nativeElement;
  public positions: any = {};
  public pos: any = {};
  public hasImage: boolean;
  public isBackdrop: boolean = false;
  private backdropElement: HTMLElement;
  constructor(private overlay: Overlay,
    private renderer: Renderer2,
    private tourGuideService: TourGuideService) {
  }

  ngOnInit() {
    this.tourGuideService.registerOverlay(this);
    //tourguide-avatar
    if (this.connectedTo == 'tourguide-avatar') {
      this.connectedTo = document.getElementById('tourguide_avatar') as HTMLElement;
    }
    //tourguide-menuleft
    if (this.connectedTo == 'tourguide-menuleft') {
      this.connectedTo = document.getElementById('tourguide_menuleft') as HTMLElement;
    }
    //tourguide-app
    if (this.connectedTo == 'tourguide-app') {
      this.connectedTo = document.getElementById('tourguide_app') as HTMLElement;
    }
    //tourguide-support
    if(this.connectedTo == 'tourguide-support'){
      this.connectedTo = document.getElementById('tourguide_support') as HTMLElement;
    }
    // menu left
    if (this.connectedTo == 'menuleft') {
      this.connectedTo = document.getElementById('m_aside_left') as HTMLElement;
    }
    //  dynamic sreach
    if (this.connectedTo == 'dynamic-search') {
      this.connectedTo = document.getElementById('m-list-search__form') as HTMLElement;
    }
    // mPortletBody
    if (this.connectedTo == 'mPortletBody') {
      this.isBackdrop = true;
      this.connectedTo = document.getElementsByClassName('m-portlet__body')[0] as HTMLElement;
    }

    if (this.connectedTo != 'bodynhapluongimport') {
      if (this.connectedTo.getBoundingClientRect) {
        this.nativeElement = this.connectedTo;
      } else {
        this.nativeElement = this.connectedTo._elementRef.nativeElement;
      }
    } else {
      this.isBackdrop = true;
    }

    if (this.src) {
      this.hasImage = true;
    }
  }

  createPositions() {

    this.positions.left = [{ originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -50 }];
    this.positions.right = [{ originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 50 }];
    this.positions.bottom = [{ originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 50 }];
    this.positions.top = [{ originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -50 }];
    this.positions.center = [{ originX: 'center', originY: 'center', overlayX: 'center', overlayY: 'center' }];

    switch (this.position) {
      case 'top': {
        this.pos = this.positions.top;
        break;
      }
      case 'left':
        {
          this.pos = this.positions.left;
          break;
        }
      case 'right':
        {
          this.pos = this.positions.right;
          break;
        }
      case 'bottom':
        {
          this.pos = this.positions.bottom;
          break;
        }
      case 'center':
        {
          this.pos = this.positions.center;
          break;
        }
    }
  }

  public showOverlay() {
    this.createPositions();

    var positionStrategy: any;
    if (this.connectedTo != document.getElementsByClassName('m-portlet__body')[0] as HTMLElement
      && this.connectedTo != 'bodynhapluongimport') {
      positionStrategy = this.overlay.position()
        .flexibleConnectedTo(this.nativeElement)
        .withPositions(this.pos)
        .withGrowAfterOpen();
    } else {
      positionStrategy = this.overlay.position().global()
        .centerHorizontally().centerVertically();
    }

    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    var overlayRef: any;

    overlayRef = this.overlay.create({ positionStrategy, scrollStrategy, hasBackdrop: this.isBackdrop, backdropClass: 'tour-guide-backdrop' });
    // overlayRef = this.overlay.create({ positionStrategy, scrollStrategy, hasBackdrop: false });


    this.overlayRef = overlayRef;

    if (!this.isBackdrop) {
      this.boundingRect = this.nativeElement.getBoundingClientRect();
    }

    overlayRef.detachments().subscribe(() => {
      this.renderer.removeClass(this.nativeElement, 'tour-guide-elevate');
      this.renderer.removeAttribute(this.nativeElement, 'id');
    });

    if (!this.backdropElement) {
      this.backdropElement = this.renderer.createElement('div');
      this.renderer.addClass(this.backdropElement, 'tour-guide-fake-backdrop');
      if (!this.isBackdrop) {
        this.renderer.appendChild(document.body, this.backdropElement);
      }
    }

    if (!this.isBackdrop) {
      this.setStyles(this.boundingRect)
    };

    overlayRef.attach(this.portal);
    this.renderer.addClass(this.nativeElement, 'tour-guide-elevate');
    if (this.connectedTo != document.getElementsByClassName('m-portlet__body')[0] as HTMLElement) {
      this.renderer.setAttribute(this.nativeElement, 'id', 'onboarding-active');
    }
  }

  public hideOverlay() {
    if (this._id == this.tourGuideService.lastID) {
      this.tourGuideService.GetTourGuide(this.tourGuideService.page).subscribe((res) => {
        if (res.status == 1) {
          this.tourGuideService.CreateTourGuide(this.tourGuideService.page).subscribe((x) => {
          });
        } else {
          return;
        }
      });
    }
    if (this.backdropElement) {
      this.renderer.removeChild(document.body, this.backdropElement);
      this.backdropElement = null;
    }
    this.tourGuideService.wasClosed(this._id);
    this.overlayRef.dispose();
    this.closed.emit();
  }

  ngOnDestroy() {
    if (this.backdropElement) {
      this.renderer.removeChild(document.body, this.backdropElement);
      this.backdropElement = null;
    }
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.closed.emit();
    }
    this.tourGuideService.destroyOverlay(this);

  }

  private setStyles(boundingRect: DOMRect) {
    const styles = {
      position: 'fixed',
      width: boundingRect.width + 'px',
      height: boundingRect.height + 'px',
      top: boundingRect.top + 'px',
      left: boundingRect.left + 'px',
      'box-shadow': '0 0 0 9999px rgba(26, 26, 26, 0.6)',
      'z-index': '999'
    };

    for (const name of Object.keys(styles)) {
      this.renderer.setStyle(this.backdropElement, name, styles[name]);
    }
  }
}