var http = require('http');
var oracledb = require('oracledb');
var express = require('express');
const bodyParser = require('body-parser');
var app = express();

var PORT = 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
// const TABLE_NAME= CURIER_SERVICE ;

try {
  oracledb.initOracleClient({libDir: 'C:\\oraclexe\\instantclient_19_11'});
} catch (err) {
  console.error('Whoops!');
  console.error(err);
  process.exit(1);
}
(async function() {
  try{
     connection = await oracledb.getConnection({
      user: "subrata",
      password: "subrata",
      connectString: "127.0.0.1/XE"
     });
     console.log("Successfully connected to Oracle!")
  } catch(err) {
      console.log("Error: ", err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch(err) {
          console.log("Error when closing the database connection: ", err);
        }
      }
    }
  })()
// ----------------------------------------------------------------------------------------------------------- //



// -----------------All Orders------------------------------- //
app.get('/allOrders',(req,res)=>{
   const query2=`SELECT order_id from CURIER_SERVICE`;
 connection= oracledb.getConnection({
    user: "subrata",
    password: "subrata",
    connectString: "127.0.0.1/XE"
   },
   function(err, connection) {
        if (err) { console.error(err); return ; 
        }
   connection.execute(
    query2,
    function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      // console.log(result.rows);
      res.status(200).send(JSON.stringify(result.rows));
   });
  })
});

// --------------------ADD ORDERS------------ //
app.post('/addOrders', (req, res)=>{
  var Ord=req.body;
  const OrderData=[
    Ord.order_id,
    Ord.tracking_id,
    Ord.order_weight,
    Ord.order_type,
    Ord.order_price,
    Ord.order_status,
    Ord.sender_name,
    Ord.sender_state,
    Ord.sender_address,
    Ord.sender_mobile,
    Ord.reciver_name,
    Ord.reciver_state,
    Ord.reciver_address,
    Ord.reciver_mobile
  ];
  console.log("OrderData==>",OrderData)
  const addOrderQuery = `INSERT INTO CURIER_SERVICE
   VALUES (:0, :1, :2 , :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13)`;
   connection= oracledb.getConnection({
    user: "subrata",
    password: "subrata",
    connectString: "127.0.0.1/XE"
   },
   function(err, connection) {
        if (err) { console.error(err); return ; 
        }
   connection.execute(
    addOrderQuery,OrderData,{autoCommit:true},
    // "select * from CURIER_SERVICE ",
    function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      // console.log(result);
      res.status(200).send(JSON.stringify(result));
   });
  })
  // res.status(200).send(req.body)
});

// ----------------------------------SEARCH BY ORDER ID-------------------------------- //
app.get('/order_id/:order_id',async (req,res)=>{
  const order_id=req.params.order_id;
  const queryForOrderId=`Select * from CURIER_SERVICE where order_id=${order_id}`
  connection= oracledb.getConnection({
    user: "subrata",
    password: "subrata",
    connectString: "127.0.0.1/XE"
   },
   await function(err, connection) {
        if (err) { console.error(err); return ; 
        }
   connection.execute(
     queryForOrderId,
    function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(result);
      res.status(200).send(JSON.stringify(result.rows));
   });
  })
});

// ----------------------SEARCH BY TRACKING ID----------------------------------- //
app.get('/tracking_id/:tracking_id',async (req,res)=>{
  const tracking_id=req.params.tracking_id;
  const queryForTrackingId=`Select * from CURIER_SERVICE where tracking_id=${tracking_id}`
  connection= oracledb.getConnection({
    user: "subrata",
    password: "subrata",
    connectString: "127.0.0.1/XE"
   },
   await function(err, connection) {
        if (err) { console.error(err); return ; 
        }
   connection.execute(
    queryForTrackingId,
    function(err, result) {
      if (err) {
        console.error(err.message);
        return;
      }
      console.log(result);
      res.status(200).send(JSON.stringify(result.rows));
   });
  })
});
// ----------------------------UPADTE ORDER STATUS----------------- \\
app.get('/update/:orderId/:orderStatus',(req,res)=>{
  // const order_id =req.params. ;
  // const order_status = req.params.order_status;
  // var Body=req.body;
  const updateData=[req.params.orderStatus,req.params.orderId]
  console.log(updateData);
  // const query2=`SELECT order_id from CURIER_SERVICE`;
  const Order_status_updateQuery = `UPDATE CURIER_SERVICE SET order_status = :1 
  where order_id IN (select order_id from CURIER_SERVICE where order_id = :2 )`
    
  // console.log(order_id,order_status);
  connection= oracledb.getConnection({
    user: "SUBRATA",
    password: "subrata",
    connectString: "127.0.0.1/XE"
   },
     function(err, connection) {
        if (err) { console.error("err1111===>",err); return ; 
        }
   connection.execute(
    Order_status_updateQuery,updateData,{autoCommit:true},
    // query2,
    function(err, result) {
      if (err) {
        console.error("-=-=-=-=>",err.message);
        return;
      }
      console.log(result);
      res.status(200).send(result);
      // res.status(400).send(err)
   });
  })
})

// ------------------------------------------------------------------- //
app.get('/',(req,res)=>{
  res.status(200).send("Welcome Curier Service Backend")
});
// ------------------------------------ //
app.listen(PORT,function(){
  console.log(PORT);
});
