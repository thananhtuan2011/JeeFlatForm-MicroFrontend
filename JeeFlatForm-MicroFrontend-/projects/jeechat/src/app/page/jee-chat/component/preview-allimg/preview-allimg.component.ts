import { ChangeDetectorRef, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { Lightbox } from '@ngx-gallery/lightbox';
import { Gallery, GalleryItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-preview-allimg',
  templateUrl: './preview-allimg.component.html',
  styleUrls: ['./preview-allimg.component.scss']
})
export class PreviewAllimgComponent implements OnInit {
  config = {
    wheelZoom: true,
  }
  base64Image: any;
  openimg:any[]=[]
  items: GalleryItem[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  public gallery: Gallery,
  private dialogRef:MatDialogRef<PreviewAllimgComponent>,
  private changeDetectorRefs: ChangeDetectorRef,
  ) { }
  @ViewChild('itemTemplate') itemTemplate: TemplateRef<any>;
  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL: string = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }
  downloadimage( url: string) {
    this.getBase64ImageFromURL(url).subscribe(base64data => {
      this.base64Image = "data:image/jpg;base64," + base64data;
      // save image to disk
      var link = document.createElement("a");

      document.body.appendChild(link); // for Firefox

      link.setAttribute("href", this.base64Image);
      link.setAttribute("download", "download.jpg");
      link.click();
    });
  }
  ngOnInit(): void {
    if(this.data.ischat)
    {

      // this.loadlightbox();
      this.items = this.data.item.map(item => {
        return {
          type: 'imageViewer',
          data: {
                    src: item.hinhanh,
                    thumb: item.hinhanh,
                    data2: [
                      item.hinhanh,
                     // thumb: item.hinhanh,
                   ],
                  },
        };
      });
  
      /** Lightbox Example */
  
      // Get a lightbox gallery ref
      const lightboxRef = this.gallery.ref('lightbox');
  
      // Add custom gallery config to the lightbox (optional)
      lightboxRef.setConfig({
        imageSize: ImageSize.Cover,
        thumbPosition: ThumbnailsPosition.Top,
        itemTemplate: this.itemTemplate,
        gestures: false
      });
  
      // Load items into the lightbox gallery ref
      lightboxRef.load(this.items);
    }
    else
    {

    this.openimg.push(this.data)
    // this.loadlightbox();
    this.items = this.openimg.map(item => {
      return {
        type: 'imageViewer',
        data: {
                  src: item.hinhanh,
                  thumb: item.hinhanh,
                  data2: [
                    item.hinhanh,
                   // thumb: item.hinhanh,
                 ],
                },
      };
    });

    /** Lightbox Example */

    // Get a lightbox gallery ref
    const lightboxRef = this.gallery.ref('lightbox');

    // Add custom gallery config to the lightbox (optional)
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top,
      itemTemplate: this.itemTemplate,
      gestures: false
    });

    // Load items into the lightbox gallery ref
    lightboxRef.load(this.items);
  }

  }
  goBack() {
   
    this.dialogRef.close();
  
  }
  }
  // items: GalleryItem[] = [];
  // @ViewChild('itemTemplate', { static: true }) itemTemplate: TemplateRef<any> | undefined;
  // loadlightbox() {
  //   // this.viewer.=false
    
  //   this.items =this.openimg.map((item) => {
  //     return {
  //       type: 'imageViewer',
  //       data: {
  //         src: item.hinhanh,
  //         thumb: item.hinhanh,
  //         data2: [
  //           item.hinhanh,
  //          // thumb: item.hinhanh,
  //        ],
  //       },
      
  //     };
  //   });
  
  //   /** Lightbox Example */
  
  //   // Get a lightbox gallery ref
  //   const lightboxRef = this.gallery.ref('lightbox');
  
  //   // Add custom gallery config to the lightbox (optional)
  //   lightboxRef.setConfig({
  //     imageSize: ImageSize.Cover,
  //     thumbPosition: ThumbnailsPosition.Bottom,
  //     itemTemplate: this.itemTemplate,
  //     gestures: true,
  //   });
  
  //   // Load items into the lightbox gallery ref
  //   let ob = this.items;
  //   console.log("ccc",this.items)
  //   lightboxRef.load(this.items);
  //   this.changeDetectorRefs.detectChanges();
  // }
// }
