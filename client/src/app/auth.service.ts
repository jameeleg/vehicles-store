import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { LoaderService } from './loader.service';

import {
	Response,
	ManufacturerApiResult,
	MakeApiResult,
	ModelApiResult,
} from './types';

import { NotificationsService } from './notifications.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
	constructor(
		private http: HttpClient,
		private loader: LoaderService,
		private notifier: NotificationsService,
	) { }

	private getHeaders(){

		const headerSettings = {

			'Content-Type': 'application/json',
			'Authorization': `Bearer ${this.getToken()}`
		}

		return  {
	    	headers: new HttpHeaders(headerSettings)
	  	};
	}		

	login(email: string, password: string): Observable<boolean> {
		return this.http.post<{token: string}>('/api/auth', {email, password})
			.pipe(
				map(result => {

					localStorage.setItem('access_token', result.token);
					return true;
				}
			)
		);
	}

	signup(
		firstName: string,
		lastName: string,
		email: string, 
		password: string,
	): Observable<boolean> {

		return this.http.post<{token: string}>(
			'/api/signup', 
			{firstName, lastName, email, password}
		)
		.pipe(
			map(result => {
				localStorage.setItem('access_token', result.token);
				return true;
			})
		);
	}

	placeOrder(
		manId: string,
		makeId: string,
		modelId: string, 
	): Observable<string> {
		return this.http.post<Response<string>>(
			'/api/placeorder', 
			{manId, makeId, modelId},
			this.getHeaders(),
		)
		.pipe(
			map(result => {
				return result.message;
			})
		);
	}
	getManufacturers(term: string, loader: string): Observable<Array<ManufacturerApiResult>>{
	    if (!term.trim()) {
	      term = '';
	    }

	    // start loading
	    this.loader.startLoading(loader);
		
		return this.http.get<Response<Array<ManufacturerApiResult>>>(
			`/api/allmanufacturers?term=${term}`,
			this.getHeaders(),
		)
		.pipe(
			map(result => {
				return result.items
			}),
			tap(result => {
				// stop loading
				this.loader.stopLoading(loader);
			}),
			catchError((err: HttpErrorResponse) => this.handlerError(err, loader))
		)

	}

	getMakeForManufacturer(manId: string, term: string, loader: string): Observable<Array<MakeApiResult>>{
	    
	    // start loading
	    this.loader.startLoading(loader);
		
		return this.http.get<Response<Array<MakeApiResult>>>(
			`/api/makeformanufacturer/${manId}?term=${term}`,
			this.getHeaders(),
		)
		.pipe(
			map(result => result.items),
			tap(result => {
				// stop loading
				this.loader.stopLoading(loader);
			}),
			catchError((err: HttpErrorResponse) => this.handlerError(err, loader))
		)

	}

	getModelsForMake(make: string, term: string, loader): Observable<Array<ModelApiResult>>{
	    // start loading
	    this.loader.startLoading(loader);
		
		return this.http.get<Response<Array<ModelApiResult>>>(
			`/api/getmodelsformake/${make}?term=${term}`,
			this.getHeaders(),
		)
		.pipe(
			map(result => result.items),
			tap(result => {
				// stop loading
				this.loader.stopLoading(loader);
			}),
			catchError((err: HttpErrorResponse) => this.handlerError(err, loader))
		)

	}

	logout() {
		// Make request to the server for logout
		// TODO(Jameel) - Add http request to /api/logout


		// then remove the token from localStorage
		localStorage.removeItem('access_token');
	}

	private getToken(): string {
		return localStorage.getItem('access_token');
	}

	private handlerError(err: HttpErrorResponse, loader: string) {
		this.loader.stopLoading(loader);
		const errMsg = err.error.error[0].Message;
		this.notifier.notify(errMsg, 'Dismiss', false)
		return of([]);
	}

	public get loggedIn(): boolean {
		return (localStorage.getItem('access_token') !== null);
	}
}
