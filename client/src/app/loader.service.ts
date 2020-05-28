import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loaders: {[name: string]: boolean} = {};

  constructor() {}

  addLoaders(names: Array<string>, value: boolean = false){
    for(let i = 0; i < names.length; i++){
      this.addLoader(names[i], value);
    }
  }
  addLoader(name: string, value: boolean = false){
    this.loaders[name] = value;
  }


  startLoading(name: string) {
  	this.loaders[name] = true;
  }

  stopLoading(name: string) {
  	this.loaders[name] = false;
  }

  isLoading(name: string) {
  	return this.loaders[name];
  }
}
