const stripe = require('stripe')('sk_test_51IfXuHFH7byQmJ4z7thTPlUMqPmM2mS1UQRAnuUWbXmWh4g8RIyiQ6jXr1EbVlgsNFZb7zMalpEDScj88hTLwUPX00lGfiG9yw');

const cors = require('cors');
const express = require('express');
const app = express();
app.use(express.static('.'));
const YOUR_DOMAIN = 'http://localhost:5000';

exports.handler = async function(request, response, database) {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: '1 tutoring session',
                            images: ['https://i.imgur.com/EHyR2nP.png'],
                        },
                        unit_amount: 2000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/success.html`,
            cancel_url: `${YOUR_DOMAIN}/cancel.html`,
        });
        cors() ( request, response, () => {
        response.json({id: session.id});
    });
};