import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: "captcha",
    template: require("./captcha.component.html"),
}) export class CaptchaComponent {
    private readonly siteKey: string = "6LdIpC4UAAAAAPojMsBTDi3wOWd6u3lghTMuiuUz";

    @Output() private resolved: EventEmitter<string> = new EventEmitter();

    emitResponse(captchaResponse: string) {
        this.resolved.next(captchaResponse);
    }
}