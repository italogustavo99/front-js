import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AutenticarService {

  private accessToken:string;

  constructor(private http: Http, private router: Router, private location: Location) {

  }

  public login(usuario: string, senha:string): Promise<void> {
    let headers = new Headers();
		headers.append('Authorization', 'Basic ' +  btoa('mv:mv$123'));
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
    let params : string = 'grant_type=password&username='+usuario+'&password='+senha;
    
		return this.http
		  .post('http://localhost:9999/uaa/oauth/token', params, { headers: headers })
      .toPromise()
      .then((res: Response) => {
				  let data = res.json();
					this.accessToken = data.access_token;
					localStorage.setItem('refresh_token', data.refresh_token);
					//this.location.back();
					this.router.navigate(['/account']);
			})
      .catch(this.handleError);
  }

  public getAccessToken(): string {
    return this.accessToken;
  }

  public getRefreshToken(): string {
    let refreshToken = localStorage.getItem('refresh_token');
    return refreshToken;
  }

	public isLoggedIn(): boolean {
		var token: String = this.getAccessToken();
		//return token && token.length > 0;
		return true;
	}
	
  public refreshAuthenticationToken(): Observable<any> {
		let refreshToken = this.getRefreshToken();
		let params : string = 'refresh_token=' + refreshToken + '&grant_type=refresh_token';
		let headers = new Headers();
		headers.append('Authorization', 'Basic ' +  btoa('mv:mv$123'));
		headers.append('Content-Type', 'application/x-www-form-urlencoded');

		return Observable.create(
			observer => {
				this.http.post('http://localhost:9999/uaa/oauth/token', params, {
						headers : headers
				})
				.map(res => res.json()).subscribe(
					(data) => {
						this.accessToken = data.access_token;
						observer.next(this.accessToken);
						observer.complete();
					},
					(error) => {
						if (error.status === 400 || error.status === 401) {
							 this.accessToken = '';
							 this.router.navigate(['/login']);
						}
					}
				);
			});
	}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

	public logout(): void {
		this.accessToken = null;
		localStorage.removeItem('refresh_token');
		this.router.navigate(['/login']);
  }
}