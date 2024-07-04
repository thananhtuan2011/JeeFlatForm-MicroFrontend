import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'projects/jeemeet/src/environments/environment';
import { QuanLyCuocHopService } from '../../../_services/quan-ly-cuoc-hop.service';
@Component({
  selector: 'app-export-word',
  templateUrl: './export-word.component.html',
  styleUrls: ['./export-word.component.scss']
})
export class ExportWordComponent implements OnInit {
  hasFormErrors: boolean = false;
  CuocHopForm: FormGroup;
  NoiDung:boolean = true
  public now = new Date();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private CuocHopFB: FormBuilder,
  public dangKyCuocHopService: QuanLyCuocHopService,
  private datePipe: DatePipe) { }

  ngOnInit() {
	if(this.data.item){
		this.NoiDung = false
	}
	this.createForm()
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  createForm() {
    this.CuocHopForm = this.CuocHopFB.group({
    	DuLieu1: ["", [Validators.required, Validators.pattern(/[\S]/)]],
		DuLieu2: ["", [Validators.required, Validators.pattern(/[\S]/)]],
		DuLieu3: ["", [Validators.required, Validators.pattern(/[\S]/)]],
		DuLieu4: ["", [Validators.required, Validators.pattern(/[\S]/)]],
		DuLieu5: ["", [Validators.required, Validators.pattern(/[\S]/)]],
		DuLieu6: ["", [Validators.required, Validators.pattern(/[\S]/)]],
		DuLieu7: ["", [Validators.required, Validators.pattern(/[\S]/)]]
    });
  }

  ConvertHtmlToText(text = '') {
	const noidung = text.replace(/(<([^>]+)>)/gi, "");
	return noidung
  }

  onSubmit(){

	const controls = this.CuocHopForm.controls;
	var params = {
		DuLieu1: controls["DuLieu1"].value,
		DuLieu2: controls["DuLieu2"].value,
		DuLieu3: controls["DuLieu3"].value,
		DuLieu4: controls["DuLieu4"].value,
		DuLieu5: controls["DuLieu5"].value,
		DuLieu6: controls["DuLieu6"].value,
		DuLieu7: controls["DuLieu7"].value,
		NoiDung: this.data.item.KetLuan,
		ThoiGian: this.data.item.BookingDate,
		DiaDiem: this.data.item.DiaDiem,
		TenCuocHop: this.data.item.MeetingContent,
		ListThamGia: this.data.item.ThanhPhanThamGia
	}
	var request = new XMLHttpRequest();
	var salt =this.datePipe.transform( new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()), "yyyyMMdd");
	var link = environment.APIROOT + `/api/quanlycuochop/XuatWord`;
	request.open("POST", link, true);
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	request.responseType = "arraybuffer";
	request.onload = function (e) {
		var file;
		let name = "";
		if (this.status == 200) {
			file = new Blob([this.response], { type: 'application/msword' });
			name = "CuocHop_" + salt + ".docx";
		} else {
			file = new Blob([this.response], { type: 'text/plain' });
			name = "ErrorsLog.txt";
		}
		// if (navigator.msSaveBlob) {
		// 	return navigator.msSaveBlob(file);
		// }

		var url = window.URL.createObjectURL(file);
		var df = document.getElementById("downloadFile");
		df.setAttribute("href", url);
		df.setAttribute("download", name);
		df.click();
		window.URL.revokeObjectURL(url);
	}
	request.send(JSON.stringify(params));
  }
}
