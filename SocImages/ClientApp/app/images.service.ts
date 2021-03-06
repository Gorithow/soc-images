﻿import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Image } from "./image";

import "rxjs/add/operator/map";

@Injectable()
export class ImagesService {
    private readonly endpoint: string = "/api/Images";

    private get countEndpoint(): string {
        return this.endpoint + "/Count";
    }

    private get notApprovedCountEndpoint(): string {
        return this.endpoint + "/NotApprovedCount";
    }

    private get uploadEndpoint(): string {
        return this.endpoint;
    }

    private getSingleEndpoint(imageId: number): string {
        return `${this.endpoint}/${imageId}/Data`;
    }

    private getVoteEndpoint(imageId: number, value: 1 | -1): string {
        return `${this.endpoint}/${imageId}/${value === 1 ? "VoteUp" : "VoteDown"}`;
    }

    constructor(private http: HttpClient) { }

    public count(): Observable<number> {
        return this.http.get<number>(this.countEndpoint);
    }

    public notApprovedCount(): Observable<number> {
        return this.http.get<number>(this.notApprovedCountEndpoint);
    }

    public get(skip: number, take: number, url: string): Observable<Array<Image>> {
        let params: HttpParams = new HttpParams().
            append("skip", skip.toString()).
            append("take", take.toString());

        return this.http.get<Array<Image>>(url, {
            params: params
        }).map(images =>
            images.map(image => {
                image.userVote = 0;
                return image;
            }));
    }

    public getSingle(imageId: number): Observable<Image> {
        let url: string = this.getSingleEndpoint(imageId);

        return this.http.get<Image>(url).map(image => {
            image.userVote = 0;
            return image;
        });
    }

    public vote(imageId: number, value: 1 | -1): Observable<void> {
        return this.http.post<void>(this.getVoteEndpoint(imageId, value), {});
    }

    public upload(imageFile: File, title: string, captchaResponse: string): Observable<void> {
        let input = new FormData();
        input.append("imageFile", imageFile);
        input.append("captchaResponse", captchaResponse);

        return this.http
            .post<void>(this.uploadEndpoint + "/" + title, input);
    }
}