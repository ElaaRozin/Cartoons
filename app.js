const express = require('express')
const app = express();
const myrepository= require('./MyRepository')
// const customersRoutes = require('./routes/customersRoutes');
//app.use('/api/customer', customerssRoutes);

app.get("/customers",async (req,res)=>{
    res.json(await myrepository.getCustomers())
})
//--------------------------------------------------



const server = app.listen(3002, function () {
    const host = server.address().address
    const port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
})
