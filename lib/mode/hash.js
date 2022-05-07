import { BaseMode } from "./base"

export class HashMode extends BaseMode {
    getPathString() {
		const queryString = window.location.hash.split("#")[1]
		const pathString = queryString?queryString.split("?")[0]:'/'
		return pathString
	}
	pathChangeNotify(callback) {
		const body = document.querySelector('body')
		const beforeHashChange = body.onhashchange || new Function();
		body.onhashchange = (ev)=>{
			beforeHashChange(ev)
			callback(ev)
		}
	}
}