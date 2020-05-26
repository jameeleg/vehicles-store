import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { LoaderService } from './loader.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
	constructor(
		private http: HttpClient,
		private loader: LoaderService
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

	getManufacturers(term: string): Observable<{}[]>{
	    if (!term.trim()) {
	      // if not search term, return empty hero array.
	      term = '';
	    }

	    this.loader.startLoading();
		
		return this.http.get<{}[]>(
			`/api/allmanufacturers?term=${term}`,
			this.getHeaders(),
		)
		.pipe(
			map((result: any) => result.items),
			tap(result => {
				this.loader.stopLoading()	
			}),
			catchError(() => {console.log('search'); return of([]);})
		)

	}

	getMakeForManufacturer(manId: string, term: string): Observable<{}[]>{

		return this.http.get<{}[]>(
			`/api/makeformanufacturer/${manId}?term=${term}`,
			this.getHeaders(),
		)
		.pipe(
			map((result: any) => result.items),
			tap(result => {
			}),
			catchError(() => {console.log('search'); return of([]);})
		)

	}

	getModelsForMake(make: string, term: string): Observable<{}[]>{

		return this.http.get<{}[]>(
			`/api/getmodelsformake/${make}?term=${term}`,
			this.getHeaders(),
		)
		.pipe(
			map((result: any) => result.items),
			tap(result => {
			}),
			catchError(() => {console.log('search error'); return of([]);})
		)

	}

	signout() {
		localStorage.removeItem('access_token');
	}

	private getToken(): string {
		return localStorage.getItem('access_token');
	}

	public get loggedIn(): boolean {
		return (localStorage.getItem('access_token') !== null);
	}
}
