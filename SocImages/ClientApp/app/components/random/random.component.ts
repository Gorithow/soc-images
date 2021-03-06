﻿import { Component, OnInit } from "@angular/core"

import { Image } from "../../image";
import { ImagesService } from "../../images.service";

@Component({
    selector: "random",
    template: require("./random.component.html"),
    styles: [require("./random.component.css")]
})

export class RandomComponent implements OnInit {
    private image: Image;
    private readonly imagesUrl: string = "/Api/Images/ByUploadDate";

    constructor(private imagesService: ImagesService) { }

    private random(max: number): number {
        return Math.floor((Math.random() * max));
    }

    private randImage(): void {
        this.imagesService.count().subscribe(count => {
            this.imagesService.
                get(this.random(count), 1, this.imagesUrl).
                subscribe(images => this.image = images[0]);
        });
    }

    public ngOnInit() {
        this.randImage();
    }
}