import { ChangeDetectorRef, Component, Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JeeWorkV1Store  {
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

   //=====================Dùng cho read new item ===================
   private readonly _updateRead = new BehaviorSubject<number>(0);
   readonly updateRead$ = this._updateRead.asObservable();
   get updateRead(): number {
     return this._updateRead.getValue();
   }
   set updateRead(val: number) {
     this._updateRead.next(val);
   }
}
