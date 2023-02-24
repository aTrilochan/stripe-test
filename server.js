const express = require('express');
const stripe = require('stripe')("sk_test_51Mbcm0KiLfUAS7VJ4LKslyOmUk0vBm9TkggJmpuySk8CSphVwVxQMf9Get8KD9NSLxDtCXsKHUJZ6HPjd1nPsTQA0006ent8lf")
const cors = require("cors");

const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(express.json());

let userCustomerMap = new Map();

userCustomerMap.set("USER_ID_2", "cus_NNA25mboRHELBh");


app.get('/list',async(req,res)=>{
  const customerId = userCustomerMap.get(req.params.userId);
  if(!customerId) res.status(400).send({
    message: "Customer ID not found"
  });
  const paymentMethods = await stripe.customers.listPaymentMethods(customerId,{type: 'card'});
  res.send(JSON.stringify(paymentMethods));
})

app.post('/payments', async (req, res) => {
    // console.log(userCustomerMap);
    let user_id = req.body.user.id;
    if (!userCustomerMap.has(user_id)) {
      const customer = await stripe.customers.create({
        name: req.body.name,
        email: req.body.email
      });
      userCustomerMap.set(user_id, customer.id);
    }
    let customerId = userCustomerMap.get(user_id);

  // console.log("customerID",customerId);
  // console.log("hehehe",req.body.paymentMethodId)

  // stripe?.paymentIntents?.confirm(req.body.paymentMethodId)
  // .then(paymentIntent => { 
  //   console.log("sucess",paymentIntent);
  // })
  // .catch(error => {
  //   console.error("Error confirming PaymentIntent: ", error);
  // });


    const paymentIntent  = await stripe.paymentIntents.create({
    amount: req.body.user.amount,
    currency: req.body.user.currency,
    payment_method:req.body.paymentMethodId,
    setup_future_usage: 'off_session',
    payment_method_types: ['card'],
    customer:customerId,
  });

  res.send(JSON.stringify({ clientSecret: paymentIntent.client_secret,customerId:customerId, statusHEHe:paymentIntent.status}));
});

app.listen(8080, () => console.log('Application started'));
