import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GuideSystemService } from './guide-system.service';
@Component({
  selector: 'app-guide-system',
  templateUrl: './guide-system.component.html',
  styleUrls: ['./guide-system.component.scss']
})
export class GuideSystemComponent implements OnInit {
  chatConversation: any[] = [];
  response!: any | undefined;
  promptText: string = "";
  _loading$ = new BehaviorSubject<boolean>(
    false
  );

  img: string = "";
  constructor(public _GuideSystemService: GuideSystemService,
    private changeDetectorRefs: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    this._GuideSystemService.getLogoApp(3).subscribe(res => {
      if (res && res.status == 1) {
        this.img = res.data.IconApp;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }

  getHeightFull(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 5;
    return tmp_height + 'px';
  }
}
