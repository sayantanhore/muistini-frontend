import { Injectable } from '@angular/core';
import { ConfigService } from 'app/services/config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MapService {
  constructor(
    private config: ConfigService,
    private http: HttpClient) {}

  getGeocodesFromAddress(address: string): Observable<any> {
    const format: string = 'json';
    const url: string = `${this.config.urls.geoCode}/${format}`;

    let formattedAddress: string = address.split(' ').join('+').toString();

    let params: HttpParams = new HttpParams();
    params = params.set('address', formattedAddress).set('key', this.config.googleApiKey);

    return this.http.get(url, { params })
      .map((res: any) => {
        /*
        if (res.status === 'ZERO_RESULTS') {
          return 'Not a valid address';
        }
        else {
          const coordinates: any = res.results[0].geometry.location;
          return {lat: coordinates.lat, lng: coordinates.lng};
        }
        */
        try {
          const coordinates: any = res.results[0].geometry.location;
          return {lat: coordinates.lat, lng: coordinates.lng};
        }
        catch(err) {
          if (res.status === 'ZERO_RESULTS') {
            return 'Not a valid address';
          }
        }
        finally {
          //return 'Not a valid address';
        }
      })
      .catch((error: Response) => Observable.throw(error));
  }

  getAddressFromGeocode(geocode: any): Observable<any> {
    const format: string = 'json';
    const url: string = `${this.config.urls.geoCode}/${format}`;

    let params: HttpParams = new HttpParams();
    params = params.set('latlng', `${geocode.lat},${geocode.lng}`);
    params = params.set('key', this.config.googleApiKey);

    return this.http.get(url, { params });
  }
}
