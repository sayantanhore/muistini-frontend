import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WindowService } from 'app/services/window';
import { AuthenticationService } from 'app/services/authentication';
import { DataService } from 'app/services/data';
import { Observable } from 'rxjs/Observable';

require('./_home');

interface Geocode {
  [key: string]: number
  lat: number;
  lng: number;
}

@Component({
  selector: 'home',
  templateUrl: 'home.html'
})

export class Home implements OnInit {
  private window: any;
  private geocode: Geocode | null;
  private startDate: any | null;
  private endDate: any | null;

  private audioList: any[];
  private imageList: any[];

  constructor(
    private windowService: WindowService,
    private authService: AuthenticationService,
    private dataService: DataService,
    private router: Router) {
    this.window = windowService.native;
  }

  search() {
    console.log(this.geocode);
    // this.dataService.search(this.geocode, this.startDate, this.endDate);
    if (this.geocode && this.startDate && this.endDate) {
      this.populateLists(this.dataService.getAudioBetweenAt(this.geocode, this.startDate, this.endDate), this.dataService.getImageBetweenAt(this.geocode, this.startDate, this.endDate));
    }
    else if (this.geocode && this.startDate && !this.endDate) {
      this.populateLists(this.dataService.getAudioAfterAt(this.geocode, this.startDate), this.dataService.getImageAfterAt(this.geocode, this.startDate));
    }
    else if (this.geocode && !this.startDate && this.endDate) {
      this.populateLists(this.dataService.getAudioBeforeAt(this.geocode, this.endDate), this.dataService.getImageBeforeAt(this.geocode, this.endDate));
    }
    else if (this.geocode && !this.startDate && !this.endDate) {
      this.populateLists(this.dataService.getAudioAt(this.geocode), this.dataService.getImageAt(this.geocode));
    }
    else if (!this.geocode && this.startDate && this.endDate) {
      this.populateLists(this.dataService.getAudioBetween(this.startDate, this.endDate), this.dataService.getImageBetween(this.startDate, this.endDate));
    }
    else if (!this.geocode && this.startDate && !this.endDate) {
      this.populateLists(this.dataService.getAudioAfter(this.startDate), this.dataService.getImageAfter(this.startDate));
    }
    else if (!this.geocode && !this.startDate && this.endDate) {
      this.populateLists(this.dataService.getAudioBefore(this.endDate), this.dataService.getImageBefore(this.endDate));
    }
  }

  private populateLists(audioAsync: Observable<any[]>, imageAsync: Observable<any[]>) {
    audioAsync.subscribe((val: any[]) => {
      this.audioList = val;
    });

    imageAsync.subscribe((val: any[]) => {
      this.imageList = val;
    });
  }

  onMapEnter(geocode: any) { // Need to change any -> Geocode
    this.geocode = geocode;
    this.search();
  }

  onStartDateEnter(startDate: any) { // Need to change any -> moment
    this.startDate = startDate.toISOString();
    this.search();
  }

  onEndDateEnter(endDate: any) { // Need to change any -> moment
    this.endDate = endDate.toISOString();
    this.search();
  }

  ngOnInit() {
    if (this.window.location.href.indexOf('access_token') > 0) {
      this.authService.extractAuthParams(this.window.location)
      .subscribe((authSucceeded: boolean) => {
        if (authSucceeded) {

        }
      })
    }

    if (!this.window.localStorage.getItem('access_token')) {
      this.router.navigateByUrl('/login');
    }
  }
}
