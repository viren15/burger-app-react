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
import * as burgerBuilderActions from '../../store/actions/index';

class BurgerBuilder extends Component{
        state = {
                purchasing: false
        }

        componentDidMount() {
                console.log(this.props);
                this.props.onInitIngredients();
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
                let burger = this.props.error ? <p style={{ color: 'red',textAlign: 'center' }}><strong>Ingredients can'tbe loaded! sorry for inconvenience</strong></p> : <Spinner />

                
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
                price: state.totalPrice,
                error: state.error
        };
};

const mapDispatchToProps = dispatch => {
        return {
                onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
                onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
                onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
        };
};

export default connect(mapStatesToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));