
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { environment } from '../../../../../../../../environments/environment';
// import { QLCuocHopService } from '../../quan-ly-cuoc-hop-service/quan-ly-cuoc-hop.service';
import { TranslateService } from '@ngx-translate/core';
import { QuanLyCuocHopService } from '../../../_services/quan-ly-cuoc-hop.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { environment } from 'projects/jeemeet/src/environments/environment';
import { quillConfig } from '../editor/Quill_config';

@Component({
  selector: 'app-dien-bien-cuoc-hop',
  templateUrl: './dien-bien-cuoc-hop.component.html',
  styleUrls: ['./dien-bien-cuoc-hop.component.scss']
})
export class DienBienCuocHopComponent implements OnInit {
  hasFormErrors: boolean = false;
  CuocHopForm: FormGroup;
  EDIT_FONT_EDITOR: string = '';
  EDIT_FONTSIZE_EDITOR: string = '';
  NoiDungDienBien: string = '';
  public quillConfig: {};
  editorStyles = {
    'min-height': '200px',
    'max-height': '200px',
    height: '100%',
    'font-size': '12pt',
    'overflow-y': 'auto',
    // 'width':'80pw'
  };
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DienBienCuocHopComponent>,
  private CuocHopFB: FormBuilder,
  public dangKyCuocHopService: QuanLyCuocHopService,
  private layoutUtilsService: LayoutUtilsService,
  private translate: TranslateService,) { }

  ngOnInit() {
    this.quillConfig = quillConfig;
		this.createForm()
  }
  createForm() {
    this.CuocHopForm = this.CuocHopFB.group({
    	noiDung: ["" + this.data.noiDung, [Validators.required, Validators.pattern(/[\S]/)]],
    });
		this.NoiDungDienBien = this.data.noiDung
  }
  close() {
    this.dialogRef.close();
  }
  CapNhatNoiDungKetLuan() {
	let _item = {
		NoiDung: this.NoiDungDienBien,
		meetingid: this.data._item,
		type: 3
	}
	this.dangKyCuocHopService.CapNhatTomTatKetLuan(_item).subscribe(res => {
		if (res && res.status === 1) {
			this.layoutUtilsService.showActionNotification(
				this.translate.instant("QL_CUOCHOP.CUOCHOP.UPDATE_THANHCONG"),
				MessageType.Read,
				4000,
				true,
				false,
				3000,
				"top"
			);
			this.dialogRef.close();
		} else {
			this.layoutUtilsService.showActionNotification(
				res.error.message,
				MessageType.Read,
				9999999999,
				true,
				false,
			);
		}
	});
}

  public setupTinyMce(): any {
	if (this.EDIT_FONT_EDITOR == '' && this.EDIT_FONTSIZE_EDITOR == '') {
		return {
			plugins: 'paste print code preview  searchreplace autolink directionality  visualblocks visualchars fullscreen image link media  template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help powerpaste ',
			toolbar: 'undo redo |image| styleselect |  fontselect| fontsizeselect| bold italic underline | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | forecolor backcolor image link table  | removeformat preview ',
			toolbar_mode: 'wrap',
			image_uploadtab: true,
			paste_as_text: true,
			height: 400,
			fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",
			// font_formats: 'Helvetica=Helvetica;UTM Avo=UTMAvo;',
			font_formats: "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; UTM Avo=UTMAvo; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
			images_upload_url: environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop',
			automatic_uploads: true,
			images_upload_base_path: '/images',
			convert_urls: true,
			relative_urls: false,
			remove_script_host: false,
			images_upload_credentials: true,
			images_upload_handler: function (blobInfo, success, failure) {
				var xhr, formData;

				xhr = new XMLHttpRequest();
				xhr.withCredentials = false;
				xhr.open('POST', environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop');

				xhr.onload = function () {
					var json;

					if (xhr.status < 200 || xhr.status >= 300) {
						failure('HTTP Error: ' + xhr.status);
						return;
					}
					json = JSON.parse(xhr.responseText);

					if (!json || typeof json.imageUrl != 'string') {
						failure('Invalid JSON: ' + xhr.responseText);
						return;
					}
					success(json.imageUrl);
				};
				formData = new FormData();
				formData.append('file', blobInfo.blob(), blobInfo.filename());

				xhr.send(formData);
			},
			init_instance_callback: function () {
				var freeTiny = document.querySelector('.tox .tox-notification--in') as HTMLInputElement;
				freeTiny.style.display = 'none';
			},
			content_style: '.tox-notification--in{display:none};'
		};
	}
	else if (this.EDIT_FONT_EDITOR != '' && this.EDIT_FONTSIZE_EDITOR == '') {
		return {
			plugins: 'paste print code preview  searchreplace autolink directionality  visualblocks visualchars fullscreen image link media  template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help powerpaste ',
			toolbar: 'undo redo |image| styleselect |  fontselect| fontsizeselect| bold italic underline | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | forecolor backcolor image link table  | removeformat preview ',
			toolbar_mode: 'wrap',
			image_uploadtab: true,
			paste_as_text: true,
			height: 400,
			fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",
			font_formats: this.EDIT_FONT_EDITOR,
			images_upload_url: environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop',
			automatic_uploads: true,
			images_upload_base_path: '/images',
			convert_urls: true,
			relative_urls: false,
			remove_script_host: false,
			images_upload_credentials: true,
			images_upload_handler: function (blobInfo, success, failure) {
				var xhr, formData;

				xhr = new XMLHttpRequest();
				xhr.withCredentials = false;
				xhr.open('POST', environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop');

				xhr.onload = function () {
					var json;

					if (xhr.status < 200 || xhr.status >= 300) {
						failure('HTTP Error: ' + xhr.status);
						return;
					}
					json = JSON.parse(xhr.responseText);

					if (!json || typeof json.imageUrl != 'string') {
						failure('Invalid JSON: ' + xhr.responseText);
						return;
					}
					success(json.imageUrl);
				};
				formData = new FormData();
				formData.append('file', blobInfo.blob(), blobInfo.filename());

				xhr.send(formData);
			},
			init_instance_callback: function () {
				var freeTiny = document.querySelector('.tox .tox-notification--in') as HTMLInputElement;
				freeTiny.style.display = 'none';
			},
			content_style: '.tox-notification--in{display:none};'
		};
	}
	else if (this.EDIT_FONT_EDITOR == '' && this.EDIT_FONTSIZE_EDITOR != '') {
		return {
			plugins: 'paste print code preview  searchreplace autolink directionality  visualblocks visualchars fullscreen image link media  template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help powerpaste ',
			toolbar: 'undo redo |image| styleselect |  fontselect| fontsizeselect| bold italic underline | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | forecolor backcolor image link table  | removeformat preview ',
			toolbar_mode: 'wrap',
			image_uploadtab: true,
			paste_as_text: true,
			height: 400,
			fontsize_formats: this.EDIT_FONTSIZE_EDITOR,
			font_formats: "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; UTM Avo=UTMAvo; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
			images_upload_url: environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop',
			automatic_uploads: true,
			images_upload_base_path: '/images',
			convert_urls: true,
			relative_urls: false,
			remove_script_host: false,
			images_upload_credentials: true,
			images_upload_handler: function (blobInfo, success, failure) {
				var xhr, formData;

				xhr = new XMLHttpRequest();
				xhr.withCredentials = false;
				xhr.open('POST', environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop');

				xhr.onload = function () {
					var json;

					if (xhr.status < 200 || xhr.status >= 300) {
						failure('HTTP Error: ' + xhr.status);
						return;
					}
					json = JSON.parse(xhr.responseText);

					if (!json || typeof json.imageUrl != 'string') {
						failure('Invalid JSON: ' + xhr.responseText);
						return;
					}
					success(json.imageUrl);
				};
				formData = new FormData();
				formData.append('file', blobInfo.blob(), blobInfo.filename());

				xhr.send(formData);
			},
			init_instance_callback: function () {
				var freeTiny = document.querySelector('.tox .tox-notification--in') as HTMLInputElement;
				freeTiny.style.display = 'none';
			},
			content_style: '.tox-notification--in{display:none};'
		};
	}
	else {
		return {
			plugins: 'paste print code preview  searchreplace autolink directionality  visualblocks visualchars fullscreen image link media  template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern help powerpaste ',
			toolbar: 'undo redo |image| styleselect |  fontselect| fontsizeselect| bold italic underline | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify | forecolor backcolor image link table  | removeformat preview ',
			toolbar_mode: 'wrap',
			image_uploadtab: true,
			paste_as_text: true,
			height: 400,
			fontsize_formats: this.EDIT_FONTSIZE_EDITOR,
			font_formats: this.EDIT_FONT_EDITOR,
			images_upload_url: environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop',
			automatic_uploads: true,
			images_upload_base_path: '/images',
			convert_urls: true,
			relative_urls: false,
			remove_script_host: false,
			images_upload_credentials: true,
			images_upload_handler: function (blobInfo, success, failure) {
				var xhr, formData;
				xhr = new XMLHttpRequest();
				xhr.withCredentials = false;
				xhr.open('POST', environment.APIROOT + '/Tool/upload-img?idAcc=' + 'cuoc-hop');
				xhr.onload = function () {
					var json;

					if (xhr.status < 200 || xhr.status >= 300) {
						failure('HTTP Error: ' + xhr.status);
						return;
					}
					json = JSON.parse(xhr.responseText);

					if (!json || typeof json.imageUrl != 'string') {
						failure('Invalid JSON: ' + xhr.responseText);
						return;
					}
					success(json.imageUrl);
				};
				formData = new FormData();
				formData.append('file', blobInfo.blob(), blobInfo.filename());

				xhr.send(formData);
			},
			init_instance_callback: function () {
				var freeTiny = document.querySelector('.tox .tox-notification--in') as HTMLInputElement;
				freeTiny.style.display = 'none';
			},
			content_style: '.tox-notification--in{display:none};'
		};
	}
}
}
