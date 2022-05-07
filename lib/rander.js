import {BrowseMode} from './mode/browse.js'
import {HashMode} from './mode/hash.js'
import {pathToRegexp} from 'path-to-regexp';

const modeMap = {
    browse:new BrowseMode(),
    hash:new HashMode(),
}

function getFunctionByMode(mode='hash') {
    if(!modeMap[mode]) {
        throw new Error('mode only support '+Object.keys(modeMap).join())
    }
    return modeMap[mode]
}

export function genRanderFunction({
    mode='hash',
    moduleList=[],
    defaultModule=null,
    routeConfigKey='routeConfig',
    componentKey='default'
}) {
    return function() {
        const pathString = getFunctionByMode(mode).getPathString();
        const randerList = []
        for(const module of moduleList) {
            const pathRegexp = pathToRegexp(module[routeConfigKey].path)
            if(pathRegexp.exec(pathString)) {
                randerList.push(module[componentKey])
            }
        }
        if(randerList.length===0 && defaultModule) {
            randerList.push(defaultModule[componentKey])
        }
        return randerList
    }
}

export function pathChangeNotify({
    mode='hash',
    callback=new Function()
}) {
    getFunctionByMode(mode).pathChangeNotify(callback)
}