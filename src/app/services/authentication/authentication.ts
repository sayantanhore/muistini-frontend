import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WindowService } from 'app/services/window';

@Injectable()
export class AuthenticationService {
  private window: any;
  private authParams: any;

  constructor(private windowService: WindowService) {
    this.window = this.windowService.native;
  }

  public get accessToken() {
    return this.authParams ?
    this.authParams.access_token :
    this.window.localStorage.getItem('access_token');
  }

  private setAuthParams(authParams: any) {
    this.authParams = authParams;
    this.window.localStorage.setItem('access_token', authParams.access_token);
  }

  private removeAuthParams() {
    this.authParams = null;
    this.window.localStorage.removeItem('access_token');
  }

  public googleSignIn(location: any) {
    //const locRegex: any = /https:\/\/(\d{1,4}\.){1,3}(\d{1,4})|localhost:\d{4}\//g;
    const locRegex: any = /https:\/\/localhost:\d{4}\//g;
    const redirectUrl: string = locRegex.exec(location)[0];
    const body: any = {
      client_id: '66485934056-teisd40k8fk61j7s3jh1upah0r335mm1.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/drive',
      redirect_uri: redirectUrl,
      response_type: 'token'
    };
    this.window.location.href =
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${body.client_id}&scope=${body.scope}&redirect_uri=${body.redirect_uri}&response_type=${body.response_type}`;
  }


  public extractAuthParams(location: any): Observable<any> {
    let loginParams: string[] = location.href.replace(/https:\/\/localhost:\d{4}\/#/g, '').split('&');
    let authParams = {};
    loginParams.forEach((param: any) => {
      const authParam: string[] = param.split('=');
      authParams[authParam[0]] = authParam[1];
    });
    this.setAuthParams(authParams);
    return Observable.create((observer: any) => observer.next(true));
  }
}
