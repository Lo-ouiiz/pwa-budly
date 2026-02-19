import { Router } from "express";
import Stripe from "stripe";

const router = Router();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY manquante !");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      payment_method_types: ["card", "paypal"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
