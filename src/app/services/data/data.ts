import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from 'app/services/authentication';
import { WindowService } from 'app/services/window';

@Injectable()
export class DataService {
  private window: any;

  constructor(
    private authService: AuthenticationService,
    private httpClient: HttpClient,
    private windowService: WindowService) {
      this.window = this.windowService.native;
    }

  getOptions(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authService.accessToken
      })
    };
  }

  // Audio

  getAudioFromGDrive(fileId: string): Observable<any> {
    //fileId = "1bx7T7iZ4ME5FeC8jFpqoaCY6pH74oVkf";
    fileId = "1phwz6tKtUHr8xx8eafZF4tIcZWfHKss-";
    const url: string = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.accessToken
    })

    const options: any = { headers: headers, responseType: 'arraybuffer' };

    return this.httpClient.get(url, options)
    .catch((err: HttpErrorResponse) => {
      return Observable.throw(err);
    });
  }

  getImageFromGdrive(fileId: string) {
    fileId = "15TjB1yVVe0ny8H1AYAKgflTViTJxCBOc";
    const url: string = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.accessToken
    })

    const options: any = { headers: headers, responseType: 'arraybuffer' };

    return this.httpClient.get(url, options)
    .map((response: any) => {
      return new Blob([response], {type: 'image/jpeg'});
    })
    .catch((err: HttpErrorResponse | any) => {
      return Observable.throw(err);
    });
  }

  getAudioBefore(endDate: string): Observable<any> {
    let url: string = `/search/audio/before/${endDate}`;
    url = 'http://localhost:3000/audio';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
  }

  getAudioAfter(startDate: string): Observable<any> {
    let url: string = `/search/audio/after/${startDate}`;
    url = 'http://localhost:3000/audio';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
  }

  getAudioBetween(startDate: string, endDate: string): Observable<any> {
    let url: string = `/search/audio/between/${startDate}/${endDate}`;
    url = 'http://localhost:3000/audio';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
  }

  getAudioBeforeAt(geocode: any, endDate: string): Observable<any> {
    let url: string = `/search/audio/locationbefore/${geocode.lat}/${geocode.lng}/5/${endDate}`;
    url = 'http://localhost:3000/audio';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
    /*
    return Observable.create((observer: Observer<any>) => {
      observer.next([{
        "transcription": "hello there",
        "filename": "1AP6RG5N41MkmR-65XJVSvWpqJxfkv3K9d_Y7y8MJUhP-BZg0WQ",
        "createdtime": "2018-01-14T19:13:39.000Z",
        "endtime": "2018-01-14T19:13:39.000Z",
        "duration": "10",
        "format_name": "mpeg",
        "location" : {
            "type" : "Point",
            "coordinates" : [
                24.87612,
                60.279162
            ]
          }
      }])
    });
    */
  }

  getAudioAfterAt(geocode: any, startDate: string): Observable<any> {
    let url: string = `/search/audio/locationafter/${geocode.lat}/${geocode.lng}/5/${startDate}`;
    url = 'http://localhost:3000/audio';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
    /*
    return Observable.create((observer: Observer<any>) => {
      observer.next([{
        "transcription": "hello there",
        "filename": "1AP6RG5N41MkmR-65XJVSvWpqJxfkv3K9d_Y7y8MJUhP-BZg0WQ",
        "createdtime": "2018-01-14T19:13:39.000Z",
        "endtime": "2018-01-14T19:13:39.000Z",
        "duration": "10",
        "format_name": "mpeg",
        "location" : {
            "type" : "Point",
            "coordinates" : [
                24.87612,
                60.279162
            ]
          }
      }])
    });
    */
  }

  getAudioBetweenAt(geocode: any, startDate: string, endDate: string): Observable<any> {
    let url: string = `/search/audio/locationbetween/${geocode.lat}/${geocode.lng}/5/${startDate}/${endDate}`;
    url = 'http://localhost:3000/audio';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
    /*
    return Observable.create((observer: Observer<any>) => {
      observer.next([{
        "transcription": "hello there",
        "filename": "1AP6RG5N41MkmR-65XJVSvWpqJxfkv3K9d_Y7y8MJUhP-BZg0WQ",
        "createdtime": "2018-01-14T19:13:39.000Z",
        "endtime": "2018-01-14T19:13:39.000Z",
        "duration": "10",
        "format_name": "mpeg",
        "location" : {
            "type" : "Point",
            "coordinates" : [
                24.87612,
                60.279162
            ]
          }
      }])
    });
    */
  }

  getAudioAt(geocode: any): Observable<any> {
    let url: string = `/search/audio/location/${geocode.lat}/${geocode.lng}/5`;
    url = 'http://localhost:3000/audio';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
  }

  getAudioAt2(): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      observer.next([{
        "transcription": "hello there",
        "filename": "1AP6RG5N41MkmR-65XJVSvWpqJxfkv3K9d_Y7y8MJUhP-BZg0WQ",
        "createdtime": "2018-01-14T19:13:39.000Z",
        "endtime": "2018-01-14T19:13:39.000Z",
        "duration": "10",
        "format_name": "mpeg",
        "location" : {
            "type" : "Point",
            "coordinates" : [
                24.87612,
                60.279162
            ]
          }
      }])
    });
  }

  // Image

  getImageFromGDrive() {

  }

  getImageBefore(endDate: string): Observable<any> {
    let url: string = `/search/image/before/${endDate}`;
    url = 'http://localhost:3000/image';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
  }

  getImageAfter(startDate: string): Observable<any> {
    let url: string = `/search/image/after/${startDate}`;
    url = 'http://localhost:3000/image';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
  }

  getImageBetween(startDate: string, endDate: string): Observable<any> {
    let url: string = `/search/image/between/${startDate}/${endDate}`;
    url = 'http://localhost:3000/image';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
  }

  getImageBetween2(): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      observer.next([{
        "filename": "1Vnxdj-j3gKoIUOoHmpXBfs7pXUeIJEmmS6s7Bqpk4yIE4DbliA",
        "createdtime": "2018-01-14T19:13:39.000Z",
      }])
    });
  }

  getImageBeforeAt(geocode: any, endDate: string): Observable<any> {
    let url: string = `/search/image/locationbefore/${geocode.lat}/${geocode.lng}/5/${endDate}`;
    url = 'http://localhost:3000/image';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
    /*
    return Observable.create((observer: Observer<any>) => {
      observer.next([{
        "filename": "1Vnxdj-j3gKoIUOoHmpXBfs7pXUeIJEmmS6s7Bqpk4yIE4DbliA",
        "createdtime": "2018-01-14T19:13:39.000Z",
        "location" : {
          "type" : "Point",
          "coordinates" : [
              24.87612,
              60.279162
          ]
        }
      }])
    });
    */
  }

  getImageAfterAt(geocode: any, startDate: string): Observable<any> {
    let url: string = `/search/image/locationafter/${geocode.lat}/${geocode.lng}/5/${startDate}`;
    url = 'http://localhost:3000/image';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
    /*
    return Observable.create((observer: Observer<any>) => {
      observer.next([{
        "filename": "1Vnxdj-j3gKoIUOoHmpXBfs7pXUeIJEmmS6s7Bqpk4yIE4DbliA",
        "createdtime": "2018-01-14T19:13:39.000Z",
        "location" : {
          "type" : "Point",
          "coordinates" : [
              24.87612,
              60.279162
          ]
        }
      }])
    });
    */
  }

  getImageBetweenAt(geocode: any, startDate: string, endDate: string): Observable<any> {
    let url: string = `/search/image/locationbetween/${geocode.lat}/${geocode.lng}/5/${startDate}/${endDate}`;
    url = 'http://localhost:3000/image';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
    /*
    return Observable.create((observer: Observer<any>) => {
      observer.next([{
        "filename": "1Vnxdj-j3gKoIUOoHmpXBfs7pXUeIJEmmS6s7Bqpk4yIE4DbliA",
        "createdtime": "2018-01-14T19:13:39.000Z",
        "location" : {
          "type" : "Point",
          "coordinates" : [
              24.87612,
              60.279162
          ]
        }
      }])
    });
    */
  }

  getImageAt(geocode: any):Observable<any> {
    let url: string = `/search/image/location/${geocode.lat}/${geocode.lng}/5`;
    url = 'http://localhost:3000/image';
    return this.httpClient.get(url, this.getOptions())
    .catch((error: any) => Observable.throw(error));
  }

  getImageAt2(): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      observer.next([{
        "filename": "1Vnxdj-j3gKoIUOoHmpXBfs7pXUeIJEmmS6s7Bqpk4yIE4DbliA",
        "createdtime": "2018-01-14T19:13:39.000Z",
        "location" : {
          "type" : "Point",
          "coordinates" : [
              24.87612,
              60.279162
          ]
        }
      }])
    });
  }
}
