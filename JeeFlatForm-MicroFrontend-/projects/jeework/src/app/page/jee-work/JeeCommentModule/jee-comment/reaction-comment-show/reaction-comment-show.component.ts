import { switchMap } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { async, BehaviorSubject } from 'rxjs';
import { CommentDTO } from '../jee-comment.model';
import { JeeCommentService } from '../jee-comment.service';
import { ReactionModel } from '../reaction.model';

@Component({
  selector: 'jeecomment-reaction-comment-show',
  templateUrl: 'reaction-comment-show.component.html',
  styleUrls: ['reaction-comment-show.scss'],
  // encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class JeeCommentReactionShowComponent implements OnInit {
  lstShow: any[] = []
  showAngry: string = 'icon-reaction-show-angry';
  showSad: string = 'icon-reaction-show-sad';
  showWow: string = 'icon-reaction-show-wow';
  showHaha: string = 'icon-reaction-show-haha';
  showCare: string = 'icon-reaction-show-care';
  showLove: string = 'icon-reaction-show-love';
  showLike: string = 'icon-reaction-show-like';
  maxShow: number = 3;
  lstShowReaction: string[] = [];

  @Input() comment?: any;
  @Input() isDeteachChange$?: BehaviorSubject<boolean>;

  constructor(private cd: ChangeDetectorRef, private _comment_services: JeeCommentService) {
  }

  ngOnInit() {
    if (this.isDeteachChange$) {
      this.isDeteachChange$
        .pipe(
          switchMap(async (res) => {
            if (res) {
              this.cd.detectChanges();
              if (this.comment) this.showTypeReaction();
            }
          }))
        .subscribe();
    }
    if (this.comment) this.showTypeReaction();
  }

  showTypeReaction() {
    this.lstShowReaction = [];
    let index = 0;
    const mostTypeReaction = this.comment.MostTypeReaction;
    if (mostTypeReaction) {
      mostTypeReaction.forEach(element => {
        if (index === this.maxShow) return;
        const showReact = this.getShowReact(element);
        this.lstShowReaction.push(showReact);
        index++;
      });
    }
    this.lstShowReaction.sort();
    this.cd.detectChanges();
  }
  GetUserReaction(item) {
    this.lstShow = []
    this._comment_services.GetUserReaction(item).subscribe(res => {

      this.lstShow = res;
      this.cd.detectChanges();

    })
  }
  ItemReaction(data): ReactionModel {
    let item = new ReactionModel()
    item.ListUser = data
    return item
  }
  toggleWithGreeting(id_reaction: any) {
    switch (id_reaction) {
      case this.showLike:
        this.GetUserReaction(this.ItemReaction(this.comment.Reactions.LikeReactions))
        return this.comment.Reactions.LikeReactions;
      case this.showLove:
        this.GetUserReaction(this.ItemReaction(this.comment.Reactions.LoveReactions))
        return this.comment.Reactions.LoveReactions;
      case this.showCare:
        this.GetUserReaction(this.ItemReaction(this.comment.Reactions.CareReactions))
        return this.comment.Reactions.CareReactions;
      case this.showHaha:
        this.GetUserReaction(this.ItemReaction(this.comment.Reactions.HahaReactions))
        return this.comment.Reactions.HahaReactions;
      case this.showWow:
        this.GetUserReaction(this.ItemReaction(this.comment.Reactions.WowReactions))
        return this.comment.Reactions.WowReactions;
      case this.showSad:
        this.GetUserReaction(this.ItemReaction(this.comment.Reactions.SadReactions))
        return this.comment.Reactions.SadReactions;
      case this.showAngry:
        this.GetUserReaction(this.ItemReaction(this.comment.Reactions.AngryReactions))
        return this.comment.Reactions.AngryReactions;
    }

  }
  getShowReact(react: string): string {
    switch (react) {
      case 'Like':
        return this.showLike;
      case 'Love':
        return this.showLove;
      case 'Care':
        return this.showCare;
      case 'Haha':
        return this.showHaha;
      case 'Wow':
        return this.showWow;
      case 'Sad':
        return this.showSad;
      case 'Angry':
        return this.showAngry;
    }
  }
}