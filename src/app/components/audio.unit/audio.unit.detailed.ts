import {
  Component,
  Inject,
  Renderer2,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit } from '@angular/core';

import { trigger, state, style, animate, transition } from '@angular/animations';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AudioService } from 'app/services/audio';
import { DataService } from 'app/services/data';
import * as moment from 'moment';

require('./_audio.unit.detailed');

@Component({
  selector: 'audio-unit-detailed',
  templateUrl: 'audio.unit.detailed.html',
  animations: [
    trigger('playbackState', [
      state('middle', style({
        width: '*',
        top: '*',
        left: '*'
      })),
      state('up', style({
        width: '50%',
        left: '50%',
        top: '10%',
        transform: 'translateX(-50%)'
      })),
      transition('middle => up', animate('200ms ease-in'))
    ])
  ]
})
export class AudioUnitDetailed implements AfterViewInit {
  private state: string = 'middle';
  private audioSource: any;
  private isPlaying: boolean;
  private isSuspended: boolean;
  private count: number = 0;
  private timer: any;
  private audioItemPlaying: any;
  private audioListItems: any[] = [];
  @ViewChild('playbackControls') playbackControls: ElementRef;
  @ViewChild('audioList') audioList: ElementRef;
  @ViewChild('slider')slider: ElementRef;
  @ViewChild('head')head: ElementRef;
  @ViewChild('btnPrevious', { read: ElementRef })btnPrevious: any;
  @ViewChild('btnNext', { read: ElementRef })btnNext: any;
  private sliderStepLength: number = 0;

  constructor(
    private data: DataService,
    private audioService: AudioService,
    private renderer: Renderer2,
    private dialogRef: MatDialogRef<AudioUnitDetailed>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any,
    private chDref: ChangeDetectorRef) {
      this.audioItemPlaying = this.dialogData.audioItem;
    }

  ngAfterViewInit() {
    this.sliderStepLength = this.slider.nativeElement.offsetWidth / 12; // Change 12 to duration
  }

  close(event: MouseEvent) {
    if (this.audioSource) {
      this.stop();
    }
    this.dialogRef.close();
  }

  getAdjacentAudioItems(direction: string) {
    if (direction === 'previous') {
      this.data.getAudioBefore(this.dialogData.audioItem.createdtime).subscribe((audioItems: any[]) => {
        this.audioListItems = audioItems;
      });
    }
    else {
      this.data.getAudioAfter(this.dialogData.audioItem.endtime).subscribe((audioItems: any[]) => {
        this.audioListItems = audioItems;
      });
    }
  }

  getTime(timestamp: string) {
    const timestr: string = moment(timestamp.substr(0, timestamp.length - 1)).format('LTS');
    return timestr.substr(0, timestr.length - 2);
  }

  getMeridiem(timestamp: string) {
    const timestr: string =  moment(timestamp.substr(0, timestamp.length - 1)).format('LTS');
    return timestr.substr(timestr.length - 2, 2);
  }

  getDate(timestamp: string) {
    return moment(timestamp.substr(0, timestamp.length - 1)).format('L');
  }

  onStartAnimation(event: Event) {
    console.log('started');
  }

  onDoneAnimation(event: Event) {
    if (this.state === 'up') {
      this.renderer.addClass(this.playbackControls.nativeElement, 'navigating');
      this.sliderStepLength = this.slider.nativeElement.offsetWidth / 12;
    }
  }

  resetnavigationButtonStyling() {
    [this.btnPrevious, this.btnNext].forEach((btn: any) => {
      this.renderer.removeClass(btn.nativeElement, 'activated');
    });
  }

  goToPrevious(event: MouseEvent) {
    if (this.state !== 'up') {
      this.state = 'up';
      this.renderer.removeClass(this.audioList.nativeElement, 'hidden');
    }
    this.resetnavigationButtonStyling();
    this.renderer.addClass(this.btnPrevious.nativeElement, 'activated');
    this.getAdjacentAudioItems('previous');
  }

  goToNext(event: MouseEvent) {
    if (this.state !== 'up') {
      this.state = 'up';
      this.renderer.removeClass(this.audioList.nativeElement, 'hidden');
    }
    this.resetnavigationButtonStyling();
    this.renderer.addClass(this.btnNext.nativeElement, 'activated');
    this.getAdjacentAudioItems('next');
  }

  stop(event?: MouseEvent) {
    this.isPlaying = false;
    this.audioSource.stop();
    this.audioSource = null;
  }

  play() {
    this.isPlaying = true;
    this.data.getAudioFromGDrive(this.audioItemPlaying.filename)
    .subscribe(
      (audioBuffer: ArrayBuffer) => {
        this.playAudio(audioBuffer);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onClickPlay(event: MouseEvent) {
    if (this.isSuspended) {
      this.onClickResume(event);
    }
    else {
      this.play();
    }
    if (event) {
      event.stopPropagation();
    }
  }

  onClickPause(event?: MouseEvent) {
    if (!this.isSuspended) {
      this.audioService.audioContext.suspend().then(() => {
        this.isSuspended = true;
      });
    }
    else {
      this.audioService.audioContext.resume().then(() => {
        this.isSuspended = false;
      });
    }
    if (event) {
      event.stopPropagation();
    }
  }

  onClickResume(event: MouseEvent) {
    this.audioService.audioContext.resume().then(() => {
      this.isSuspended = false;
    });
    if (event) {
      event.stopPropagation();
    }
  }

  onClickStop(event?: MouseEvent) {
    console.log('event', event);
    this.isPlaying = false;
    if (this.isSuspended) {
      this.audioService.audioContext.resume().then(() => {
        this.audioSource.stop();
        this.audioSource = null;
        this.isSuspended = false;
      });
    }
    else {
      this.audioSource.stop();
      this.audioSource = null;
    }
    if (event) {
      event.stopPropagation();
    }
  }

  setSliderHead(step: number) {
    this.renderer.setStyle(this.head.nativeElement, 'width', (step * this.sliderStepLength) + 'px');
  }

  onSelectAudioItem(audioItemSelected: any) {
    if (this.isPlaying) {
      this.stop();
    }
    this.audioItemPlaying = audioItemSelected;
  }

  private playAudio(buff: ArrayBuffer) {
    this.audioService.audioContext.decodeAudioData(buff, (buffer: any) => {
      this.audioSource = this.audioService.audioContext.createBufferSource();
      this.audioSource.buffer = buffer;
      this.audioSource.connect(this.audioService.audioContext.destination);
      this.audioSource.onended = () => {
        this.isPlaying = false;
        this.isSuspended = false;
        clearInterval(this.timer);
        this.count = 0;
        this.setSliderHead(this.count);
        this.chDref.detectChanges();
      };
      this.audioSource.start(0);
      this.timer = setInterval(() => {
        if (!this.isSuspended) {
          this.count += 1;
        }
        this.setSliderHead(this.count);
        this.chDref.detectChanges();
      }, 1000);
    });
  }
}
