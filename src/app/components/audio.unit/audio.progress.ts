import {
  Input,
  Component,
  OnChanges,
  AfterViewChecked,
  AfterContentInit,
  ElementRef,
  ViewChild,
  Renderer2 } from '@angular/core';

require('./_audio.progress');

@Component({
  selector: 'audio-progress',
  templateUrl: 'audio.progress.html'
})
export class AudioProgress implements OnChanges, AfterViewChecked, AfterContentInit {
  @Input()duration: number;
  @Input()step: number;
  @ViewChild('head') head: ElementRef;
  private stepLength: number;
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  setHead(position: number) {
    this.renderer.setStyle(this.head.nativeElement, 'left', position + 'px');
  }

  ngOnChanges() {
    console.log(this.step);
    this.setHead(this.stepLength * this.step - 2);
  }

  ngAfterViewChecked() {
    //alert(this.el.nativeElement.clientWidth);
    if (!this.stepLength) {
      this.stepLength = parseFloat(this.el.nativeElement.clientWidth) / 12;
      console.log(this.stepLength);

    }
  }

  ngAfterContentInit() {
    console.log(this.duration);
  }
}
