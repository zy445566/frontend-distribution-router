# frontend-distribution-router
Non-centralized router, where routes are configured in each component.
the better way to config router!

# install
```sh
npm install frontend-distribution-router
# OR
yarn add frontend-distribution-router
```

# use 
### react
example.js:
```js
export const routeConfig = {
    path:"/example",
}
export default function Example() {
 return (<h1>Example</h1>)
}
```
app.js:
```js
import * as exampleModule from './example.vue'
import {genRanderFunction, pathChangeNotify} from 'frontend-distribution-router'
const randerFunction = genRanderFunction({
    mode:'hash',
    moduleList:[exampleModule],
    defaultModule:exampleModule,
})
function App() {
    const [componentList,setComponentListHook] = useState(randerFunction())
    pathChangeNotify({mode:'hash',callback:()=>{
        setComponentListHook(randerFunction())
    }})
    return (
        <div>
        {
            componentList.map(View=>{
                return (<View/>)
            })
        }
        </div>
    )
}

export default App;

```

### vue
example.vue:
```js
export const routeConfig = {
    path:'/example'
}
export default {
    name: "example",
    data: function () {
        return {}
    },
}
```

app.vue:
```html
<component 
v-for="component in componentList" 
:key="component"  
v-bind:is="component" />
```
```js
import { markRaw } from 'vue'
import * as exampleModule from './example.vue'
import {genRanderFunction, pathChangeNotify} from 'frontend-distribution-router'
export default {
    name: "example",
    data: function () {
        return {
            componentList:[]
        }
    },
    created: function () {
        const randerFunction = genRanderFunction({
            mode:'hash',
            moduleList:[exampleModule],
            defaultModule:exampleModule,
            beforePush:({
                module,
                componentKey
            })=>{
                module[componentKey] = markRaw(module[componentKey])
            }
        })
        this.componentList = randerFunction()
        pathChangeNotify({mode:'hash',callback:()=>{
            this.componentList = randerFunction()
        }})
    }
}

```

### svelet
example.svelet:
```js
// <script context="module">
export const routeConfig = {
    path:"/example",
}
// </script>
```

app.svelet:
```html
{#each componentList as component}
    <svelte:component this={component} />
{/each}
```
```js
import * as exampleModule from './example.svelet'
import {genRanderFunction, pathChangeNotify} from 'frontend-distribution-router'
const randerFunction = genRanderFunction({
    mode:'hash',
    moduleList:[exampleModule],
    defaultModule:exampleModule,
})
let componentList = randerFunction()
pathChangeNotify({mode:'hash',callback:()=>{
    componentList = randerFunction()
}})
```
