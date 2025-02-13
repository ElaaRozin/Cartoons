// https://github.com/tediousjs/node-mssql#es6-tagged-template-literals


const mssql = require('mssql')
require('dotenv').config()

const sqlConfig = {
    user: "sa29",
    password: "Aa1234!!",
    database: "PizzaDB",
    server: 'cartoons.database.windows.net', //Server to connect to. You can use 'localhost\instance' to connect to named instance.
    port: 1433, //Port to connect to (default: 1433). Don't set when connecting to named instance.
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure use true
        trustServerCertificate: true // use true for local dev / self-signed certs
    }
}
const appPool = new mssql.ConnectionPool(sqlConfig)



const getCustomers = async (req, theId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let myConnectionPoolToDB = await appPool.connect()
            try {
                let results = await myConnectionPoolToDB.query(`select * from Customers`)//where id = ? OR id = ?`, (theId, theId + 2))
                console.log(results);
                resolve(results);
            }
            catch (err) {
                console.log("there was an error while sending query to DB ", err);
                reject(err);
            }
        }
        catch (err) {
            console.error('ERROR CONNECTION TO DB: ', err);
            reject('ERROR CONNECTION TO DB: ', err);
        }
    })
}

module.exports.getCustomers = getCustomers;
getCustomers();
//============================================================================
// stored proc
/*
assuming the stored proc was defined on SQLServer like so:
//-----------------------------------
CREATE PROCEDURE [dbo].[spHowManyOrdersPerCustomerBetween_Date1_Date2]
@StartDate DATETIME,
@EndDate DATETIME
as
begin
    SELECT COUNT(id)
    FROM Orders
    WHERE orderDate BETWEEN @StartDate AND @EndDate
    GROUP BY customerId
end
GO

//-----------------------------------
and we can run it on SSMS like so:

exec spHowManyOrdersPerCustomerBetween_Date1_Date2 '2022-02-01','2022-02-05'
*/


/* 
Types:

JS Data Type To SQL Data Type Map

Number -> sql.Int
String -> sql.NVarChar
Boolean -> sql.Bit
Date -> sql.DateTime
Buffer -> sql.VarBinary
sql.Table -> sql.TVP

*/

// read here more:
//  https://www.npmjs.com/package/mssql#execute-procedure-callback
//=====================================================================

const getUsingStoredProcedure = async (req, theId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let myConnectionPoolToDB = await appPool.connect()
            try {
                let results = await myConnectionPoolToDB.request()
                    .input('StartDate', sql.DateTime, value)
                    .input('EndDate', sql.DateTime, value)
                    // .output('output_parameter', sql.VarChar(50))
                    .execute('spHowManyOrdersPerCustomerBetween_Date1_Date2')

                console.log(results);
                resolve(results);
            }
            catch (err) {
                console.log("there was an error while sending query to DB ", err);
                reject(err);
            }
        }
        catch (err) {
            console.error('ERROR CONNECTION TO DB: ', err);
            reject('ERROR CONNECTION TO DB: ', err);
        }
    })
}

module.exports.getUsingStoredProcedure = getUsingStoredProcedure;