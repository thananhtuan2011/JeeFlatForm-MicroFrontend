import { ChangeDetectorRef, Component, Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketioStore  {

  private readonly _updateMain = new BehaviorSubject<boolean>(false);
  readonly updateMain$ = this._updateMain.asObservable();

  get updateMain(): boolean {
    return this._updateMain.getValue();
  }

  set updateMain(val: boolean) {
    this._updateMain.next(val);
  }

  private readonly _updateSub = new BehaviorSubject<boolean>(false);
  readonly updateSub$ = this._updateSub.asObservable();

  get updateSub(): boolean {
    return this._updateSub.getValue();
  }

  set updateSub(val: boolean) {
    this._updateSub.next(val);
  }

  //============Admin==========
  readonly updateSubAdmin$ = this._updateSub.asObservable();

  get updateSubAdmin(): boolean {
    return this._updateSub.getValue();
  }

  set updateSubAdmin(val: boolean) {
    this._updateSub.next(val);
  }
  //============HR=============
  readonly updateSubHR$ = this._updateSub.asObservable();

  get updateSubHR(): boolean {
    return this._updateSub.getValue();
  }

  set updateSubHR(val: boolean) {
    this._updateSub.next(val);
  }
  
  //=============Xóa menu left chat khi click ứng dụng==================
  private readonly _updateMinimize = new BehaviorSubject<boolean>(false);
  readonly updateMinimize$ = this._updateMinimize.asObservable();

  get updateMinimize(): boolean {
    return this._updateMinimize.getValue();
  }

  set updateMinimize(val: boolean) {
    this._updateMinimize.next(val);
  }

  constructor() {

  }
}
