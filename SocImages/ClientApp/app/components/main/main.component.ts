import { Component, OnInit } from "@angular/core"
import { PageEvent } from "@angular/material";

import { Image } from "../../image";
import { ImagesService } from "../../images.service";

@Component({
    selector: "main",
    template: require("./main.component.html"),
    styles: [require("./main.component.css")]
})

export class MainComponent implements OnInit {
    private readonly sortOptions: Array<{ label: string, value: SortBy }> = [
        { label: "Upload Date", value: SortBy.UploadDate },
        { label: "Rate", value: SortBy.Rate }
    ]

    private numberOfImages: number = 0;
    private take: number = 10;
    private pageIndex: number = 0;

    private images: Array<Image>;

    private selectedSort: SortBy = SortBy.UploadDate;

    private get skip(): number {
        return this.pageIndex * this.take;
    }

    private get imagesUrl(): string {
        let imagesEndpoint: string = "/api/Images/";

        switch (this.selectedSort) {
            case undefined:
            case SortBy.Rate:
                return imagesEndpoint + "ByRate";
            case SortBy.UploadDate:
                return imagesEndpoint + "ByUploadDate";
        }
    }

    private onPage(pageEvent: PageEvent) {
        this.pageIndex = pageEvent.pageIndex;
        this.take = pageEvent.pageSize;

        this.imagesService.get(this.skip, this.take, this.imagesUrl).subscribe(images => {
            this.images = images;

            window.scrollTo(0, 0);
        });
    }

    private onSelect() {
        this.imagesService.get(this.skip, this.take, this.imagesUrl).subscribe(images => {
            this.images = images;
        })
    }

    constructor(private imagesService: ImagesService) { }

    ngOnInit() {
        this.imagesService.count().subscribe(count => {
            this.numberOfImages = count;
        });

        this.imagesService.get(this.skip, this.take, this.imagesUrl).subscribe(images => {
            this.images = images;
        })
    }
}

enum SortBy {
    UploadDate,
    Rate
}