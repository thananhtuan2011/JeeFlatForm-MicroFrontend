import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-loading',
  templateUrl: './content-loading.component.html',
  styleUrls: ['./content-loading.component.scss']
})
export class ContentLoadingComponent implements OnInit {
  // loading content 10 recods
Loadingbody:any[]=[
  {id:1},
  {id:2},
  {id:3},
  {id:4},
  {id:5},
  {id:6},
  {id:7},
  {id:8},
  {id:9},
  {id:10},
 
];
  constructor() { }

  ngOnInit(): void {
  }

}
