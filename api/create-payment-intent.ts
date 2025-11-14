import { config } from "dotenv";
import Stripe from "stripe";

config();

const secretKey = process.env.VITE_REACT_APP_STRIP_SECRET_KEY;
if (!secretKey) {
  throw new Error("Stripe secret key is not defined.");
}

console.log(secretKey);

const stripe = new Stripe(secretKey, {
  apiVersion: "2024-06-20",
});

interface VercelRequest {
  method: string;
  body: any;
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(data: any): void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const { shippingFee, totalAmount } = req.body;

    const calculateOrderAmount = (shippingFee: number, totalAmount: number): number => {
      return shippingFee + totalAmount;
    };

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(shippingFee, totalAmount),
        currency: "eur",
      });
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ msg: errorMessage });
    }
  } else {
    res.status(200).json({ message: "Create Payment Intent" });
  }
}
