import Express = require("express");

const app = Express();
app.use(Express.json());




app.listen(3000,()=>{
    console.log("a");
    
})