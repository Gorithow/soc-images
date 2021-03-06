﻿import "zone.js";
import "reflect-metadata";

import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ServerModule } from "@angular/platform-server";
import { BrowserModule } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HttpModule } from "@angular/http";
import {
    MdPaginatorModule,
    MdTabsModule,
    MdSelectModule,
    MdCardModule,
    MdButtonModule,
    MdInputModule } from "@angular/material";
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { RecaptchaModule } from "ng-recaptcha";

import { AppRootComponent } from "./components/app-root/app-root.component";
import { MainComponent } from "./components/main/main.component";
import { RandomComponent } from "./components/random/random.component";
import { UploadComponent } from "./components/upload/upload.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { LogoutComponent } from "./components/logout/logout.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { ImageComponent } from "./components/image/image.component";
import { AuthService, AuthGuard } from "./auth.service";
import { ImagesService } from "./images.service";
import { CaptchaComponent } from "./components/captcha/captcha.component";
import { NotApprovedComponent } from "./components/not-approved/not-approved.component";
import { SingleImageComponent } from "./components/single-image/single-image.component";

const appRoutes: Routes = [
    { path: "", pathMatch: "full", component: MainComponent },
    { path: "not-approved", component: NotApprovedComponent },
    { path: "image/:id", component: SingleImageComponent },
    { path: "random", component: RandomComponent },
    { path: "upload", component: UploadComponent, canActivate: [AuthGuard] },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "logout", component: LogoutComponent },
    { path: "**", component: PageNotFoundComponent }
];


@NgModule({
    bootstrap: [AppRootComponent],
    declarations: [
        AppRootComponent,
        ImageComponent,
        LoginComponent,
        LogoutComponent,
        MainComponent,
        NotApprovedComponent,
        PageNotFoundComponent,
        RandomComponent,
        RegisterComponent,
        SingleImageComponent,
        UploadComponent,
        CaptchaComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        HttpModule,
        MdButtonModule,
        MdCardModule,
        MdInputModule,
        MdPaginatorModule,
        MdSelectModule,
        MdTabsModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RecaptchaModule.forRoot(),
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
        AuthService,
        AuthGuard,
        ImagesService
    ]
})

export class AppModule {
}