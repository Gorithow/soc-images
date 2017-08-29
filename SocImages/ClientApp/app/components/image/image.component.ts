import { Component, Input } from "@angular/core"
import { Image } from "../../image";
import { AuthService } from "../../auth.service";
import { Router } from "@angular/router";
import { ImagesService } from "../../images.service";

@Component({
    selector: "image",
    template: require("./image.component.html"),
    styles: [require("./image.component.css")]
})

export class ImageComponent {
    @Input() private image: Image;

    private vote(value: 1 | -1): void {
        if (this.authService.isLoggedIn !== true) {
            this.router.navigate(["login"]);
        }

        this.imagesService.vote(this.image.imageId, value).subscribe(() => {
            this.image.rating += value;
        });
    }

    private get url() {
        return `/api/Images/${this.image.imageId}`;
    }

    constructor(
        private authService: AuthService,
        private router: Router,
        private imagesService: ImagesService) { }
}