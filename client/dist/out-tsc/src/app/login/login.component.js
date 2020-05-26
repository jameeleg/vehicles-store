import { __decorate } from "tslib";
import { Component } from '@angular/core';
let LoginComponent = /** @class */ (() => {
    let LoginComponent = class LoginComponent {
        constructor() {
            this.user = {
                email: '',
                password: '',
            };
        }
        ngOnInit() {
        }
        login() {
            this.user.email = '';
            this.user.password = '';
            // send credentials to server!
        }
    };
    LoginComponent = __decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss']
        })
    ], LoginComponent);
    return LoginComponent;
})();
export { LoginComponent };
//# sourceMappingURL=login.component.js.map