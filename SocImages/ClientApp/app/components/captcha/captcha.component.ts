import { Component, EventEmitter, Output, Input, OnInit, ViewChild } from "@angular/core";
import { RecaptchaComponent } from "ng-recaptcha";

@Component({
    selector: "captcha",
    template: require("./captcha.component.html"),
}) export class CaptchaComponent {
    @ViewChild(RecaptchaComponent) private recaptcha: RecaptchaComponent;

    private readonly siteKey: string = "6LdIpC4UAAAAAPojMsBTDi3wOWd6u3lghTMuiuUz";

    @Output() private resolved: EventEmitter<string> = new EventEmitter();

    public emitResponse(captchaResponse: string) {
        this.resolved.next(captchaResponse);
    }

    public reset() {
        this.recaptcha.reset();
    }
}