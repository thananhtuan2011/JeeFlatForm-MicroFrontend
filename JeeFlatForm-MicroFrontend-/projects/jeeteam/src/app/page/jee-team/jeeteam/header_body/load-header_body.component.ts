import { JeeTeamService } from './../services/jeeteam.service';
import { TopicService } from './../services/topic.service';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { StringLiteralLike } from 'typescript';
import { catchError, finalize, share, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, of, Subject, Subscription } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MenuJeeTeamServices } from '../services/menu_jeeteam.service';
import { JeeCommentService } from '../../../JeeCommentModule/jee-comment/jee-comment.service';
import { JeeCommentStore } from '../../../JeeCommentModule/jee-comment/jee-comment.store';
import { NotifiModel } from '../../../JeeCommentModule/jee-comment/notifi.model';

@Component({
  selector: 'app-load-header_body',
  templateUrl: './load-header_body.component.html',
  styleUrls: ['./load-header_body.component.scss']
})
export class LoadHeaderBodyComponent implements OnInit, OnDestroy {
  @Input() id: any;
  showMore: boolean;
  topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private readonly componentName = 'comment-jeeteam';
  sub: Subscription = new Subscription();
  sub3: Subscription = new Subscription();
  sub2: Subscription = new Subscription();
  private readonly onDestroy = new Subject<void>();
  lstInfor: any;
  usernameNotify: string;
  @Input() idsub: any;
  @ViewChild('sideNav', { static: true }) sidenav: MatSidenav;
  active_drawer: boolean = false
  redirectlink: string;
  isprivate: boolean;
  IdTopic: number;
  content: string;
  CustomerId: number
  img: string;
  userCurrent: string;
  fullname: string;
  @Input() idchildmenu: any;
  colornav: boolean = false;
  tem: any[] = [];
  listmenuheader: any[] = [];
  constructor(private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private topic_service: TopicService,
    private cmt_services: JeeCommentStore,
    private comment_service: JeeCommentService,
    private menu_service: MenuJeeTeamServices,
    private dashboard_services: JeeTeamService) {
    const dt = this.dashboard_services.getAuthFromLocalStorage();
    this.userCurrent = dt.user.username;

    this.CustomerId = dt['user']['customData']['jee-account']['customerID'];
    this.img = dt['user']['customData']['personalInfo']['Avatar'];
    this.fullname = dt['user']['customData']['personalInfo']['Fullname'];
  }
  getColor() {

    return this.colornav ? '#3699FF' : '';
  }
  toogleNavoff(nav: any) {
    console.log("close")
    nav.close()
    this.colornav = false;
  }
  toogleNav(nav: any) {
    console.log("opened", nav.opened)
    if (nav.opened) {
      this.colornav = false;

      nav.close()
    } else {
      this.colornav = true
      nav.open();
    }
  }
  ShowMode() {
    this.showMore = false;
    this.cdr.detectChanges();
  }
  GetHeaderMenu(id_menu: number) {
    this.menu_service.GetHeaderMenu(id_menu).subscribe(res => {
      if (res) {

        this.listmenuheader = res.data;
        console.log("listmenuheader", this.listmenuheader)
        if (this.listmenuheader.length > 0) {
          this.dashboard_services.sub_title.next(this.listmenuheader[0].title)

        }
        this.cdr.detectChanges();
      }
    })
  }
  GetHeaderMenuChild(id_menu: number) {
    this.menu_service.GetHeaderMenuChild(id_menu).subscribe(res => {
      if (res) {
        this.listmenuheader = res.data;
        if (this.listmenuheader.length > 0) {
          this.dashboard_services.sub_title.next(this.listmenuheader[0].title)

        }
        this.cdr.detectChanges();
      }
    })
  }

