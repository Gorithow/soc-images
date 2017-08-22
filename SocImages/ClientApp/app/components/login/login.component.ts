import { Component } from "@angular/core"

@Component({
    selector: "login",
    template: require("./login.component.html")
})

export class LoginComponent {
    /*login(): void {
        this.http.get("account/login", {
            "params": {
                "login": "test@test.test",
                "password": "zaqWSX123@"
            }
        }).subscribe(response => alert(response));
    }*/
}