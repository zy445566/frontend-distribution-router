import { BaseMode } from "./base"

export class BrowseMode extends BaseMode {
    getPathString() {
        const pathString = window.location.pathname.split("?")[0]
        return pathString
    }
}