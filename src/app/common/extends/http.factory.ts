import {XHRBackend, Http, RequestOptions} from "@angular/http";
import {InterceptedHttp} from "./http.interceptor";
import {AutenticarService} from '../../service/autenticar.service';

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, autenticarService: AutenticarService): Http {
    return new InterceptedHttp(xhrBackend, requestOptions, autenticarService);
}