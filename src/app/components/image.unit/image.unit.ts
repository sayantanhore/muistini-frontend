import {
  Component,
  Input,
  OnInit,
  AfterContentInit,
  HostListener,
  ViewChild,
  ElementRef,
  Renderer2 } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef } from '@angular/material';

import { MediaChange, ObservableMedia } from '@angular/flex-layout';

import * as moment from 'moment';

import { ImageUnitDetailed } from './image.unit.detailed';
import { DataService } from 'app/services/data';
import { WindowService } from 'app/services/window';
import { TimeService } from 'app/services/time';

require('./_image.unit.scss');

@Component({
  selector: 'image-unit',
  templateUrl: 'image.unit.html'
})
export class ImageUnit implements OnInit, AfterContentInit {
  @Input() private imageItem: any;
  @ViewChild('imagePlaceholder') imagePlaceholder: ElementRef;
  private window: any;
  private mediaWatcher: Subscription;
  private dialogDim: string;
  private dialogRef: MatDialogRef<ImageUnitDetailed>;

  @HostListener('click')handleClick(event: MouseEvent) {
    console.log('clicked');
    const dialogConfig: MatDialogConfig = {
      maxWidth: '100vw',
      disableClose: true,
      width: this.dialogDim === 'FULLSCREEN' ? '100vw' : '600px',
      height: this.dialogDim === 'FULLSCREEN' ? '100vh' : '90vh',
      data: { imageItem: this.imageItem }
    }
    this.dialogRef = this.dialog.open(ImageUnitDetailed, dialogConfig);
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

  constructor(
  private renderer: Renderer2,
  private windowService: WindowService,
  private media: ObservableMedia,
  private dataService: DataService,
  private timeService: TimeService,
  private dialog: MatDialog) {
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

  ngAfterContentInit() {
    console.log(this.imageItem)
    if (this.imageItem) {
      this.dataService.getImageFromGdrive(this.imageItem.filename)
      .subscribe(
        (imageAsBlob: Blob) => {
          const imageSrc: any = this.window.URL.createObjectURL(imageAsBlob);
          this.renderer.setAttribute(this.imagePlaceholder.nativeElement, 'src', imageSrc);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }
}
