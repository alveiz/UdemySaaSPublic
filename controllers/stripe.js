const User = require('../models/User');

const stripe = require('stripe')(process.env.APPSETTING_STRIPE_SECRET);
const DOMAIN = "http://testingsaas.com";
const timer = ms => new Promise(res => setTimeout(res, ms));

exports.createCheckout = async (req, res) => {
    const { priceId, sub } = req.body;

    try {
        const user = await User.findById(req.user);
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                }
            ],
            metadata: { 
                        user_id: JSON.stringify(user._id).substring(1, JSON.stringify(user._id).length - 1), 
                        subscription: sub 
            },
            success_url: `${DOMAIN}/`,
            cancel_url: `${DOMAIN}/`,
            automatic_tax: { enabled: true },
        });
        return res.status(200).json(session);
    } catch(err) {
        console.log(err);
        return res.status(404).json({ message: err.message });
    }
}

exports.createPortal = async (req, res) => { 
    const { customerId } = req.body;
    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${DOMAIN}/`,
        });
        return res.status(200).json(portalSession);
    } catch(err) {
        console.log(err.message);
        return res.status(404).json({ message: err.message });
    }
}

exports.createWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    const endpointSecret = process.env.APPSETTING_STRIPE_WEBHOOK_SECRET;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
        console.log(err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("EVENT:", event.type);

    switch (event.type) {
        case "checkout.session.completed": {
            try {
                console.log("checkout session completed");
                const user_id = event.data.object.metadata.user_id;
                await stripe.customers.update(
                    event.data.object.customer, 
                    { metadata: { user_id: user_id, sub: event.data.object.metadata.subscription } }
                );
                const user = await User.findById(user_id);
                user.customerId = event.data.object.customer;
                await user.save();
            } catch (err) {
                console.log(err);
                return res.status(404).send(` Webhook error: ${err.message}`);
            }

            break;
        }
        case 'payment_intent.succeeded': {
            try {
              await timer(3000);
              const customer_id = event.data.object.customer;
              console.log("payment intent success");
              const customer = await stripe.customers.retrieve(customer_id);
              const user = await User.find({customerId: customer_id});
              user[0].subscription = customer.metadata.sub;
              await user[0].save();
            }
            catch (err) {
              return res.status(400).send(`Webhook Error: ${err.message}`);
            }
            
            break;
        }
        case 'payment_intent.payment_failed': {
            try {
              await timer(3000);
              const customer_id = event.data.object.customer;
              console.log("payment intent failure");
              const user = await User.find({customerId: customer_id});
              user[0].subscription = "";
              await user[0].save();
            }
            catch (err) {
              return res.status(400).send(`Webhook Error: ${err.message}`);
            }
            
            break;
        }
        case 'customer.subscription.deleted': {
            try {
                console.log('customer sub deleted');
                await timer(3000);
                const customer_id = event.data.object.customer;

                const user = await User.find({customerId: customer_id});
                user[0].subscription = "";
                await user[0].save();
            }
            catch (err) {
                return res.status(400).send(`Webhook Error: ${err.message}`);
            }

        break;
        }
        case 'customer.deleted': {
            try {
              console.log('customer deleted');
              const customer_id = event.data.object.customer;
              const user = await User.find({customerId: customer_id});
              user[0].customerId = "";
              user[0].subscription = "";
              await user[0].save();
            }
            catch (err) {
              return res.status(400).send(`Webhook Error: ${err.message}`);
            }
            
            break;
          }
          default:
            // Unexpected event type
            return res.status(400).end();
        }
    res.json({received: true});
}