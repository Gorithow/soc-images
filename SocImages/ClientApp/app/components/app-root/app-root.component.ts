import { Component } from '@angular/core'

@Component({
    selector: 'app-root',
    template: require('./app-root.component.html')
})

export class AppRootComponent {
    count: number = 0;
    message: string = "Hello World!";

    public clicked(): void {
        this.count++;
    }
}