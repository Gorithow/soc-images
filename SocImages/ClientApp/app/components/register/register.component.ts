import { Component } from "@angular/core"

@Component({
    selector: "register",
    template: require("./register.component.html")
})

export class RegisterComponent {
    /*public register(): void {
        this.http.get("account/register", {
            "params": {
                "email": "test@test.test",
                "password": "zaqWSX123@"
            }
        }).subscribe(response => alert(response));
    }*/
}