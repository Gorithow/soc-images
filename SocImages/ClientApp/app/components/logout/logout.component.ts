import { Component, OnInit } from "@angular/core"
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";

@Component({
    selector: "logout",
    template: require("./logout.component.html")
})

export class LogoutComponent implements OnInit {
    constructor(private authService: AuthService, private router: Router) { }

    public ngOnInit(): void {
        this.authService.logStatusChanged.subscribe(() => this.router.navigate(["login"]));
        this.authService.logout();
    }
}