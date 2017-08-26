import { Injectable, EventEmitter } from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { HttpParams } from "@angular/common/http";

@Injectable()
export class AuthService {
    private _isLoggedIn: boolean = false;

    public logFailured: EventEmitter<any> = new EventEmitter();
    public logStatusChanged: EventEmitter<void> = new EventEmitter();

    constructor(
        private http: HttpClient,
        private router: Router) { }

    public get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    public logIn(username: string, password: string): void {
        let params: HttpParams = new HttpParams().
            append("username", username).
            append("password", password);

        this.http.get<void>("account/login", { params: params }).
            subscribe(
            () => {
                this._isLoggedIn = true;
                this.logStatusChanged.next();
            },
            (error) => this.logFailured.next(error));
    }

    public logOut(): void {
        this.http.post<void>("account/logout", {}).
            subscribe(() => {
                this._isLoggedIn = false;
                this.logStatusChanged.next();
            });
    }

    public syncWithServer(): void {
        this.http.get<boolean>("account/isAuthenticated").
            subscribe(isAuthenticated => {
                this._isLoggedIn = isAuthenticated;
                this.logStatusChanged.next();
            })
    }
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router) { }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isLoggedIn) {
            return true;
        }

        this.router.navigate(["login"]);
        return false;
    }
}