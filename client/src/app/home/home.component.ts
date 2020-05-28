import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import {
	first,
	filter,
	map,
	startWith,
	debounceTime,
	distinctUntilChanged,
	switchMap,
} from 'rxjs/operators';


import { AuthService } from '../auth.service';
import { LoaderService } from '../loader.service';
import { NotificationsService } from '../notifications.service';
import {
	ManufacturerApiResult,
	MakeApiResult,
	ModelApiResult
} from '../types';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	// These will hold the selected options from autocomplete
	private selectedManfacturer;
	private selectedMake;
	private selectedModel;

	// group form
	parentForm: FormGroup;

	// We want to keep tracking the last search
	// in order to avoid unnecessary search
	lastManTerm: string = '';
	lastMakeTerm: string = '';
	lastModelTerm: string = '';


	// this will be a key for loading indicator for each input
	MAN_LOADER: string = 'ManufactureLoaderIndicator';
	MAKE_LOADER: string = 'MakeLoaderIndicator';
	MODEL_LOADER: string = 'ModelLoaderIndicator';

	constructor( 
		private auth: AuthService,
		private formBuilder: FormBuilder,
		private loader: LoaderService,
		private router: Router,
		private notifier: NotificationsService,
	 ) {
		this.getManufacturers = this.getManufacturers.bind(this);
		this.getMakeForManufacturer = this.getMakeForManufacturer.bind(this);
		this.getModelsForMake = this.getModelsForMake.bind(this);
	}

	ngOnInit() {
		// create loading indicator for each search input
		this.loader.addLoaders([this.MAN_LOADER, this.MAKE_LOADER, this.MODEL_LOADER]);
        
        // create group form with Validators
        this.parentForm = this.formBuilder.group({
            autoMan: ['', Validators.required],
            autoMake: ['', Validators.required],
            autoModel: ['', Validators.required],
        });

        // start with disabled inputs
        this.parentForm.get('autoMake').disable();
        this.parentForm.get('autoModel').disable();
	}

	displayManufacturer(option: ManufacturerApiResult): string {
		if(!option)
			return ''
		return option ? option.Mfr_CommonName : (option.Mfr_Name? option.Mfr_Name: '');
	}

	displayMake(option: MakeApiResult): string {
		return option ? option.Make_Name : '';
	}

	displayModel(option: ModelApiResult): string {
		return option ? option.Model_Name : '';
	}
	
	getManufacturers(term: string): Observable<ManufacturerApiResult[]> {
		if(term != this.lastManTerm){
			this.setInputStatuses(false,true,false,true);
		}
		this.selectedManfacturer = null;

		this.lastManTerm = term;
		return this.auth.getManufacturers(term, this.MAN_LOADER);
	}

	getMakeForManufacturer(term: string): Observable<MakeApiResult[]> {
		if(term != this.lastMakeTerm){
			this.setInputStatuses(true,false,false,true);
		}
		this.selectedMake = null;
		this.lastMakeTerm = term;
		return this.auth.getMakeForManufacturer(this.selectedManfacturer.Mfr_ID.toString(), term, this.MAKE_LOADER);
	}

	getModelsForMake(term: string): Observable<ModelApiResult[]> {
		this.selectedModel = null;
		return this.auth.getModelsForMake(this.selectedMake.Make_Name.toString(), term, this.MODEL_LOADER);
	}

	onSelectManufacturer({option} : any) {
		this.selectedManfacturer = option.value;
		this.lastManTerm = this.displayManufacturer(option.value);

		this.setInputStatuses(true,true,false,true);
	}
	
	onSelectMake({option} : any) {
		this.selectedMake = option.value;
		this.lastMakeTerm = this.displayMake(option.value);
		this.setInputStatuses(true,false,true,false);
	}

	onSelectModel({option} : any) {
		this.selectedModel = option.value;
	}
	
	onSubmit() {

	    this.auth.placeOrder(
	    	this.selectedManfacturer.Mfr_ID,
	    	this.selectedMake.Make_ID,
	    	this.selectedModel.Model_ID,
    	)
		.pipe(first())
		.subscribe(
			message => {
				this.initialState();
				this.notifier.notify(message, 'Dismiss')
			},
			err => this.notifier.notify(err.error, 'Dismiss', false)
		);
	}

	get f() { return this.parentForm.controls; }

	isLoading(loaderIndicator: string) {
		return this.loader.loaders[loaderIndicator] || false;
	}

	private initialState() {
		this.parentForm.reset();
		this.selectedManfacturer = null;
		this.selectedMake = null;
		this.selectedModel = null;
		this.setInputStatuses(false, true, false, true);
	}

	private setInputStatuses(
		makeEnable: boolean, makeReset: boolean,
		modelEnable: boolean, modelReset: boolean,
		)
	{
		if(makeEnable){
			this.parentForm.get('autoMake').enable();
		}
		else {
			this.parentForm.get('autoMake').disable();
		}
		if(makeReset){
			this.parentForm.get('autoMake').reset();	
		}

		if(modelEnable){
			this.parentForm.get('autoModel').enable();
		}
		else {
			this.parentForm.get('autoModel').disable();
		}
		if(modelReset){
			this.parentForm.get('autoModel').reset();	
		}
	}
	
	isDisabled() {
		const allSelected = this.selectedManfacturer && this.selectedMake && this.selectedModel;
		return !this.parentForm.valid || !allSelected;
	}

}
