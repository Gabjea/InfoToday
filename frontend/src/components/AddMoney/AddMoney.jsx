import React from 'react';
import StripeContainer from './StripeContainer';
import './AddMoney.css';
import { getUserDataFromJwtReq } from '../../utils/serverAPI';

export default function AddMoney(props) {
    React.useEffect(() => {
        getUserDataFromJwtReq().then(({ role }) => {
            if (role === 'teacher') {
                return window.location.assign('/');
            }
        })
    }, [])

    return (
        <div className='App'>
            <StripeContainer />
        </div>
    );
}