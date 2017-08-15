import 'zone.js';
import 'reflect-metadata';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServerModule } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { AppRootComponent } from './components/app-root/app-root.component';

@NgModule({
    bootstrap: [AppRootComponent],
    declarations: [
        AppRootComponent,
    ],
    imports: [
        FormsModule,
        BrowserModule,
        NoopAnimationsModule,
        HttpModule
    ]
})

export class AppModule {
}