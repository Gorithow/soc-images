import { Component, OnInit } from "@angular/core"
import { PageEvent } from "@angular/material";

import { Image } from "../../image";
import { ImagesService } from "../../images.service";

@Component({
    selector: "not-approved",
    template: require("./not-approved.component.html"),
})

export class NotApprovedComponent implements OnInit {
    private readonly imagesUrl: string = "/api/Images/NotApproved";

    private numberOfImages: number = 0;
    private take: number = 10;
    private pageIndex: number = 0;

    private images: Array<Image>;

    private get skip(): number {
        return this.pageIndex * this.take;
    }

    private onPage(pageEvent: PageEvent) {
        this.pageIndex = pageEvent.pageIndex;
        this.take = pageEvent.pageSize;

        this.imagesService.get(this.skip, this.take, this.imagesUrl).subscribe(images => {
            this.images = images;

            window.scrollTo(0, 0);
        });
    }

    constructor(private imagesService: ImagesService) { }

    ngOnInit() {
        this.imagesService.notApprovedCount().subscribe(count => {
            this.numberOfImages = count;
        });

        this.imagesService.get(this.skip, this.take, this.imagesUrl).subscribe(images => {
            this.images = images;
        })
    }
}