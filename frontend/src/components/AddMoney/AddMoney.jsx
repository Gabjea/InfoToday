import React from 'react';
import StripeContainer from './StripeContainer';
import './AddMoney.css';

export default function AddMoney(props) {
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