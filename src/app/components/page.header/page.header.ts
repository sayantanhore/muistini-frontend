import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

require('./_page.header');

@Component({
  selector: 'page-header',
  templateUrl: 'page.header.html'
})

export class PageHeader {
  private lat: number = 60.21607;
  private lng: number = 24.97837;
  private startAt: any;
  private endAt: any;
  private dateFormGroup: FormGroup;

  @Output() mapEnter: EventEmitter<any> = new EventEmitter<any>();
  @Output() startDateEnter: EventEmitter<any> = new EventEmitter<any>();
  @Output() endDateEnter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    this.dateFormGroup = fb.group({
      'start': null,
      'end': null
    });
  }

  userInput(type: string, event: any) {
    console.log(type, event.value);
    if (!event.value) {

    }
  }

  startDateEntered(component: string, event: any) {
    console.log(this.dateFormGroup.valid);
    if (component === 'start') {
      if (!event.value) {

        this.dateFormGroup.controls['start'].setValue(this.startAt);
      }
      else {
        //const dateRegexp = /\d{2}\/\d{2}\/\d{4}/.test(event.value);
        this.dateFormGroup.controls['start'].setValue(event.value);
        this.startAt = event.value;
      }
    }
    else {
      if (!event.value) {
        this.dateFormGroup.controls['end'].setValue(this.endAt);
      }
      else {
        this.dateFormGroup.controls['end'].setValue(event.value);
        this.endAt = event.value;
      }
    }
  }

  onEnter(address: any) {
    this.mapEnter.emit(address);
  }

  handleKeyPressStartDate(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.startDateEnter.emit(this.dateFormGroup.controls['start'].value);
    }
  }

  handleKeyPressEndDate(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.endDateEnter.emit(this.dateFormGroup.controls['end'].value);
    }
  }
}
