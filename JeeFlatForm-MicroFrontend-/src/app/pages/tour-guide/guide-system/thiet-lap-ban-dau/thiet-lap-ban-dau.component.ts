import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GuideSystemService } from '../guide-system.service';
import { Router } from '@angular/router';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-thiet-lap-ban-dau',
  templateUrl: './thiet-lap-ban-dau.component.html',
  styleUrls: ['./thiet-lap-ban-dau.component.scss']
})
export class ThietLapBanDauComponent implements OnInit {
  chatConversation: any[] = [];
  response!: any | undefined;
  promptText: string = "";
  _loading$ = new BehaviorSubject<boolean>(
    false
  );

  constructor(public _GuideSystemService: GuideSystemService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    this._GuideSystemService.checkAdmin().subscribe(res => {
      if (res && res.status == 1 && res.data.Type == 1) {
        this._GuideSystemService.getStrConfig(14, "Admin_step1").subscribe(res => {
          if (res && res.status == 1 && res.data.length > 0) {
            this._GuideSystemService.textStep1 = res.data[0] ? res.data[0].Mota : "";
          }
          this.changeDetectorRefs.detectChanges();
        })
        let _item = {
          StepID: 0
        }
        this._GuideSystemService.updateStepCustomer(_item).subscribe(res => { })
      } else {
        this.router.navigate(['/Dashboard']);
      }
    })

  }

  getHeightFull(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 5;
    return tmp_height + 'px';
  }

  TiepTuc() {
    this.router.navigate([`/Config-System/4`]);
  }
}
