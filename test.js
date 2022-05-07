import * as assert from 'assert'
import {genRanderFunction,pathChangeNotify} from './index.js'
global.window={}
window.location = {}
global.document={}
const body = {onhashchange:new Function()}
document.querySelector=function(){
    return body
}


const testUnit = {
    [Symbol('test.hash.match')] : async function() {
        window.location.hash='#/component2?a=1'
        const randerFunction = genRanderFunction({
            mode:'hash',
            moduleList:[
                {default:'component1',routeConfig:{path:'/component1'}},
                {default:'component2',routeConfig:{path:'/component2'}},
            ],
            defaultModule:{default:'componentDefault',routeConfig:{path:'/'}}
        })
        assert.deepEqual(
            randerFunction(),
            ['component2'],
            'test.hash.match error'
        )
    },
    [Symbol('test.hash.default')] : async function() {
        window.location.hash='#/'
        const randerFunction = genRanderFunction({
            mode:'hash',
            moduleList:[
                {default:'component1',routeConfig:{path:'/component1'}},
                {default:'component2',routeConfig:{path:'/component2'}},
            ],
            defaultModule:{default:'componentDefault',routeConfig:{path:'/'}}
        })
        assert.deepEqual(
            randerFunction(),
            ['componentDefault'],
            'test.hash.default error'
        )
    },
    [Symbol('test.hash.pathChangeNotify')] : async function() {
        window.location.hash='#/'
        await new Promise((reslove)=>{
            pathChangeNotify({
                mode:'hash',
                callback:(ev)=>{
                    assert.equal(
                        ev,
                        '#/component1',
                        'test.hash.pathChangeNotify error'
                    )
                    reslove()
                }
            })
            body.onhashchange('#/component1')
        })
        
    },
    [Symbol('test.browse.match')] : async function() {
        window.location.pathname='/component2?a=1'
        const randerFunction = genRanderFunction({
            mode:'browse',
            moduleList:[
                {default:'component1',routeConfig:{path:'/component1'}},
                {default:'component2',routeConfig:{path:'/component2'}},
            ],
            defaultModule:{default:'componentDefault',routeConfig:{path:'/'}}
        })
        assert.deepEqual(
            randerFunction(),
            ['component2'],
            'test.browse.match error'
        )
    },
    [Symbol('test.browse.default')] : async function() {
        window.location.pathname='/'
        const randerFunction = genRanderFunction({
            mode:'browse',
            moduleList:[
                {default:'component1',routeConfig:{path:'/component1'}},
                {default:'component2',routeConfig:{path:'/component2'}},
            ],
            defaultModule:{default:'componentDefault',routeConfig:{path:'/'}}
        })
        assert.deepEqual(
            randerFunction(),
            ['componentDefault'],
            'test.browse.default error'
        )
    },
}


async function run(testUnitList) {
    for(let testUnitValue of testUnitList) {
        for(let testFunc of Object.getOwnPropertySymbols(testUnitValue)) {
            await testUnitValue[testFunc]();
        }
    }
}
(async function() {
    try{
        await run([testUnit]);
    } catch(err) {
        console.log(err)
    }
})();

