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
    private readonly endpoint: string = "/api/Account";

    private _isLoggedIn: boolean = false;

    private get loginEndpoint(): string {
        return this.endpoint + "/Login";
    }

    private get logoutEndpoint(): string {
        return this.endpoint + "/Logout";
    }

    private get isAuthenticatedEndpoint(): string {
        return this.endpoint + "/IsAuthenticated";
    }

    constructor(
        private http: HttpClient,
        private router: Router) { }

    public logFailured: EventEmitter<any> = new EventEmitter();
    public logStatusChanged: EventEmitter<void> = new EventEmitter();

    public get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    public login(username: string, password: string): void {
        let params: HttpParams = new HttpParams().
            append("username", username).
            append("password", password);

        this.http.get<void>(this.loginEndpoint, { params: params }).
            subscribe(
            () => {
                this._isLoggedIn = true;
                this.logStatusChanged.next();
            },
            (error) => this.logFailured.next(error));
    }

    public logout(): void {
        this.http.post<void>(this.logoutEndpoint, {}).
            subscribe(() => {
                this._isLoggedIn = false;
                this.logStatusChanged.next();
            });
    }

    public syncWithServer(): void {
        this.http.get<boolean>(this.isAuthenticatedEndpoint).
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