import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
  public urls:any = {
    geoCode: 'https://maps.googleapis.com/maps/api/geocode',
  };

  public googleApiKey: string =
  'AIzaSyC24h994ovkXsOOKhfPCaCaZByVLBCVPJc';

}
