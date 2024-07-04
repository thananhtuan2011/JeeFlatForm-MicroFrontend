import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'projects/jeework/src/environments/environment';

@Component({
  selector: 'app-panel-right',
  templateUrl: './panel-right.component.html',
  styleUrls: ['./panel-right.component.scss']
})
export class PanelRightComponent implements OnInit {
  idMenu: any;
  id_project_team: any;
  filter: any;
  id_tag: any;
  showVTS: boolean = false;
  linkApp:string='';
  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.linkApp=window.location.href.split('/')[2];
    var obj = JSON.parse(localStorage.getItem('appCode')).find(x => x == "VTSWORK");
    if ((obj && localStorage.getItem('istaskbarcustomerID') == "1") || this.linkApp == environment.Key_Soffice) {
      this.showVTS = true;
    }else{
      this.showVTS = false;
    }
    this.activatedRoute.params.subscribe((params) => {
      this.idMenu = params.loaimenu;
      if (this.idMenu == 4) {
        this.id_project_team = params.filter;
        this.filter = '';
      }
      else if (this.idMenu == 7)//tag
      {
        this.id_tag = params.advance;
        this.filter = params.filter;
        this.id_project_team = params.projectid;
      } else {
        this.filter = params.filter;
        this.id_project_team = 0;
      }
    });
    this.changeDetectorRefs.detectChanges();
  }
}
