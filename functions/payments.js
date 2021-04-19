const stripe = require('stripe')('sk_test_51IfXuHFH7byQmJ4z7thTPlUMqPmM2mS1UQRAnuUWbXmWh4g8RIyiQ6jXr1EbVlgsNFZb7zMalpEDScj88hTLwUPX00lGfiG9yw');

const cors = require('cors');
const express = require('express');
const app = express();
app.use(express.static('.'));
const YOUR_DOMAIN = 'http://localhost:5000';

exports.handler = async function(request, response, database) {
        payment_details = JSON.parse(request.body);
        console.log("session_price: " + payment_details.session_price)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: payment_details.session_description,
                            images: [payment_details.session_image],
                        },
                        unit_amount: payment_details.session_price*100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/` + payment_details.success_url,
            cancel_url: `${YOUR_DOMAIN}/` + payment_details.cancel_url,
        });
        cors() ( request, response, () => {
        response.json({id: session.id});
    });
};