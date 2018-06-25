import './pollyfills.ts';
import './vendor.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'app/app.module';

require('./_index');

platformBrowserDynamic().bootstrapModule(AppModule);
