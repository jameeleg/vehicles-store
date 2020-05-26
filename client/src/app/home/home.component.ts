import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';

import {
	filter,
	map,
	startWith,
	debounceTime,
	distinctUntilChanged,
	switchMap,
} from 'rxjs/operators';


import { AuthService } from '../auth.service';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	private manfacturer;
	private make;
	private model;

	parentForm: FormGroup;
	lastManTerm: string = '';
	lastMakeTerm: string = '';
	lastModelTerm: string = '';
	loading: boolean = false;

	constructor( 
		private auth: AuthService,
		private formBuilder: FormBuilder,
		private loader: LoaderService,
	 ) {
		this.getManufacturers = this.getManufacturers.bind(this);
		this.getMakeForManufacturer = this.getMakeForManufacturer.bind(this);
		this.getModelsForMake = this.getModelsForMake.bind(this);
	}

	ngOnInit() {
		// this.loading = this.loader.isLoading();
        this.parentForm = this.formBuilder.group({
            autoMan: [{value: "", disabled: false}, [Validators.required]],
            autoMake: [{value: "", disabled: true}, [Validators.required]],
            autoModel: [{value: "", disabled: true}, [Validators.required]]
        });
	}

	displayManufacturer(option: any): string {
		if(!option){
			return '';
		}

		return option ? option.Mfr_CommonName : (option.Mfr_Name? option.Mfr_Name: option);
	}

	displayMake(option: any): string {
		return option ? option.Make_Name : option;
	}

	displayModel(option: any): string {
		return option ? option.Model_Name : '';
	}
	
	getManufacturers(term: string): Observable<{}> {
		if(term != this.lastManTerm){
			this.parentForm.get('autoMake').reset();
			this.parentForm.get('autoMake').disable();
			this.parentForm.get('autoModel').reset();
			this.parentForm.get('autoModel').disable();
		}
		this.lastManTerm = term;
		return this.auth.getManufacturers(term);
	}

	getMakeForManufacturer(term: string): Observable<{}> {
		if(term != this.lastMakeTerm){
			this.parentForm.get('autoModel').reset();
			this.parentForm.get('autoModel').disable();
		}
		this.lastMakeTerm = term;
		return this.auth.getMakeForManufacturer(this.manfacturer.Mfr_ID.toString(), term);
	}

	getModelsForMake(term: string): Observable<{}> {
		return this.auth.getModelsForMake(this.make.Make_Name.toString(), term);
	}

	onSelectManufacturer({option} : any) {
		this.manfacturer = option.value;
		this.parentForm.get('autoMake').enable();
		this.lastManTerm = this.displayManufacturer(option.value);

		if(!this.manfacturer){
			this.manfacturer = option.value;
			this.lastManTerm = this.displayManufacturer(option.value);
			this.parentForm.get('autoMake').enable();
			this.parentForm.get('autoModel').enable();
			return;
		}

		if(this.manfacturer.Mfr_ID == option.value.Mfr_ID){
			return;
		}

		this.parentForm.get('autoMake').reset();
		this.parentForm.get('autoModel').reset();
	}
	
	onSelectMake({option} : any) {
		if(!this.make){
			this.make = option.value;
			this.lastMakeTerm = this.displayMake(option.value);
			this.parentForm.get('autoModel').enable();
			return;
		}

		if(this.make.Make_ID == option.value.Make_ID){
			return;
		}

		this.parentForm.get('autoModel').reset();
	}

	onSelectModel({option} : any) {
		this.model = option.value;
	}
	isLoading(){
		return 
	}
}
