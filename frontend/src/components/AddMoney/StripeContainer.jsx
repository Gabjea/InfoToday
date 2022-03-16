import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import PaymentForm from "./PaymentForm"

const PUBLIC_KEY = "pk_test_51K39eOIrhdWBWmYcWpH5ArDj3XuxUuNMNW25w8qF9rhDhqlvLguWQre17ubkHgZ0ITSAqR8D5f99PuHVznhi689c00gGj6iLUK"

const stripeTestPromise = loadStripe(PUBLIC_KEY)

export default function StripeContainer() {

    return (
        <Elements stripe={stripeTestPromise}>
            <PaymentForm />
        </Elements>
    )
}