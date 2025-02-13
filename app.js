const express = require('express')
const app = express();
const myrepository= require('./MyRepository')
// const customersRoutes = require('./routes/customersRoutes');
//app.use('/api/customer', customerssRoutes);

app.get("/customers",async (req,res)=>{
    res.json(await myrepository.getCustomers())
})
//--------------------------------------------------

app.use(express.static("public"))
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));


