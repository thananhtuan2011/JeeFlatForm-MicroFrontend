import { ChangeDetectorRef, Component, Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JeeWorkStore  {
  private readonly _updateEvent = new BehaviorSubject<boolean>(false);
  readonly updateEvent$ = this._updateEvent.asObservable();
  get updateEvent(): boolean {
    return this._updateEvent.getValue();
  }
  set updateEvent(val: boolean) {
    this._updateEvent.next(val);
  }
  constructor() {

  }
}
