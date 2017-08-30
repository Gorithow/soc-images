import { Component, ViewEncapsulation, OnInit } from "@angular/core"
import { AuthService } from "../../auth.service";

@Component({
    selector: "app-root",
    template: require("./app-root.component.html"),
    styles: [require("./app-root.component.css")],
    encapsulation: ViewEncapsulation.None
})

export class AppRootComponent implements OnInit {
    private readonly logoUrl: string = "/logo.svg";

    private navLinks: Array<NavLink> = [];
    private readonly mainLink: NavLink = { path: "", label: "Main" };

    private readonly navLinksEveryone: Array<NavLink> = [
        { path: "random", label: "Random" }
    ]

    private readonly navLinksLogged: Array<NavLink> = [
        { path: "upload", label: "Upload" },
        { path: "logout", label: "Logout" }
    ]

    private readonly navLinksNotLogged: Array<NavLink> = [
        { path: "register", label: "Register" },
        { path: "login", label: "Login" }
    ]

    private get isLoggedIn(): boolean {
        return this.authService.isLoggedIn;
    }

    private updateNavLinks(): void {
        this.navLinks = this.navLinksEveryone.concat(this.isLoggedIn ? this.navLinksLogged : this.navLinksNotLogged);
    }

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.authService.logStatusChanged.subscribe(() => this.updateNavLinks());
        this.authService.syncWithServer();
    }

}

interface NavLink
{
    path: string,
    label: string
}