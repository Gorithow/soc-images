/*
 * Polyfills for IE11.
 */
import "core-js/es6/symbol";
import "core-js/es6/object";
import "core-js/es6/function";
import "core-js/es6/parse-int";
import "core-js/es6/parse-float";
import "core-js/es6/number";
import "core-js/es6/math";
import "core-js/es6/string";
import "core-js/es6/date";
import "core-js/es6/array";
import "core-js/es6/regexp";
import "core-js/es6/map";
import "core-js/es6/set";

import "core-js/es6/reflect";
import "core-js/es7/reflect";
/*
 * End of polyfills.
 */

import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

const rootElemTagName = "app-root"; // Update this if you change your root component selector

let module: any; // Workaround for https://github.com/glenjamin/webpack-hot-middleware/issues/89. Remove this if you upgrade to a fixed version

// Enable either Hot Module Reloading or production mode
if (module["hot"]) {
    module["hot"].accept();
    module["hot"].dispose(() => {
        // Before restarting the app, we create a new root element and dispose the old one
        const oldRootElem = document.querySelector(rootElemTagName);
        const newRootElem = document.createElement(rootElemTagName);
        if (oldRootElem !== null && oldRootElem.parentNode !== null) {
            oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
            oldRootElem.remove();
        }
        modulePromise.then(appModule => appModule.destroy());
    });
} else {
    enableProdMode();
}

const modulePromise = platformBrowserDynamic().bootstrapModule(AppModule);