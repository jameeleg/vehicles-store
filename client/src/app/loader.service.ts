import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loading : boolean = false;
  constructor() { }

  startLoading() {
  	this.loading = true;
  }

  stopLoading() {
  	this.loading = true;
  }

  isLoading() {
  	return this.loading;
  }
}
