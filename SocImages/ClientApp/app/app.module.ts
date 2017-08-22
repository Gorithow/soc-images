﻿import "zone.js";
import "reflect-metadata";

import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ServerModule } from "@angular/platform-server";
import { BrowserModule } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HttpModule } from "@angular/http";
import { MdPaginatorModule, MdTabsModule, MdSelectModule } from "@angular/material";
import { RouterModule, Routes } from "@angular/router";

import { AppRootComponent } from "./components/app-root/app-root.component";
import { MainComponent } from "./components/main/main.component";
import { RandomComponent } from "./components/random/random.component";
import { UploadComponent } from "./components/upload/upload.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { LogoutComponent } from "./components/logout/logout.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";

const appRoutes: Routes = [
    { path: "", pathMatch: "full", component: MainComponent },
    { path: "random", component: RandomComponent },
    { path: "upload", component: UploadComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "logout", component: LogoutComponent },
    { path: "**", component: PageNotFoundComponent }
];


@NgModule({
    bootstrap: [AppRootComponent],
    declarations: [
        AppRootComponent,
        LoginComponent,
        LogoutComponent,
        MainComponent,
        PageNotFoundComponent,
        RandomComponent,
        RegisterComponent,
        UploadComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MdPaginatorModule,
        MdSelectModule,
        MdTabsModule,
        NoopAnimationsModule,
        RouterModule.forRoot(appRoutes, { enableTracing: true })
    ]
})

export class AppModule {
}