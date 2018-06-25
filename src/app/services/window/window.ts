import { Injectable } from '@angular/core';

@Injectable()
export class WindowService {
  get native(): any {
    return window;
  }
}
