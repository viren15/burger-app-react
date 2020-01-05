import React, { Component } from "react";
import {connect} from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal';
import axios from '../../axios-orders';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component{
        state = {
                purchasing: false,
                loading: false,
                error: false
        }

        componentDidMount() {
                console.log(this.props);
                // axios.get('https://react-my-burger-faa6e.firebaseio.com/ingredients.json')
                //         .then(response => {
                //                 this.setState({ingredients: response.data});
                //         }).catch(error => {
                //                 this.setState({error: true});
                //         });
        }

        updatePurchaseState(ingredients) {
                const sum = Object.keys(ingredients).map(igKey => {
                        return ingredients[igKey]
                }).reduce((sum, el) => {
                        return sum + el;
                }, 0);
                return sum > 0;
        }

        purchaseHandler = () => {
                this.setState({ purchasing: true });
        }

        purchaseCancelHandler = () => {
                this.setState({ purchasing: false })
        }

        purchaseContinueHandler = () => {
                this.props.history.push('/checkout');
        }

        render() {
                let orderSummary = null;
                let burger = this.state.error ? <p style={{ color: 'red',textAlign: 'center' }}><strong>Ingredients can'tbe loaded! sorry for inconvenience</strong></p> : <Spinner />

                
                const disableInfo = {
                        ...this.props.ings
                };
                for (let key in disableInfo) {
                        disableInfo[key] = disableInfo[key] <= 0;
                }
                
                
                if (this.props.ings) {
                        burger = <Aux>
                                <Burger ingredients={this.props.ings} />
                                <BuildControls
                                        purchasable={this.updatePurchaseState(this.props.ings)}
                                        price={this.props.price}
                                        disabled={disableInfo}
                                        ordered={this.purchaseHandler}
                                        ingredientAdded={this.props.onIngredientAdded}
                                        ingredientRemoved={this.props.onIngredientRemoved} />
                        </Aux>;  
                        orderSummary = <OrderSummary
                                price={this.props.price}
                                ingredients={this.props.ings}
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

const mapStatesToProps = state => {
        return {
                ings: state.ingredients,
                price: state.totalPrice
        };
};

const mapDispatchToProps = dispatch => {
        return {
                onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
                onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
        };
};

export default connect(mapStatesToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));