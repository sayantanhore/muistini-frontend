import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  ElementRef,
  QueryList,
  Renderer2 } from '@angular/core';

import * as moment from 'moment';

require('./_audio.list');

@Component({
  selector: 'audio-list',
  templateUrl: 'audio.list.html'
})
export class AudioList {
  @Input()items: any[];
  @ViewChildren('audioItem')audioItems: QueryList<ElementRef>;
  @Output('selectAudioItem')selectAudioItem: EventEmitter<any> = new EventEmitter<any>();

  constructor(private renderer: Renderer2) {}

  resetSelection() {
    this.audioItems.forEach((item: ElementRef) => {
      this.renderer.removeClass(item.nativeElement, 'selected');
    });
  }

  getTime(timestamp: string) {
    return moment(timestamp.substr(0, timestamp.length - 1)).format('LTS');
  }

  getDate(timestamp: string) {
    return moment(timestamp.substr(0, timestamp.length - 1)).format('L');
  }

  selectItem(event: MouseEvent, audioItemSelected: any, selectedIndex: number) {
    this.resetSelection();
    this.renderer.addClass(this.audioItems.toArray()[selectedIndex].nativeElement, 'selected');
    this.selectAudioItem.emit(audioItemSelected);
  }
}
