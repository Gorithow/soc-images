import { Component, ElementRef, ViewChild } from "@angular/core"
import { Http } from "@angular/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { CaptchaComponent } from "../captcha/captcha.component";
import { ImagesService } from "../../images.service";
import { Router } from "@angular/router";

@Component({
    selector: "upload",
    template: require("./upload.component.html"),
    styles: [require("./upload.component.css")]
})

export class UploadComponent {
    private readonly maxFileSize: number = 1024 * 100; // 100kB

    @ViewChild("fileInput") private fileInput: ElementRef;
    @ViewChild(CaptchaComponent) private captcha: CaptchaComponent;

    private captchaResponse: string;
    private uploadError: HttpErrorResponse;

    private uploadForm: FormGroup;
    private uploadedFileName: string;

    private errorMessages: Array<string>;

    private get fileInputElement(): HTMLInputElement {
        return this.fileInput.nativeElement;
    }

    private get uploadedFile(): File | null {
        if (this.fileInputElement.files && this.fileInputElement.files[0]) {
            return this.fileInputElement.files[0];
        }

        return null;
    }

    private updateErrorMessage() {
        if (this.uploadError &&
            this.uploadError.error &&
            this.uploadError.error[""] &&
            this.uploadError.error[""].length > 0) {
            this.errorMessages = this.uploadError.error[""];
        } else {
            this.errorMessages = ["Internal error."];
        }
    }

    private fileSelected() {
        if (this.uploadedFile) {
            this.uploadForm.controls["file"].setValue("selected");
            this.uploadedFileName = this.uploadedFile.name;
        }
    }

    private createForm() {
        this.uploadForm = this.formBuilder.group({
            title: this.formBuilder.control("", [Validators.required]),
            file: this.formBuilder.control("", [Validators.required])
        });
    }

    private selectFile() {
        this.fileInputElement.click();
    }

    private onSubmit({ value, valid }: { value: { title: string }, valid: string }) {
        if (!this.captchaResponse) {
            this.errorMessages = ["Please solve the CAPTCHA."]
        } else if (!this.uploadedFile) {
            this.errorMessages = ["Please choose a file."]
        } else if (this.uploadedFile.size > this.maxFileSize) {
            this.errorMessages = [`The uploaded image exceeds maximum size of ${this.maxFileSize / 1024}kB.`]
        } else {
            this.imagesService.upload(this.uploadedFile, value.title, this.captchaResponse).
                subscribe(
                () => this.router.navigate([""]),
                (error: HttpErrorResponse) => {
                    this.uploadError = error;
                    this.updateErrorMessage();
                    this.captcha.reset();
                });
        }
    }

    private captchaResolved(captchaResponse: string) {
        this.captchaResponse = captchaResponse;
    }

    constructor(
        private http: Http,
        private formBuilder: FormBuilder,
        private imagesService: ImagesService,
        private router: Router) {
        this.createForm();
    }
}