import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { QueryParamsModelNew } from '../../models/query-models/query-params.model';
import { MenuWorkService } from '../services/menu-work.services';
import { DanhMucChungService } from '../../services/danhmuc.service';

@Component({
  selector: 'app-don-vi-thuc-hien',
  templateUrl: './don-vi-thuc-hien.component.html',
  styleUrls: ['./don-vi-thuc-hien.component.scss']
})
export class DonViThucHienComponent implements OnInit {

  DonViThucHien = [];
  clickedItem: string;
  constructor(
    public _menuWorkSerVices: MenuWorkService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    public DanhMucChungService: DanhMucChungService,

  ) { }

  ngOnInit(): void {
    this.loadDataDVTH();
  }

  loadDataDVTH() {
    const queryParams = new QueryParamsModelNew(
      '',
      'asc',
      '',
    );
    this._menuWorkSerVices.getDonViThucHien(queryParams).subscribe((res) => {
      if(res){
        this.DonViThucHien = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  filterConfiguration(): any {
    // this.filter.StatusID = this.filterStatusID;
    // if (this.IsToiGui == true) {
    //     this.filter.typeid = "0";
    // } else {
    //     this.filter.typeid = "1";
    // }
    // return this.filter;
  }
  onClick(id_row) {
		this.clickedItem = id_row;
    this.router.navigateByUrl(`Work/list/4/`+id_row);
	  }
}
