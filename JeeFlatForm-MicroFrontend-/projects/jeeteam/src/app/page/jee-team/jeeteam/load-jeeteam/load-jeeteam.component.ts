import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-load-jeeteam',
  templateUrl: './load-jeeteam.component.html',
  styleUrls: ['./load-jeeteam.component.scss']
})
export class LoadJeeteamComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }
  @Input() RowId: any;
  ngOnInit(): void {
    const sb = this.route.params.subscribe(params => {
      this.RowId = +params.idmenu;

      localStorage.setItem("RowIdTeam", JSON.stringify(this.RowId))
    })
  }

}
