import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { ThemeService } from 'src/app/_metronic/core/services/theme.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-slider-message',
  templateUrl: './slider-message.component.html',
  styleUrls: ['./slider-message.component.scss']
})
export class SliderMessageComponent implements OnInit {
  
  // images = [700, 800, 807].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor(config: NgbCarouselConfig,
    private changeDetectorRefs: ChangeDetectorRef, 
    ) {
    // customize default values of carousels used by this component tree
    config.interval = 5000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }
  themdark:boolean=false
  Event()
  {
    
    fromEvent(window,'event').subscribe((res:any)=>
      {
         
        if(res.detail=="UpdateTheme")
        {
          let them= localStorage.getItem('user-theme');
         
          if(them=='dark-mode')
          {
             this.themdark=true 
          }
          else
          {
            this.themdark=false 
          }
        }
      })
     
     
  }
  ngOnInit(): void {
    this.Event()
    localStorage.setItem('chatGroup','0');
   let them= localStorage.getItem('user-theme');
   if(them=='dark-mode')
   {
     this.themdark=true
   }
   else
   {
     this.themdark=false
   }
  }

}
