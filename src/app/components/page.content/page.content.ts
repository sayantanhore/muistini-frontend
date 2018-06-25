import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges} from '@angular/core';

import * as moment from 'moment';

import { AudioService } from 'app/services/audio';
import { TimeService } from 'app/services/time';

require('./_page.content');

@Component({
  selector: 'page-content',
  templateUrl: 'page.content.html'
})

export class PageContent implements AfterViewInit, OnChanges {
  @Input() audioList: any[] = [];
  @Input() imageList: any[] = [];
  private results: any[];
  private groupByCreatedTime: any = {};
  private groupByDate: any = {};
  @ViewChildren('div') divs: QueryList<ElementRef>;
  private _keys: any = Object.keys;

  constructor(
    private audioService: AudioService,
    private timeService: TimeService) {}

  resizeContent() {
    console.log(this.divs.length)
  }

  ngAfterViewInit() {
    this.resizeContent();
  }

  getDistinctTimestampsSorted(dates: Object): any[] {
    return Object.keys(dates).sort((a, b) => moment.utc(a).isAfter(moment.utc(b)) ? -1 : 1);
  }

  arrangeByDate() {
    /*
    if (!this.results) {
      this.results = [];
    }
    */
    this.results = [];
    //this.results = this.results.concat(list);
    if (this.audioList && this.audioList.length > 0) {
      this.results = this.results.concat(this.audioList);
    }
    if (this.imageList && this.imageList.length > 0) {
      this.results = this.results.concat(this.imageList);
    }
    new Set(
      this.results.map((result: any) => moment.utc(result.createdtime).startOf('date'))
    ).forEach((date: any) => {
      this.groupByDate[date] = this.results.filter((result: any) =>
        moment.utc(result.createdtime).startOf('date').isSame(date)
      ).sort((a, b) =>
        moment.utc(a.createdtime).isAfter(moment.utc(b.createdtime)) ? -1 : 1
      );
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.arrangeByDate();
  }

  ngOnChanges2(changes: SimpleChanges) {
    if (changes.audioList && changes.audioList.previousValue) {
      //this.results = [];
    }
    if (changes.imageList && changes.imageList.previousValue) {
      //this.results = [];
    }

    if (changes.audioList && changes.audioList.currentValue !== changes.audioList.previousValue) {
      //this.results.concat(changes.audioList);
      //this.arrangeByDate(changes.audioList.currentValue);
    }
    if (changes.imageList && changes.imageList.currentValue !== changes.imageList.previousValue) {
      //this.results.concat(changes.imageList);
      //this.arrangeByDate(changes.imageList.currentValue);
    }
  }

  play(filename: string) {
    this.audioService.nowPlaying.next(filename);
  }
}
