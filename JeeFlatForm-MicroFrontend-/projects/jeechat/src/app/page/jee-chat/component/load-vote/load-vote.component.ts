import { ChatService } from './../../services/chat.service';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-load-vote',
  templateUrl: './load-vote.component.html',
  styleUrls: ['./load-vote.component.scss']
})
export class LoadVoteComponent implements OnInit {
  listvote:any={}
  isloading:boolean=false
  fullname:string;
    constructor(   @Inject(MAT_DIALOG_DATA) public data: any,
    public _services: ChatService,
    private changeDetectorRefs: ChangeDetectorRef,
    ) { }
  
    LoadDSVote(idgroup,idchat)
    {
      this._services.Get_DSVote(idgroup,idchat).subscribe(res=>
        {
         this.listvote=res.data[0];
            this.isloading=false
          this.changeDetectorRefs.detectChanges();
  
        })
    }
    ngOnInit(): void {
      this.isloading=true;
      // console.log("ttttt",this.data)
      // this.listvote=this.data;
      this.LoadDSVote(this.data.IdGroup,this.data.IdChat);
        
      // this.LoadCreatedBy(this.listvote.CreatedBy);
    }

}
