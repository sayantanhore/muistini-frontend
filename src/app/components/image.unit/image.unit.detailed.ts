import {
  Component,
  Input,
  AfterContentInit,
  Inject,
  ViewChild,
  ElementRef,
  Renderer2 } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { WindowService } from 'app/services/window';
import { DataService } from 'app/services/data';

import * as moment from 'moment';

require('./_image.unit.detailed');

@Component({
  selector: 'image-unit-detailed',
  templateUrl: 'image.unit.detailed.html',
  animations: [
    trigger('imageState', [
      state('full', style({
        bottom: '*',
      })),
      state('up', style({
        bottom: '30%'
      })),
      transition('full => up', animate('200ms ease-in'))
    ])
  ]
})
export class ImageUnitDetailed implements AfterContentInit {
  private window: Window;
  private state: string = 'full';
  private currentImageItem: any;
  private currentImageSrc: string;
  private imageListItems: any[] = [];
  @ViewChild('imagePlaceholder')imagePlaceholder: ElementRef;
  @ViewChild('imageList')imageList: ElementRef;
  @ViewChild('btnPrevious', { read: ElementRef })btnPrevious: any;
  @ViewChild('btnNext', { read: ElementRef })btnNext: any;
  constructor(
    private data: DataService,
    private windowService: WindowService,
    private renderer: Renderer2,
    private dialogRef: MatDialogRef<ImageUnitDetailed>,
    @Inject(MAT_DIALOG_DATA) private dialogData: any) {
      this.window = this.windowService.native;
      this.currentImageItem = dialogData.imageItem;
    }

  close(event: MouseEvent) {
    this.dialogRef.close();
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

  getAdjacentImageItems(direction: string) {
    if (direction === 'previous') {
      this.data.getImageBefore(this.dialogData.imageItem.createdtime).subscribe((imageItems: any[]) => {
        this.imageListItems = imageItems;
      });
    }
    else {
      this.data.getImageAfter(this.dialogData.imageItem.createdtime).subscribe((imageItems: any[]) => {
        this.imageListItems = imageItems;
      });
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
      this.renderer.removeClass(this.imageList.nativeElement, 'hidden');
    }
    this.resetnavigationButtonStyling();
    this.renderer.addClass(this.btnPrevious.nativeElement, 'activated');
    this.getAdjacentImageItems('previous');
  }

  goToNext(event: MouseEvent) {
    if (this.state !== 'up') {
      this.state = 'up';
      this.renderer.removeClass(this.imageList.nativeElement, 'hidden');
    }
    this.resetnavigationButtonStyling();
    this.renderer.addClass(this.btnNext.nativeElement, 'activated');
    this.getAdjacentImageItems('next');
  }

  onStartAnimation(event: Event) {
  }

  onDoneAnimation(event: Event) {
  }

  getSelectedImage(imageSrc: string) {
    console.log(imageSrc);
    this.renderer.setAttribute(this.imagePlaceholder.nativeElement, 'src', imageSrc);
  }

  ngAfterContentInit() {
    if (this.currentImageItem) {
      this.data.getImageFromGdrive(this.currentImageItem.filename)
      .subscribe(
        (imageAsBlob: Blob) => {
          const imageSrc: any = this.window.URL.createObjectURL(imageAsBlob);
          this.currentImageSrc = imageSrc;
          this.renderer.setAttribute(this.imagePlaceholder.nativeElement, 'src', imageSrc);
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }
}
