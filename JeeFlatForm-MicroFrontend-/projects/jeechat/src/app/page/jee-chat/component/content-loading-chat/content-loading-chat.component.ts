import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-loading-chat',
  templateUrl: './content-loading-chat.component.html',
  styleUrls: ['./content-loading-chat.component.scss']
})
export class ContentLoadingChatComponent implements OnInit {
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
