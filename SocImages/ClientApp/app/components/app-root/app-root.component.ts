import { Component, ViewChild, ElementRef } from '@angular/core'

import { Http, RequestOptionsArgs } from '@angular/http';

@Component({
    selector: 'app-root',
    template: require('./app-root.component.html')
})

export class AppRootComponent {
    count: number = 0;
    message: string = "Hello World!";

    @ViewChild("fileInput") fileInput: ElementRef;

    constructor(private http: Http) {}

    public register(): void {
        this.http.get('account/register', {
            'params': {
                'email': 'test@test.test',
                'password': 'zaqWSX123@'
            }
        }).subscribe(response => alert(response));
    }

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

    login(): void {
        this.http.get('account/login', {
            'params': {
                'login': 'test@test.test',
                'password': 'zaqWSX123@'
            }
        }).subscribe(response => alert(response));
    }

    image(): void {
        this.http.get('/images/getimage', {
            'params': {
                'id': 1
            }
        }).subscribe(response => console.log(response));
    }

    upload(fileToUpload: any) {
        let input = new FormData();
        input.append("imageFile", fileToUpload);

        return this.http
            .post("/images/postimage", input);
    }
}