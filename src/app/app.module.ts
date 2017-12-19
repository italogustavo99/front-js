import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { OperatorsComponent } from './component/operators/operators.component';
import { ReportsComponent } from './component/reports/reports.component';

import { OperatorsService } from './service/operators.service';
import { ReportsService } from './service/reports.service';
import { AutenticarService } from './service/autenticar.service';

import { PaginationComponent } from './common/component/pagination.component';

import {InterceptedHttp} from "./common/extends/http.interceptor";

import { httpFactory } from "./common/extends/http.factory";

import { routing } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    OperatorsComponent,
    ReportsComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    routing
  ],
  providers: [OperatorsService, ReportsService, AutenticarService,
    {
      provide: InterceptedHttp,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, AutenticarService]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
