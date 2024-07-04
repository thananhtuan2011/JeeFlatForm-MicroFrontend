import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) { }

  transform(list: any, searchText: string): any {

    if (!list) { return null; }
    if (!searchText) { return list; }

    const value = list.toString().replace(
      searchText, `<span style='color:#6993ff'>${searchText}</span>`);

    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
}
