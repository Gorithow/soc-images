import { Component, OnInit } from "@angular/core"

import { Image } from "../../image";
import { ImagesService } from "../../images.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "single-image",
    template: require("./single-image.component.html"),
})

export class SingleImageComponent implements OnInit {
    private image: Image;

    constructor(
        private imagesService: ImagesService,
        private route: ActivatedRoute) { }

    private loadImage(id: number): void {
        this.imagesService.getSingle(id).subscribe(image => this.image = image);
    }

    public ngOnInit() {
        let id = Number(this.route.snapshot.paramMap.get('id'));

        if (id) {
            this.loadImage(id);
        }
    }
}