  CloseActivDraw(nav: any) {
    this.active_drawer = false;
    nav.close()
    this.cdr.detectChanges();
  }
  OpenActivDraw(nav: any) {
    if (nav.opened) {
      nav.close()
    } else {
      nav.close()
    }
    this.active_drawer = true;
    this.cdr.detectChanges();
  }
  CloseTabComment() {

    this.colornav = false;

    // this.sidenav.close()
  }
  OpentabComment() {

    this.colornav = true
    // this.sidenav.open();
    // if(this.sidenav.op)
    //   this.sidenav.open()
  }
  EventLoadComment() {
    this.sub = this.topic_service._Comment$.subscribe(res => {
      if (res) {
        this.IdTopic = res.IdTopic;

        this.EventContentTopic();
        if (res.isprivate == false) {

          this.OpentabComment()
          this.comment_service.getTopicObjectIDByComponentNameJeeTeam(res.IdTopic).pipe(
            tap((res) => {

              this.topicObjectID$.next(res);
            }),
            catchError(err => {
              console.log(err);
              return of();
            }),
            finalize(() => { }),
            share(),
            takeUntil(this.onDestroy),
          ).subscribe();
        }
        else {
          this.OpentabComment()
          this.comment_service.getTopicObjectIDByComponentNamePrivate(res.IdTopic).pipe(
            tap((res) => {
              this.topicObjectID$.next(res);
            }),
            catchError(err => {
              console.log(err);
              return of();
            }),
            finalize(() => { }),
            share(),
            takeUntil(this.onDestroy),
          ).subscribe();
        }

      }
      else {

        this.CloseTabComment();

      }
    }
    )
  }
  EventContentTopic() {
    this.sub2 = this.dashboard_services._ContentTopic$.subscribe(res => {
      {
        // console.log("contententejtetete",res)
        if (res) {
          this.lstInfor = res;
          this.usernameNotify = this.lstInfor.UserTopic[0].Username;
          this.content = res.NoiDung;
          this.showMore = res.showMore

        }
      }
    })
  }
  ItemNotifi(): NotifiModel {
    const model = new NotifiModel();
    model.Content = this.fullname + " đã bình luận bài viết mà bạn theo dõi",
      model.Fullname = this.fullname,
      model.username = this.usernameNotify,
      model.Img = this.img,
      model.Idtopic = this.IdTopic;
    model.UserTopic = this.usernameNotify,
      model.CustomerId = this.CustomerId;
    model.key = "cmt";
    var dt = JSON.parse(localStorage.getItem("KeyIdMenu"))
    model.idSubmenu = dt[0].idSubmenu ? dt[0].idSubmenu : "0";
    model.Idmenu = dt[0].Idmenu;
    model.isprivate = dt[0].isprivate;
    model.RowIdTeam = Number.parseInt(localStorage.getItem("RowIdTeam"));
    // model.TagComment= this._lstTag
    return model;
  }

  ItemNotifiRepComent(username: string): NotifiModel {

    const model = new NotifiModel();
    model.Content = this.fullname + " đã trả lời một bình luận của bạn",
      model.Fullname = this.fullname,
      model.username = username,
      model.Img = this.img,
      model.key = "cmt";
    model.Idtopic = this.IdTopic;
    model.UserTopic = username,
      model.CustomerId = this.CustomerId;
    var dt = JSON.parse(localStorage.getItem("KeyIdMenu"))
    model.idSubmenu = dt[0].idSubmenu ? dt[0].idSubmenu : "0";
    model.Idmenu = dt[0].Idmenu;
    model.isprivate = dt[0].isprivate;
    model.RowIdTeam = Number.parseInt(localStorage.getItem("RowIdTeam"));
    // model.TagComment= this._lstTag
    return model;
  }

  ItemNotifiTag(listTag: any): NotifiModel {
    const model = new NotifiModel();
    model.Content = this.fullname + " đã nhắc đến bạn trong một bài viết",
      model.Fullname = this.fullname,
      model.username = this.usernameNotify,
      model.Img = this.img,
      model.Idtopic = this.IdTopic;
    model.key = "cmt";
    model.UserTopic = this.usernameNotify,
      model.CustomerId = this.CustomerId;
    var dt = JSON.parse(localStorage.getItem("KeyIdMenu"))
    model.idSubmenu = dt[0].idSubmenu ? dt[0].idSubmenu : "0";
    model.Idmenu = dt[0].Idmenu;
    model.isprivate = dt[0].isprivate;
    model.RowIdTeam = Number.parseInt(localStorage.getItem("RowIdTeam"));
    model.TagComment = listTag
    return model;
  }
  ItemNotifiTagRep(lstTag: any): NotifiModel {

    const model = new NotifiModel();
    model.Content = this.fullname + " đã nhắc đến bạn trong một bình luận",
      model.Fullname = this.fullname,
      model.username = this.usernameNotify,
      model.Img = this.img,
      model.Idtopic = this.IdTopic;
    model.key = "cmt";
    model.UserTopic = this.usernameNotify,
      model.CustomerId = this.CustomerId;
    var dt = JSON.parse(localStorage.getItem("KeyIdMenu"))
    model.idSubmenu = dt[0].idSubmenu ? dt[0].idSubmenu : "0";
    model.Idmenu = dt[0].Idmenu;
    model.isprivate = dt[0].isprivate;
    model.RowIdTeam = Number.parseInt(localStorage.getItem("RowIdTeam"));
    model.TagComment = lstTag;
    return model;
  }
  UpdateSlCommentTopic(idtopic: number) {
    this.topic_service.UpdateCountComment(idtopic).subscribe()
  }


