import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../auth.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: "login",
    template: require("./login.component.html"),
    styles: [require("./login.component.css")]
})

export class LoginComponent implements OnInit {
    private loginError: HttpErrorResponse;

    private loginForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService) {
        this.createForm();
    }

    private createForm() {
        this.loginForm = this.formBuilder.group({
            userName: this.formBuilder.control("", [Validators.required]),
            password: this.formBuilder.control("", [Validators.required])
        });
    }

    private onSubmit({ value, valid }: { value: { userName: string, password: string }, valid: string }) {
        this.authService.login(value.userName, value.password);
    }

    ngOnInit(): void {
        this.authService.logFailured.subscribe((error: HttpErrorResponse) => this.loginError = error);
        this.authService.logStatusChanged.subscribe(() => this.router.navigate([""]));
    }
}