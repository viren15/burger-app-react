import React, { Component } from 'react';

import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Button from '../../UI/Button/Button';

class orderSummary extends Component {
        render() {
                const ingredientSummary = Object.keys(this.props.ingredients).map(igKey => {
                        return <li key={igKey}><span style={{textTransform: 'capitalize'}}>{igKey}</span>: {this.props.ingredients[igKey]}</li>
                });

                return (
                        <Aux>
                                <h3>Your Order</h3>
                                <p>A Delicious Burger With The Following Ingredients:</p>
                                <ul>
                                        {ingredientSummary}
                                </ul>
                                <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
                                <p>Continue To Checkout?</p>
                                <Button btnType="Danger" clicked={this.props.purchaseCanceled}>CANCEL</Button>
                                <Button btnType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
                        </Aux>
                );
        }
}



export default orderSummary;