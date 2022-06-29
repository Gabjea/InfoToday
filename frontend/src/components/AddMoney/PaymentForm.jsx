import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from 'react'
import { axiosAuthInstanceToAPI, getUserDataFromJwtReq } from "../../utils/serverAPI"


const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
        base: {
            iconColor: "#c4f0ff",
            color: "#fff",
            fontWeight: 500,
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
            fontSize: "16px",
            fontSmoothing: "antialiased",
            ":-webkit-autofill": { color: "#fce883" },
            "::placeholder": { color: "#87bbfd" }
        },
        invalid: {
            iconColor: "#ffc7ee",
            color: "#ffc7ee"
        }
    }
}

export default function PaymentForm() {
    const [amountToAdd, setAmountToAdd] = React.useState();
    const [success, setSuccess] = useState(false)
    const stripe = useStripe()
    const elements = useElements()


    const handleSubmit = async (e) => {
        e.preventDefault()
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        })


        if (!error) {
            try {
                const { id } = paymentMethod
                //console.log(amountToAdd);
                if (!amountToAdd || amountToAdd <= 0) {
                    alert('cantitate invalida!');
                    return;
                }

                const currAmount = (await getUserDataFromJwtReq()).coins;

                const response = await axiosAuthInstanceToAPI.post("/user/payment", {
                    amount: amountToAdd,
                    id
                })

                if (response.data.success) {
                    console.log("Successful payment")
                    setSuccess(true)
                }

            } catch (error) {
                console.log("Error", error)
            }
        } else {
            console.log(error.message)
        }
    }

    React.useEffect(() => {
        if (success) {
            alert('Tranzactie incheiata cu succes!');
            window.location.assign('/dashboard');
            return null;
        }
    }, [success])

    return (
        <div className="w-full">

            {
                <form onSubmit={handleSubmit}>
                    <div >
                        <input
                        onChange={e => setAmountToAdd(Number(e.target.value))} type="text" placeholder="lei"
                            className=" w-full mb-2
                        appearance-none block bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                        />
                     
                    </div>
                    <fieldset className="FormGroup">
                        <div className="FormRow">
                            <CardElement options={CARD_OPTIONS} />
                        </div>
                    </fieldset>
                    <button className="stripe w-full">Pay</button>
                </form>

            }

        </div>
    )
}