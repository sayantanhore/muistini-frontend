import { Component, ElementRef, AfterViewInit } from '@angular/core';

require('./_blip');

@Component({
  selector: 'blip',
  templateUrl: 'blip.html'
})

export class Blip implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    console.log(this.el.nativeElement.offsetWidth);
  }
}
