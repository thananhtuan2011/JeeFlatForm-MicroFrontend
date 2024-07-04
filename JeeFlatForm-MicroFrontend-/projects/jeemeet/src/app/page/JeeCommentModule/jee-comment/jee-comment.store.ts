import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PostCommentModel } from './jee-comment.model';

@Injectable({ providedIn: 'root' })
export class JeeCommentStore {

  //dùng cho jeemeeting
  private readonly _notify = new BehaviorSubject<PostCommentModel>(null);
  readonly notify$ = this._notify.asObservable();
  //dùng cho jeeteam
  private readonly _notifyjeeteam = new BehaviorSubject<any>(null);
  readonly notifyteam$ = this._notifyjeeteam.asObservable();
  //dùng cho jeerequest
  private readonly _notifyjeerequest = new BehaviorSubject<any>(null);
  readonly notifyrequest$ = this._notifyjeerequest.asObservable();
    //dùng cho jeemeet
    private readonly _notifyjeemeet = new BehaviorSubject<any>(null);
    readonly notifymeet$ = this._notifyjeemeet.asObservable();
  constructor() {
  }

  get notifyteam() {
    return this._notifyjeeteam.getValue();
  }

  set notifyteam(val:any) {
    this._notifyjeeteam.next(val);
  }
  get notify() {
    return this._notify.getValue();
  }

  set notify(val:any) {
    this._notify.next(val);
  }

  get notifyRequest() {
    return this._notifyjeerequest.getValue();
  }

  set notifyRequest(val:any) {
    this._notifyjeerequest.next(val);
  }
  get notifyMeet() {
    return this._notifyjeemeet.getValue();
  }

  set notifyMeet(val:any) {
    this._notifyjeemeet.next(val);
  }
}
