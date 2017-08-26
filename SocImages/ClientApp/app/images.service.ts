import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Image } from "./image";

@Injectable()
export class ImagesService {
    constructor(private http: HttpClient) { }

    public getImagesCount(): Observable<number> {
        return this.http.get<number>("/images/getimagescount");
    }

    public getImages(skip: number, take: number, url: string): Observable<Array<Image>> {
        let params: HttpParams = new HttpParams().
            append("skip", skip.toString()).
            append("take", take.toString());

        return this.http.get<Array<Image>>(url, {
            params: params
        });
    }
}