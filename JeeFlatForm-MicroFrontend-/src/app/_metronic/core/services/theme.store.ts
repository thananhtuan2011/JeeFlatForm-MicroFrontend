import { ChangeDetectorRef, Component, Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeStore  {

  private readonly theme_updateEvent = new BehaviorSubject<boolean>(false);
  readonly themeupdateEvent$ = this.theme_updateEvent.asObservable();

  get themeupdateEvent(): boolean {
    return this.theme_updateEvent.getValue();
  }

  set themeupdateEvent(val: boolean) {
    this.theme_updateEvent.next(val);
  }
  constructor() {

  }

  //=====================Dùng cho read new item ===================
 
  private readonly _updateRead = new BehaviorSubject<number>(0);
  readonly updateRead$ = this._updateRead.asObservable();

  get updateRead(): number {
    return this._updateRead.getValue();
  }

  set updateRead(val: number) {
    this._updateRead.next(val);
  }

 //=====================Dùng cho reload page khi click công việc trùng link ===================
  private readonly _updateLink = new BehaviorSubject<boolean>(false);
  readonly updateLink$ = this._updateLink.asObservable();

  get updateLink(): boolean {
    return this._updateLink.getValue();
  }

  set updateLink(val: boolean) {
    this._updateLink.next(val);
  }
}
