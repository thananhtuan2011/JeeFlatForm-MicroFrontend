import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeviewComponent } from './treeview/treeview.component';
import { TreeviewItemComponent } from './treeview-item/treeview-item.component';



@NgModule({
  declarations: [
    TreeviewComponent,
    TreeviewItemComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DpsTreeviewModule { }
