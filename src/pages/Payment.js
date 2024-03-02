import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import AuthContext from '../context/AuthContextProvider';
import CartContext from '../context/CartContextProvider';

import { Button } from '../components/Button';
import classes from './Payment.module.css';
import { placeOrder } from '../api/api';
import ErrorGeneric from './ErrorGeneric';


export const Payment = () => {
  const [formData, setFormData] = useState({ credit_card_no: '' });
  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate()
  console.log(authCtx);

  function handleChange(event) {
    const { name, value } = event.target
    setFormData(prevFormData => {
      // only digits
      if (!isNaN(Number(value))) {
        return { ...prevFormData, [name]: value }   // key is computed prop
      }
      else {
        return prevFormData
      }
    })
  }

  // mock payment verification
  function validCreditCardData() {
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormData({ credit_card_no: '' });

    const requestBody = {}

    if (!validCreditCardData()) {
      throw new Error("Payment data invalid");
    }
    else {
      requestBody.paymentSuccessful = true
    }

    if (cartCtx.items.length < 1) {
      throw new Error("Cart is empty");
    }

    const albumsOrdered = cartCtx.items.map(item => {
      return {
        id: item.id, amountRequested: item.amountRequested,
        name: item.name, price: item.price
      }
    })

    requestBody.albumsOrdered = albumsOrdered;
    requestBody.totalFromFE = cartCtx.totalAmount;
    requestBody.userEmail = authCtx.loggedInUserData.email

    const response = await placeOrder(
      requestBody,
      authCtx.loggedInUserData.auth_token); // goes here -->> headers: { Authorization: `Bearer ${authToken}`

    //empty cart, will also persist in localStorage
    cartCtx.emptyCart();
    navigate('/')
    console.log(response.data)
  };


  return (<>
    {authCtx.isLoggedIn
      ? <form onSubmit={handleSubmit} className={classes.paymentForm}>
        <p className={classes.formInputsHeading}>Pay by card</p>
        <input
          type="text"
          required
          placeholder="Payment card number"
          onChange={handleChange}
          name="credit_card_no"
          value={formData.credit_card_no}
        />
        <Button>Submit</Button>
      </form>
      : <ErrorGeneric errMessage="Log in/register to continue" />
    }
  </>)
}
