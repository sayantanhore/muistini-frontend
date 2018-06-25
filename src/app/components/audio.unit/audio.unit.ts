import {
  Component,
  OnInit,
  AfterContentInit,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChild,
  Renderer2,
  ChangeDetectorRef } from '@angular/core';

import { MediaChange, ObservableMedia } from '@angular/flex-layout';

import { Subscription } from 'rxjs/Subscription';

import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef
} from '@angular/material';

import { AudioUnitDetailed } from 'app/components/audio.unit';

import { WindowService } from 'app/services/window';
import { DataService } from 'app/services/data';
import { AudioService } from 'app/services/audio';
import { TimeService } from 'app/services/time';

import * as moment from 'moment';

require('./_audio.unit');

@Component({
  selector: 'audio-unit',
  templateUrl: 'audio.unit.html'
})

export class AudioUnit implements OnInit, AfterContentInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() private audioItem: any;
  private dialogRef: MatDialogRef<AudioUnitDetailed> | null = null;
  private dialogDim: string;
  private mediaWatcher: Subscription;
  private window: any;
  private isPlaying: boolean;
  private isSuspended: boolean;
  private audioSource: any;
  private count: number = 0;
  private timer: any;
  @ViewChild('slider')slider: ElementRef;
  @ViewChild('head')head: ElementRef;
  private sliderStepLength: number = 0;

  @HostListener('click')handleClick(event: MouseEvent) {
    console.log('clicked');
    const dialogConfig: MatDialogConfig = {
      maxWidth: '100vw',
      disableClose: true,
      width: this.dialogDim === 'FULLSCREEN' ? '100vw' : '600px',
      height: this.dialogDim === 'FULLSCREEN' ? '100vh' : '90vh',
      data: { audioItem: this.audioItem }
    }
    this.dialogRef = this.dialog.open(AudioUnitDetailed, dialogConfig);
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
  }

  @HostListener('window:resize')updateDialogDim() {
    if (this.dialogRef) {
      this.dialogRef.updateSize(
        this.dialogDim === 'FULLSCREEN' ? '100vw' : '600px',
        this.dialogDim === 'FULLSCREEN' ? '100vh' : '90vh'
      );
    }
  }

  @Output()audioPlay: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private data: DataService,
    private audioService: AudioService,
    private windowService: WindowService,
    private timeService: TimeService,
    private chDref: ChangeDetectorRef,
    private media: ObservableMedia,
    private dialog: MatDialog,
    private renderer: Renderer2) {
      this.window = this.windowService.native;
  }

  ngOnInit() {
    this.mediaWatcher = this.media.subscribe((change: MediaChange) => {
      console.log(change.mqAlias);
      this.dialogDim = (change.mqAlias === 'xs') ? 'FULLSCREEN' : '';
    });

    if (this.media.isActive('xs')) {
      this.dialogDim = 'FULLSCREEN';
    }
    else {
      this.dialogDim = '';
    }
  }

  ngAfterViewInit() {
    this.sliderStepLength = this.slider.nativeElement.offsetWidth / 12; // Change 12 to duration
  }

  setSliderHead(step: number) {
    this.renderer.setStyle(this.head.nativeElement, 'width', (step * this.sliderStepLength) + 'px');
  }

  ngAfterContentInit() {
    if (this.audioItem) {
      this.audioService.nowPlaying.subscribe((audioFilename: string) => {
        if (this.audioItem.filename !== audioFilename) {
          if (this.audioSource) {
            this.onClickStop();
          }
        }
        else {
          this.play();
        }
      });
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

  onClickResume(event: MouseEvent) {
    this.audioService.audioContext.resume().then(() => {
      this.isSuspended = false;
    });
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

  onClickButton(event: MouseEvent, isSuspended: boolean) {
    if (isSuspended) {
      this.onClickResume(event);
    }
    else {
      this.onClickPlay(event);
    }
  }

  onClickPlay(event: MouseEvent) {
    if (this.isSuspended) {
      this.onClickResume(event);
    }
    else {
      this.audioPlay.emit(this.audioItem.filename);
    }
    if (event) {
      event.stopPropagation();
    }
  }

  ngOnChanges() {
    console.log(this.audioItem);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    this.count = 0;
    this.mediaWatcher.unsubscribe();
  }

  play() {
    this.isPlaying = true;
    this.data.getAudioFromGDrive(this.audioItem.filename)
    .subscribe(
      (audioBuffer: ArrayBuffer) => {
        this.playAudio(audioBuffer);
      },
      (error: any) => {
        console.log(error);
      }
    );
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
