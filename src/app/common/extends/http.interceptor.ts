import {Injectable} from "@angular/core";
import { ConnectionBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers} from "@angular/http";
import {Observable} from "rxjs/Rx";

import { AutenticarService } from '../../service/autenticar.service';

@Injectable()
export class InterceptedHttp extends Http {
	
    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private autenticarService: AutenticarService) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
		return super.request(url, options).catch(initialError => {
		  if (initialError.status === 401 || initialError.status === 403) {
			  
			    if (options == null) {
					options = new RequestOptions();
				}
				if (typeof url !== 'string') {
					options.headers = url.headers;
				}
			    
				return this.autenticarService.refreshAuthenticationToken().flatMap((newToken) => {
					this.setAuthorizationHeader(options.headers, newToken);
					return super.request(url, options);
				});
			} else {
				return Observable.throw(initialError);
			}
		});
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.get(url, this.getRequestOptionArgs(options));
						//.retryWhen(error => error.delay(500))
						//.timeoutWith(2000, Observable.throw(new Error('delay exceeded')));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.post(url, body, this.getRequestOptionArgs(options));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.put(url, body, this.getRequestOptionArgs(options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.delete(url, this.getRequestOptionArgs(options));
    }
	
    private getRequestOptionArgs(options?: RequestOptionsArgs) : RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }
        options.headers.set('Content-Type', 'application/json');
		
		let access_token = this.autenticarService.getAccessToken();
		if(access_token != null) {
			options.headers.set('Authorization', 'Bearer ' + access_token);
		}
		
        return options;
    }
	
	private setAuthorizationHeader(headers?: Headers, token?:string):void {
		if (headers == null) {
            headers = new Headers();
        }
        headers.set('Authorization','Bearer ' + token);
    }
}