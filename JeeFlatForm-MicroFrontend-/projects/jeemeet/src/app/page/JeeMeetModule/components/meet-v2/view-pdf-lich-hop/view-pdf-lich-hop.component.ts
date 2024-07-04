import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { QuanLyCuocHopService } from '../../../_services/quan-ly-cuoc-hop.service';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';

@Component({
  selector: 'app-view-pdf-lich-hop',
  templateUrl: './view-pdf-lich-hop.component.html',
  styleUrls: ['./view-pdf-lich-hop.component.scss']
})
export class ViewPdfLichHopComponent implements OnInit {
  @ViewChild("fileDropRef") fileDropRef: any;
  files: any[] = [];
  elementPreviewPDF: string = ``
  showPreviewPDF: boolean = false
  showUpload: boolean = false
  constructor(private QLCuocHopService: QuanLyCuocHopService, private layoutUtilsService: LayoutUtilsService, private changeDetectorRefs: ChangeDetectorRef,) { }
  public getAuthFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }
  ngOnInit(): void {
    this.QLCuocHopService.getFilelichcongtac().subscribe(
      (res) => {
        if (res) {
          this.PreviewPDF(res.data)
        }
        else {
          this.elementPreviewPDF = ""
        }

      }
    );
    const user = this.getAuthFromLocalStorage()['user'];
    let username = user["username"];
    if (username == 'binhthuan.admin' || username == 'vt86.admin' || username == 'btn.khiemkt' || username == '060082000310' || username == '060089000267' || username == '060184000487') {
      this.showPreviewPDF = true;
    }
  }
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 120;
    return tmp_height + 'px';
  }
  PreviewPDF(Link: string) {
    let extension = Link.split(".").pop();
    if (extension == "pdf") {
      let url = Link;
      let currentTime = new Date().getTime();
      this.elementPreviewPDF = `<object data="${url}?X-Amz-Algorithm=AWS4-HMAC-SHA256&time=${currentTime}#view=FitH" type="application/pdf" width="100%" height="100%">
        <p>Không thể hiển thị hướng dẫn. <a href="${url}?X-Amz-Algorithm=AWS4-HMAC-SHA256&time=${currentTime}">Tải vể</a> hướng dẫn.</p>
        </object>`
      this.changeDetectorRefs.detectChanges();
    }
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this.files.push(item);
      this.onSubmit()
      this.showPreviewPDF = !this.showPreviewPDF
      this.fileDropRef.nativeElement.value = '';
    }
  }

  onSubmit() {

    let editedQuanLyDocument = this.prepareQuanLyDocument();
    this.createFile(editedQuanLyDocument);
    return;
  }
  /**
   * Returns object for saving
   */
  prepareQuanLyDocument() {
    var Data: any = new FormData();
    for (var i = 0; i < this.files.length; i++) {
      if (this.files[i]) {
        Data.append("FileDinhKem" + i, this.files[i]);
      }
    }
    return Data;
  }

  createFile(item: any, withBack: boolean = false) {
    this.QLCuocHopService.createFilelichcongtat(item).subscribe(
      (res) => {
        if (res) {
          this.layoutUtilsService.showActionNotification(
            "Cập nhật file lịch công tác thành công!",
            MessageType.Delete,
            2000,
            true,
            false
          );
          this.PreviewPDF(res.data)
        }
        else {
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Error,
            20000,
            true,
            false
          );
        }

      }
    );

  }

}
