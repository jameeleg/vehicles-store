import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  	constructor(private snackBar: MatSnackBar) { }

	notify(message: string, action: string, success: boolean = true, duration: number = 4000) {
	    this.snackBar.open(message, action, {
	      duration,
	      panelClass: [success? 'success-snackbar': 'failed-snackbar']
	    });
  	}
}
