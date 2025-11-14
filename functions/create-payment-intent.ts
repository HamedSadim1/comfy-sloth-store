import { config } from "dotenv";
import Stripe from "stripe";

config();

const secretKey = process.env.VITE_REACT_APP_STRIP_SECRET_KEY;
if (!secretKey) {
  throw new Error("Stripe secret key is not defined.");
}

console.log(secretKey);

const stripe = new Stripe(secretKey, {
  apiVersion: "2022-11-15",
});

export async function handler(event, context) {
  if (event.body) {
    const { cart, shippingFee, totalAmount } = JSON.parse(event.body);

    const calculateOrderAmount = (shippingFee, totalAmount) => {
      return shippingFee + totalAmount;
    };

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(shippingFee, totalAmount),
        currency: "eur",
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: error.message }),
      };
    }
  }
  return {
    statusCode: 200,
    body: "Create Payment Intent",
  };
}
