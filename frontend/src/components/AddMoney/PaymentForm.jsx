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
                    amount: currAmount + amountToAdd,
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
        <>

            {
                <form onSubmit={handleSubmit}>
                    <div className="">
                        <input
                        style={{'margin': '0px 15px 20px', 'padding': '11px 15px 11px 0px', 
                        'box-sizing': 'border-box'                    
                    }}
                        onChange={e => setAmountToAdd(Number(e.target.value))} type="text" placeholder="cantitate"
                            className=" w-11/12
                        appearance-none block bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
                        />
                        <br />
                    </div>
                    <fieldset className="FormGroup">
                        <div className="FormRow">
                            <CardElement options={CARD_OPTIONS} />
                        </div>
                    </fieldset>
                    <button className="stripe">Pay</button>
                </form>

            }

        </>
    )
}