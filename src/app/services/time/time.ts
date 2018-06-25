import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable()
export class TimeService {
  private m: any = moment.utc;

  useUTC() {
    this.m = this.m.utc;
  }

  getReadableDate(timestamp: string) {
    return this.m(timestamp).format('dddd, MMMM Do YYYY');
  }

  getReadableTimeShort(timestamp: string) {
    // return moment(timestamp).format('DD/MM/YYYY, h:mm:ss a');
    return this.m(timestamp).format('lll');
  }
}
