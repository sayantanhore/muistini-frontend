import { Component } from '@angular/core';
require('./_app');

@Component({
  selector: 'app',
  template: `
    <router-outlet></router-outlet>
  `
})

export class AppComponent {}
