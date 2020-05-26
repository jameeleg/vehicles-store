import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import {
	filter,
	map,
	startWith,
	debounceTime,
	distinctUntilChanged,
	switchMap,
} from 'rxjs/operators';


@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

	// Define the placeholder text for the input
	@Input() placeHolderText: string = 'type here';

 	@Input() parentForm: FormGroup;
 	@Input() nameOfControl: string;
 	@Input() loading: boolean = false;

	// renderer for option in the menu.
	@Input() renderOptionInInput: Function;

	// rendere selected option in the input.
	@Input() renderOptionInMenu: Function;

	@Input() dataSource: Function;

	// @Output() dataSource: EventEmitter<string> = new EventEmitter<string>();
	@Output() onSelectOption: EventEmitter<any> = new EventEmitter();


	items$: Observable<{}>;

	private searchTerms$ = new Subject<string>();

	constructor() { 
		this.onDataSource = this.onDataSource.bind(this);
	}

	// Push a search term into the observable stream.
	onInputChange(term: string): void {
		this.searchTerms$.next(term);
	}

	ngOnInit() {
		console.log('===>', this.loading);
    	this.items$ = this.searchTerms$.pipe(
	      // wait 300ms after each keystroke before considering the term
	      debounceTime(300),

	      // ignore new term if same as previous term
	      distinctUntilChanged(),

	      // switch to new search observable each time the term changes
	      switchMap((term: string) => this.onDataSource(term)),	
	    );
	}

	onSelect(e: any){
		this.onSelectOption.emit(e);
	}

	onDataSource(term: string) {
		 return this.dataSource(term);
	}

	renderOptionInMenuFn(option: any){
		return this.renderOptionInMenu(option);
	}

	public isLoading(){
		return this.loading;
	}

}
