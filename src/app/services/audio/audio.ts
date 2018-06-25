import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { WindowService } from 'app/services/window';

@Injectable()
export class AudioService {
  private window: any;
  public nowPlaying: Subject<any> = new Subject<any>();
  private _audioContext: any;

  constructor(private windowService: WindowService) {
    this.window = windowService.native;
    const context: any = this.window.AudioContext || this.window.webkitAudioContext;
    this._audioContext = new context();
  }

  get audioContext(): any {
    return this._audioContext;
  }
}
