// System

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

// RXJS
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

// Angular Google Maps
import { AgmCoreModule } from '@agm/core';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// Components
import { PageHeader } from 'app/components/page.header';
import { PageFooter } from 'app/components/page.footer';
import { PageContent } from 'app/components/page.content';
import { Map } from 'app/components/map';
import { Blip } from 'app/components/blip';
import {
  AudioUnit,
  AudioUnitDetailed,
  AudioList,
  AudioProgress } from 'app/components/audio.unit';
import {
  ImageUnit,
  ImageUnitDetailed,
  ImageList } from 'app/components/image.unit';
import { Home } from 'app/components/home';
import { Login } from 'app/components/login';
import { AppComponent } from 'app/app.component';

// Services
import { MapService } from 'app/components/map';
import { ConfigService } from 'app/services/config';
import { WindowService } from 'app/services/window';
import { AuthenticationService } from 'app/services/authentication';
import { DataService } from 'app/services/data';
import { AudioService } from 'app/services/audio';
import { TimeService } from 'app/services/time';

interface Route {
  path: string;
  component: any;
}

const routes: Routes = [{
  path: '',
  component: Home
}, {
  path: 'login',
  component: Login
}];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC24h994ovkXsOOKhfPCaCaZByVLBCVPJc'
    }),
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [
    MapService,
    ConfigService,
    WindowService,
    DataService,
    AudioService,
    TimeService,
    AuthenticationService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ],
  declarations: [
    PageHeader,
    PageFooter,
    Map,
    Blip,
    AudioUnit,
    AudioUnitDetailed,
    AudioList,
    AudioProgress,
    ImageUnit,
    ImageUnitDetailed,
    ImageList,
    PageContent,
    Home,
    Login,
    AppComponent],
  entryComponents: [
    AudioUnitDetailed,
    ImageUnitDetailed],
  bootstrap: [AppComponent]
})

export class AppModule {}

