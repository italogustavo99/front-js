import { Injectable } from '@angular/core';
import { Headers, Response, URLSearchParams, RequestOptions  } from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import 'rxjs/add/operator/toPromise';

import { ProcessingReportItem } from '../model/processingreportitem';

import { IPagedResults } from '../common/interface/paged.results';

import { InterceptedHttp } from "../common/extends/http.interceptor";

@Injectable()
export class ReportsService {

  constructor(private http: InterceptedHttp) {

  }
  
  private options = new RequestOptions({headers: new Headers({'Content-Type': 'application/json'})});
  private headers = new Headers({ 'Content-Type': 'application/json' });

  list(page: number = 0, pageSize: number = 0): Observable<IPagedResults<ProcessingReportItem[]>> {
	let params: URLSearchParams = new URLSearchParams();
	  const url: string = 'assets/json/ProcessingReportItem.json?page=' + page + '&size=' + pageSize;
    return this.http.get(url, this.options)
      .map((res: Response) => {
		   const totalRecords = +res.headers.get('x-total-count');
		   let data = res.json();
		   return {
			   results: data,
			   totalRecords: 4//data.totalElements
		   };
	   })
	   .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}