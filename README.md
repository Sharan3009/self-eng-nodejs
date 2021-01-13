# Initial Setup
### package.json
- `npm init`. Entry point is app.ts
- add the script `"start":"tsc && node dist/app.js"`

### Typescript
- `npm i -D typescript`
- `npm i -D tslint`

### tsconfig.json
- `./node_modules/.bin/tsc --init`
- change `target` to `es6`
- set `outDir` to `dist`

### tslint.json
- `./node_modules/.bin/tslint --init`

### express.js
- `npm i -S express`
- `npm i -D @types/express`

### initial server code
- create `app.ts`
```
import express from 'express';

const app:express.Application = express();
const port:number = 3000;
app.get("/",(req:express.Request,res:express.Response)=>{
    res.send("Hello world")
})

app.listen(port,()=>{
    console.log(`Server is started at port:${port}`);
})
```

# Start the application
- `npm start`