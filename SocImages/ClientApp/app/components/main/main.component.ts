import { Component, OnInit } from "@angular/core"
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { HttpParams } from "@angular/common/http";
import { PageEvent } from "@angular/material";

import { Image } from "../../image";

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

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.getImagesCount().subscribe(count => {
            this.numberOfImages = count;
        });

        this.getImages(this.skip, this.take).subscribe(images => {
            this.images = images;
        })
    }

    private getImagesCount(): Observable<number> {
        return this.http.get<number>("/images/getimagescount");
    }

    private getImages(skip: number, take: number): Observable<Array<Image>> {
        let params: HttpParams = new HttpParams().
            append("skip", skip.toString()).
            append("take", take.toString());

        return this.http.get<Array<Image>>(this.imagesUrl, {
            params: params
        });
    }

    private onPage(pageEvent: PageEvent) {
        this.pageIndex = pageEvent.pageIndex;
        this.take = pageEvent.pageSize;

        this.getImages(this.skip, this.take).subscribe(images => {
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