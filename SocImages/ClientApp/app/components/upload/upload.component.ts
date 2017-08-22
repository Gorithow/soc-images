import { Component, ElementRef, ViewChild } from "@angular/core"
import { Http } from "@angular/http";

@Component({
    selector: "upload",
    template: require("./upload.component.html")
})

export class UploadComponent {
    @ViewChild("fileInput") fileInput: ElementRef;

    constructor(private http: Http) { }

    addFile(): void {
        let fi: HTMLInputElement = this.fileInput.nativeElement;
        if (fi.files && fi.files[0]) {
            let fileToUpload = fi.files[0];
            this.upload(fileToUpload)
                .subscribe(res => {
                    console.log(res);
                });
        }
    }


    upload(fileToUpload: any) {
        let input = new FormData();
        input.append("imageFile", fileToUpload);

        return this.http
            .post("/images/postimage", input);
    }
}