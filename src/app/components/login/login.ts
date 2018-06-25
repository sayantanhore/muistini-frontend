import { Component } from '@angular/core';
import { WindowService } from 'app/services/window';
import { AuthenticationService } from 'app/services/authentication';

require('./_login');

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})

export class Login {
  private window: any;

  constructor(
    private windowService: WindowService,
    private authService: AuthenticationService) {
    this.window = this.windowService.native;
  }

  private login(event: MouseEvent) {
    this.authService.googleSignIn(this.window.location);
  }
}
