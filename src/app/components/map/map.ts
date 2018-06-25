import {
  Component,
  HostListener,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  Input } from '@angular/core';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MapService } from './map.service';

require('./_map');

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})

export class Map {
  private isMapOpen: boolean = false;
  @Input() lat: number;
  @Input() lng: number;
  @ViewChild('inputLocation') inputLocation: any;

  @Output() enter: EventEmitter<any> = new EventEmitter<any>();
  public invalidAddress: boolean;
  private mapFormGroup: FormGroup;

  constructor(
    private element: ElementRef,
    private mapService: MapService,
    private fb: FormBuilder) {
      this.mapFormGroup = fb.group({
        'address': ['', this.validateAddress]
      });
    }

  @HostListener('document:click', ['$event'])
  handleClick(event: any) {
    if (this.element.nativeElement.contains(event.target)) {
      this.isMapOpen = true;
      this.getAddress();
    }
    else {
      this.isMapOpen = false;
    }
  }

  validateAddress = (formCtrl: FormControl): { [error: string]: boolean } | null => {
    if (this.invalidAddress) {
      return { error: true };
    }
    else {
      return null;
    }
  }

  getAddress() {
    const lat: number = this.lat;
    const lng: number = this.lng;

    this.mapService.getAddressFromGeocode({ lat, lng })
    .subscribe((address: any) => {
      this.mapFormGroup.controls['address'].setValue(address.results[0].formatted_address);
    });
  }

  getGeocode(address: string) {
    this.mapService.getGeocodesFromAddress(address)
    .subscribe((res: any | string) => {
      if (res === 'Not a valid address') {
        console.log('Not a valid address');
        this.invalidAddress = true;
      }
      else {
        this.lat = res.lat;
        this.lng = res.lng;
        this.invalidAddress = false;
      }

    }, (error: any) => {
      console.log(error)
    });
  }

  retrieveAddress(event: any) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.getAddress();
  }

  retrieveGeocode($event: any) {
    const address: string = this.mapFormGroup.controls['address'].value;
    if (address.length > 0) {
      this.getGeocode(address);
    }
  }

  selectText(event: any) {
    if (event.target.value.length > 0) {
      event.target.select();
    }
  }

  handleKeyPress(event: KeyboardEvent) {
    if ((event.keyCode === 13) && (this.mapFormGroup.valid)) {
      this.enter.emit({ lat: this.lat, lng: this.lng })
    }
  }
}
