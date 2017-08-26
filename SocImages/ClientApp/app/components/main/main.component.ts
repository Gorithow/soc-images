import { Component, OnInit } from "@angular/core"
import { PageEvent } from "@angular/material";

import { Image } from "../../image";
import { ImagesService } from "../../images.service";

@Component({
    selector: "main",
    template: require("./main.component.html")
})

export class MainComponent implements OnInit {
    private numberOfImages: number = 0;
    private take: number = 10;
    private pageIndex: number = 0;

    private get skip(): number {
        return this.pageIndex * this.take;
    }

    private images: Array<Image>;

    private get imagesUrl(): string {
        let imagesEndpoint: string = "/images/";

        switch (this.selectedSort) {
            case undefined:
            case SortBy.Rate:
                return imagesEndpoint + "getbyuploaddate";
            case SortBy.UploadDate:
                return imagesEndpoint + "getbyrate";
        }
    }

    constructor(private imagesService: ImagesService) { }

    ngOnInit() {
        this.imagesService.getImagesCount().subscribe(count => {
            this.numberOfImages = count;
        });

        this.imagesService.getImages(this.skip, this.take, this.imagesUrl).subscribe(images => {
            this.images = images;
        })
    }

    private onPage(pageEvent: PageEvent) {
        this.pageIndex = pageEvent.pageIndex;
        this.take = pageEvent.pageSize;

        this.imagesService.getImages(this.skip, this.take, this.imagesUrl).subscribe(images => {
            this.images = images;

            window.scrollTo(0, 0);
        });
    }

    private selectedSort = SortBy.UploadDate;
    private readonly sortOptions: Array<{ label: string, value: SortBy }> = [
        { label: "Upload Date", value: SortBy.UploadDate },
        { label: "Rate", value: SortBy.Rate }
    ]
}

enum SortBy {
    UploadDate,
    Rate
}