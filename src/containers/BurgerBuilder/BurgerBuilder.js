import React, { Component } from "react";

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal';
import axios from '../../axios-orders';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
        salad: 0.5,
        cheese: 0.4,
        meat: 1.3,
        bacon: 0.7
}

class BurgerBuilder extends Component{
        /* constructor(props) {
                super(props);
                this.state = {...}
        } */
        state = {
                ingredients: null,
                totalPrice: 4,
                purchasable: false,
                purchasing: false,
                loading: false,
                error: false
        }

        componentDidMount() {
                console.log(this.props);
                axios.get('https://react-my-burger-faa6e.firebaseio.com/ingredients.json')
                        .then(response => {
                                this.setState({ingredients: response.data});
                        }).catch(error => {
                                this.setState({error: true});
                        });
        }

        updatePurchaseState(ingredients) {
                const sum = Object.keys(ingredients).map(igKey => {
                        return ingredients[igKey]
                }).reduce((sum, el) => {
                        return sum + el;
                }, 0);
                this.setState({ purchasable: sum > 0 });
        }

        addIngredientHandler = (type) => {
                const oldCount = this.state.ingredients[type];
                const upadtedCount = oldCount + 1;
                const updatedIngredients = {
                        ...this.state.ingredients
                }
                updatedIngredients[type] = upadtedCount;
                const priceAddition = INGREDIENT_PRICES[type];
                const oldPrice = this.state.totalPrice;
                const newPrice = oldPrice + priceAddition;
                this.setState({
                        ingredients: updatedIngredients,
                        totalPrice: newPrice
                });
                this.updatePurchaseState(updatedIngredients);
        }

        removeIngredientHandler = (type) => {
                const oldCount = this.state.ingredients[type];
                if (oldCount <= 0) {

                        return;
                }
                const upadtedCount = oldCount - 1;
                const updatedIngredients = {
                        ...this.state.ingredients
                }
                updatedIngredients[type] = upadtedCount;
                const priceDeduction = INGREDIENT_PRICES[type];
                const oldPrice = this.state.totalPrice;
                const newPrice = oldPrice - priceDeduction;
                this.setState({
                        ingredients: updatedIngredients,
                        totalPrice: newPrice
                });
                this.updatePurchaseState(updatedIngredients);
        }

        purchaseHandler = () => {
                this.setState({ purchasing: true });
        }

        purchaseCancelHandler = () => {
                this.setState({ purchasing: false })
        }

        purchaseContinueHandler = () => {
                // alert('You Continue!');

                const queryParams = [];
                for (let i in this.state.ingredients) {
                        queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
                }
                queryParams.push('price=' + this.state.totalPrice);
                const queryString = queryParams.join('&');

                this.props.history.push({
                        pathname: '/checkout',
                        search: '?' + queryString
                });
        }

        render() {
                let orderSummary = null;
                let burger = this.state.error ? <p style={{ color: 'red',textAlign: 'center' }}><strong>Ingredients can'tbe loaded! sorry for inconvenience</strong></p> : <Spinner />

                
                const disableInfo = {
                        ...this.state.ingredients
                };
                for (let key in disableInfo) {
                        disableInfo[key] = disableInfo[key] <= 0;
                }
                
                
                if (this.state.ingredients) {
                        burger = <Aux>
                                <Burger ingredients={this.state.ingredients} />
                                <BuildControls
                                        purchasable={this.state.purchasable}
                                        price={this.state.totalPrice}
                                        disabled={disableInfo}
                                        ordered={this.purchaseHandler}
                                        ingredientAdded={this.addIngredientHandler}
                                        ingredientRemoved={this.removeIngredientHandler} />
                        </Aux>;  
                        orderSummary = <OrderSummary
                        price={this.state.totalPrice}
                        ingredients={this.state.ingredients}
                        purchaseCanceled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler} />;
                }
                if (this.state.loading) {
                        orderSummary = <Spinner />;
                }
                return (
                        <Aux>
                                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                                        {orderSummary}
                                </Modal>
                                {burger}
                        </Aux>
                );
        }
}

export default withErrorHandler(BurgerBuilder, axios);