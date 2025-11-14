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

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { cart, shippingFee, totalAmount } = req.body;

    const calculateOrderAmount = (shippingFee, totalAmount) => {
      return shippingFee + totalAmount;
    };

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(shippingFee, totalAmount),
        currency: "eur",
      });
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  } else {
    res.status(200).json({ message: "Create Payment Intent" });
  }
}
