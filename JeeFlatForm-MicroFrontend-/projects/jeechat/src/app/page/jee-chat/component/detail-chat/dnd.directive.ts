import {
    Directive,
    Output,
    Input,
    EventEmitter,
    HostBinding,
    HostListener
  } from '@angular/core';
  
  @Directive({
    selector: '[appDnd]'
  })
  export class DndDirective {
    @Output() fileDropped = new EventEmitter<any>();
    @Output() hoverfile = new EventEmitter<any>();
    @Output()closefile = new EventEmitter<any>();
    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      this.hoverfile.emit()
     
    }
  
    // Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
      evt.preventDefault();
      evt.stopPropagation();
  this.closefile.emit()
    }
  
    // Drop listener
    @HostListener('drop', ['$event']) public ondrop(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      let files = evt.dataTransfer.files;
      if (files.length > 0) {
        this.fileDropped.emit(files);
      }
      else{
        this.closefile.emit()
      }
    }
  }
  