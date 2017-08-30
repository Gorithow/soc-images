import { Component, OnInit } from "@angular/core"
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../auth.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: "register",
    template: require("./register.component.html"),
    styles: [require("./register.component.css")]
})

export class RegisterComponent implements OnInit {
    private captchaResponse: string;

    private registerError: HttpErrorResponse;
    private registerForm: FormGroup;

    private errorMessages: Array<string>;

    private updateErrorMessage() {
        if (this.registerError &&
            this.registerError.error)
        {
            this.errorMessages = this.registerError.error[""];
        }
    }

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService) {
        this.createForm();
    }

    private createForm() {
        this.registerForm = this.formBuilder.group({
            userName: this.formBuilder.control('', [Validators.required]),
            password: this.formBuilder.control('', [Validators.required])
        });
    }

    private onSubmit({ value, valid }: { value: { userName: string, password: string }, valid: string }) {
        if (this.captchaResponse) {
            this.authService.register(value.userName, value.password);
        } else {
            this.errorMessages = ["Please solve the CAPTCHA."]
        }
    }

    private captchaResolved(captchaResponse: string) {
        this.captchaResponse = captchaResponse;
    }

    public ngOnInit(): void {
        this.authService.registerFailured.subscribe((error: HttpErrorResponse) => {
            this.registerError = error;
            this.updateErrorMessage();
        });
        this.authService.registerSuccessed.subscribe(() => this.router.navigate([""]));
    }
}