  EventCommentJeeTeam() {
    this.sub3 = this.cmt_services.notifyteam$.subscribe(res => {
      console.log("vvvvv comment", res)
      if (res) {

        if (res.itemjeeteam.AppCode == "TEAM") {



          let item = this.ItemNotifi();
          this.comment_service.PushNotifi(item).subscribe(res => {

          })

          if (res.listTag.length > 0) {
            let itemtag = this.ItemNotifiTag(res.listTag);
            this.comment_service.PushNotifiTagNameComment(itemtag).subscribe(res => {

            })
          }
          // update sl comment ở topic
          this.UpdateSlCommentTopic(item.Idtopic);
        }

        // this.comment_service._usernameRep$.subscribe(rep=>
        //   {

        //     console.log("esssss",rep);

        //     if(rep)
        //     {
        //       let item =this.ItemNotifiRepComent(rep.Username);
        //       this.comment_service.PushNotifi(item).subscribe(res=>
        //        {

        //        })
        //        if(res.listTag.length>0)
        //        {
        //          let itemtag =this.ItemNotifiTagRep(res.listTag);
        //          this.comment_service.PushNotifiTagNameComment(itemtag).subscribe(res=>
        //           {

        //           })
        //        }
        //     }

        //   })

      }
    })


  }
  ngOnInit(): void {

    this.route.params.subscribe(params => {
      // this.topicObjectID$.next("624fffae3d3664414f1bf01c");
      this.sub.unsubscribe();
      this.sub2.unsubscribe();

      this.active_drawer = true
      this.id = +params.id;
      this.idsub = +params.idsub;
      this.idchildmenu = +params.idchildmenu;
      this.topic_service.data_share = params
      // this.CloseTabComment();
      if (this.id) {
        let keymenu = [{
          Idmenu: this.id, isprivate: false

        }]
        this.isprivate = false
        this.GetHeaderMenu(this.id)

        localStorage.setItem("KeyIdMenu", JSON.stringify(keymenu))
        this.EventLoadComment();

        // this.comment_service.getTopicObjectIDByComponentName(this.id).pipe(
        //   tap((res) => {

        //     this.topicObjectID$.next(res);
        //   }),
        //   catchError(err => {
        //     console.log(err);
        //     return of();
        //   }),
        //   finalize(() => { }),
        //   share(),
        //   takeUntil(this.onDestroy),
        // ).subscribe();

      }
      else {
        // kênh ẩn
        this.isprivate = true
        let keymenu = [{
          Idmenu: this.idchildmenu,
          idSubmenu: this.idsub,
          isprivate: true

        }]
        localStorage.setItem("KeyIdMenu", JSON.stringify(keymenu))
        this.GetHeaderMenuChild(this.idchildmenu)
        this.EventLoadComment();
        // this.comment_service.getTopicObjectIDByComponentNamePrivate(this.idchildmenu).pipe(
        //   tap((res) => {

        //     this.topicObjectID$.next(res);
        //   }),
        //   catchError(err => {
        //     console.log(err);
        //     return of();
        //   }),
        //   finalize(() => { }),
        //   share(),
        //   takeUntil(this.onDestroy),
        // ).subscribe();

      }

      const url = window.location.href;


    });
    setTimeout(() => {
      this.EventCommentJeeTeam();
    }, 400);

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }
}
