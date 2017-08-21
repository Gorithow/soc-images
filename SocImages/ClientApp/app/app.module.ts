import "zone.js";
import "reflect-metadata";

import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ServerModule } from "@angular/platform-server";
import { BrowserModule } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HttpModule } from "@angular/http";
import { MdPaginatorModule, MdTabsModule, MdSelectModule } from "@angular/material";

import { AppRootComponent } from "./components/app-root/app-root.component";

@NgModule({
    bootstrap: [AppRootComponent],
    declarations: [
        AppRootComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MdPaginatorModule,
        MdSelectModule,
        MdTabsModule,
        NoopAnimationsModule
    ]
})

export class AppModule {
}