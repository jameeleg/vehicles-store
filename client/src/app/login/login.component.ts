import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthService } from '../auth.service';
import { NotificationsService } from '../notifications.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    error: any;

    constructor(
    	private formBuilder: FormBuilder,
    	private auth: AuthService,
    	private router: Router,
        private notifier: NotificationsService,
	) {}

    /*
    * loging handler
    */
	public onSubmit() {
	    this.auth.login(this.form.value.email, this.form.value.password)
			.pipe(first())
			.subscribe(
				result => this.router.navigate(['home']),
				err => this.notifier.notify(err.error, 'Dismiss', false)
			);
	}

    ngOnInit() {
        this.form = this.formBuilder.group({
            "email": ["", [Validators.required, Validators.email]],
            "password":["", Validators.required],
        });
    }

}
