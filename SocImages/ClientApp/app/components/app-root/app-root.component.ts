import { Component, ViewEncapsulation } from "@angular/core"

@Component({
    selector: "app-root",
    template: require("./app-root.component.html"),
    styles: [require("./app-root.component.css")],
    encapsulation: ViewEncapsulation.None
})

export class AppRootComponent {
    private readonly logoUrl: string = "/logo.svg";

    private readonly navLinks: Array<NavLink> = [
        { path: "", label: "Main" },
        { path: "random", label: "Random" },
        { path: "upload", label: "Upload" },
        { path: "register", label: "Register" },
        { path: "login", label: "Login" }
    ]
}

interface NavLink
{
    path: string,
    label: string
}