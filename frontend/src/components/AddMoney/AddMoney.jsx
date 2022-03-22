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

    const [showItem, setShowItem] = React.useState(false);
    return (
        <div className='App'>
            <h1> </h1>
            {showItem ? (
                <StripeContainer />
            ) : (
                <>
                    <img src={
                        'https://i.ytimg.com/vi/_5Fjtk31IBE/maxresdefault.jpg'
                    } alt='Spatula' />
                    <button className='stripe' onClick={() => setShowItem(true)}>Adauga lei in cont</button>
                </>
            )}
        </div>
    );
}