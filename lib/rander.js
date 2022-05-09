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

function randerPush({
    module,
    routeConfigKey,
    componentKey,
    beforePush=new Function(),
    afterPush=new Function(),
    randerList,
}) {
    beforePush({
        module,
        routeConfigKey,
        componentKey
    })
    randerList.push(module[componentKey])
    afterPush({
        module,
        routeConfigKey,
        componentKey
    })
}

export function genRanderFunction({
    mode='hash',
    moduleList=[],
    defaultModule=null,
    routeConfigKey='routeConfig',
    componentKey='default',
    before=new Function(),
    after=new Function(),
    beforePush=new Function(),
    afterPush=new Function()
}) {
    return function() {
        const pathString = getFunctionByMode(mode).getPathString();
        const randerList = []
        before({
            pathString,
            routeConfigKey,
            componentKey
        })
        for(const module of moduleList) {
            const pathRegexp = pathToRegexp(module[routeConfigKey].path)
            if(pathRegexp.exec(pathString)) {
                randerPush({
                    module,
                    routeConfigKey,
                    componentKey,
                    beforePush,
                    afterPush,
                    randerList,
                })
            }
        }
        after({
            pathString,
            routeConfigKey,
            componentKey
        })
        if(randerList.length===0 && defaultModule) {
            randerPush({
                module:defaultModule,
                routeConfigKey,
                componentKey,
                beforePush,
                afterPush,
                randerList,
            })
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