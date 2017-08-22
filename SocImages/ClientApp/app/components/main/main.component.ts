import { Component } from "@angular/core"

@Component({
    selector: "main",
    template: require("./main.component.html")
})

export class MainComponent {
    private selectedSort = SortBy.UploadDate;
    private readonly sortOptions: Array<{ label: string, value: SortBy }> = [
        { label: "Upload Date", value: SortBy.UploadDate },
        { label: "Rate", value: SortBy.Rate }
    ]
}

enum SortBy {
    UploadDate,
    Rate
}