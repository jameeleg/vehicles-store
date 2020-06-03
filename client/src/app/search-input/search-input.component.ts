import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

import { Observable, Subject, of } from 'rxjs';
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
export class SearchInputComponent<T> implements OnInit {

 	@Input() parentForm: FormGroup;
 	@Input() nameOfControl: string;
 	@Input() label: string;
 	@Input() loading: boolean = false;

	// renderer for option in the menu.
	@Input() renderOptionInInput: Function;

	// rendere selected option in the input.
	@Input() renderOptionInMenu: Function;

	// dataSource for getting suggestions in autocomplete
	@Input() dataSource: (term: string) => Observable<T>;
	@Output() onSelectOption: EventEmitter<MatAutocompleteSelectedEvent> = new EventEmitter();


	items$: Observable<T>;

	private searchTerms$ = new Subject<string>();

	constructor() { 
		this.onDataSource = this.onDataSource.bind(this);
	}

	// Push a search term into the observable stream.
	onInputChange(term: string): void {
		this.searchTerms$.next(term);
	}

	private initItems() {
    	this.items$ = this.searchTerms$.pipe(
	      // wait 300ms after each keystroke before considering the term
	      debounceTime(300),

	      // ignore new term if same as previous term
	      distinctUntilChanged(),

	      // switch to new search observable each time the term changes
	      switchMap((term: string) => this.onDataSource(term)),	
	    );
	}
	ngOnInit() {
		this.initItems();
	}

	onSelect(e: MatAutocompleteSelectedEvent){
		this.onSelectOption.emit(e);
		this.initItems();
	}

	onDataSource(term: string) {
		 return this.dataSource(term);
	}

	renderOptionInMenuFn(option: T){
		return this.renderOptionInMenu(option);
	}
}
