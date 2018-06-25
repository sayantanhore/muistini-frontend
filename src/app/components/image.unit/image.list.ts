import {
  Component,
  Input,
  Renderer2,
  ElementRef,
  ViewChildren,
  QueryList,
  OnChanges,
  Output,
  EventEmitter} from '@angular/core';

import { DataService } from 'app/services/data';
import { WindowService } from 'app/services/window';

require('./_image.list');

@Component({
  selector: 'image-list',
  templateUrl: 'image.list.html'
})
export class ImageList implements OnChanges {
  @Input()items: any[];
  private imgSrcs: any = {};
  @Output()selectedImage: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren('image')images: QueryList<ElementRef>;
  private window: any;

  constructor(
  private renderer: Renderer2,
  private data: DataService,
  private windowService: WindowService) {
    this.window = this.windowService.native;
  }

  selectImage(event: MouseEvent, index: number) {
    if (this.imgSrcs[index]) {
      this.selectedImage.emit(this.imgSrcs[index]);
    }
  }

  ngOnChanges(change: any) {
    console.log(change.items.currentValue)
    this.items.forEach((imageItem: any, index: number) => {
      this.data.getImageFromGdrive(imageItem.filename)
      .subscribe(
        (imageAsBlob: Blob) => {
          const imageSrc: any = this.window.URL.createObjectURL(imageAsBlob);
          this.renderer.setAttribute(this.images.toArray()[index].nativeElement, 'src', imageSrc);
          this.imgSrcs[index] = imageSrc;
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
  }
}
