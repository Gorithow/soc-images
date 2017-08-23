import { Component, Input } from "@angular/core"
import { Image } from "../../image";

@Component({
    selector: "image",
    template: require("./image.component.html"),
    styles: [require("./image.component.css")]
})

export class ImageComponent {
    @Input() private image: Image;

    private get url() {
        return `/images/getimage/?id=${this.image.imageId}`;
    }
}