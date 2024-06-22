import React, { ChangeEvent, Component, MouseEvent } from 'react';
import { Food } from './Food';

type CalculatorProps = {
    onDeleteClick: (food: Food) => void,
    onAddClick: (food: Food) => void,
    onAddFoodPage: () => void,
    foods: Food[]
}

type CalculatorState = {
    moneyGoal: number,
    days: number,
    budget: number
}

export class Calculator extends Component<CalculatorProps, CalculatorState> {
    constructor(props: CalculatorProps) {
        super(props);
        this.state = {moneyGoal: 0, days: 1, budget: 0}
    }
    
    render = (): JSX.Element => {
        // Getting total cost and pounds
        const currCosts: number[] = [];
        const pounds: number[] = [];
        for (const currFood of this.props.foods) {
            currCosts.push(Math.round(currFood.bought * currFood.lbsBought * currFood.cost * 100)/ 100)
            pounds.push(currFood.lbsBought * currFood.bought);
        }
        const totalCost: number = getTotalCost(currCosts, 0);
        const totalLbs = getTotalLbs(pounds, 0);

        return (
            <div>
                <h1>Welcome to the food calculator!</h1>
                {this.renderPersonalInfo()}
                {this.renderFoods(totalCost)}
                {this.renderSummary(totalCost, totalLbs)}
            </div>
        )
    }

    renderSummary = (totalCost: number, totalLbs: number): JSX.Element => {
        const dailyCost = absMoney(round(totalCost / this.state.days, 2))
        const totalSurplus = absMoney(round(this.state.budget * this.state.days - totalCost, 2))
        const daillySurplus = absMoney(round(this.state.budget - totalCost / this.state.days, 2))

        return (
            <div>
                <h2>Summary: </h2>
                    <table>
                        <tbody>
                            <tr>
                                <th>----Total Cost---</th>
                                <th>----Daily Cost---</th>
                                <th>----Total LBS----</th>
                                <th>----Daily LBS----</th>
                                <th>----Total Surplus----</th>
                                <th>----Daily Surplus----</th>
                            </tr>
                            <tr>
                                <th>{absMoney(round(totalCost, 2))}</th>
                                <th>{dailyCost}</th>
                                <th>{round(totalLbs, 2)} LBS</th>
                                <th>{round(totalLbs / this.state.days, 2)} LBS</th>
                                <th>{totalSurplus}</th>
                                <th>{daillySurplus}</th>
                            </tr>
                        </tbody>
                    </table>
            </div>
        )
    }

    renderPersonalInfo = (): JSX.Element => {
        return (
            <div>
                <h2>Personal Information</h2>
                    <div>
                        Days planned out: <input type="number" onChange={this.doDayChange} defaultValue={this.state.days} min={1}></input>
                    </div>
                    <div>
                        Daily Budget: <input type="number" onChange={this.doBudgetChange} defaultValue={this.state.budget} min={0}></input>
                    </div>
            </div>
        )
    }

    // TODO: Add in "miscellanous" and separate current table into TABLE OF MEATS
    renderFoods = (totalCost: number): JSX.Element => {
        const foods: JSX.Element[] = [];
        for (const currFood of this.props.foods) {
            if (currFood.list === "Calculator") {
                foods.push(
                    <tr key={currFood.name}>
                        {/** Delete item */}
                        <td><a href="#" onClick={(evt) => this.doDeleteClick(evt, currFood)}>X</a></td>

                        {/** Change input */}
                        <td>
                            <input type="number" id={currFood.name + " Input"} defaultValue={currFood.bought} name="input" min="0" max="1000" onChange={() => this.doBoughtChange(currFood)}/>
                        </td>

                        {/** Name */}
                        <td>{currFood.name}</td> 

                        {/** Cost per lb */}
                        <td>{Math.round(1000 * currFood.cost) / 1000}</td>

                        {/** Weight*/}
                        <td>{currFood.lbsBought} {currFood.metric}</td>

                        {/** % Cost */}
                        <td>{Math.round(1000 * currFood.lbsBought * currFood.bought * currFood.cost / totalCost) / 10}</td>

                        {/** Total pounds bought */}
                        <td>{currFood.lbsBought * currFood.bought}</td>
                    </tr>
                )
            }
        }

        if (foods.length === 0) {
            return (<>
                <button type="button" onClick={this.doAddClick}>Add New Food</button>
            </>)
        } else {
            return (
                <div>
                    <h2>Table of Foods</h2>
                    <table>
                        <tbody>
                            <tr>
                                <th></th>
                                <th>Bought-</th>
                                <th>Name-----------</th> 
                                <th>Cost/lb---</th>
                                <th>Weight----</th>
                                <th>% Cost----</th>
                                <th>Total LBS Bought---</th>
                            </tr>
                            {foods}
                         </tbody>
                    </table>
                    <button type="button" onClick={this.doAddClick}>Add New Food</button>
                    <button type="button" onClick={this.doCheckPropsClick}>Check Props</button>
                </div>
            )
        }
        
    }

    doAddClick = (): void => {
        this.props.onAddFoodPage();
    }

    doDeleteClick = (evt: MouseEvent<HTMLAnchorElement>, currFood: Food): void => {
        evt.preventDefault();
        this.props.onDeleteClick(currFood);
    }

    doBoughtChange = (food: Food): void => {
        const newBought = (document.getElementById(food.name + " Input") as HTMLInputElement).value;
        this.props.onAddClick({...food, bought: Number(newBought)})
    }

    doDayChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({days: Number(evt.target.value)})
    }

    doBudgetChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({budget: Number(evt.target.value)})
    }

    doCheckPropsClick = (): void => {
        console.log(this.props.foods)
    }
}

const getTotalCost = (costs: number[], idx: number): number => {
    const currCost = costs.at(idx)
    if (currCost === undefined) {
        return 0;
    } else {
        return currCost + getTotalCost(costs, idx + 1);
    }
}

const getTotalLbs = (pounds: number[], idx: number): number => {
    const currCost = pounds.at(idx)
    if (currCost === undefined) {
        return 0;
    } else {
        return currCost + getTotalCost(pounds, idx + 1);
    }
}

const round = (number: number, places: number): number => {
    return Math.round(number * 10 ** places) / 10 ** places;
}

const absMoney = (money: number): string => {
    if (money < 0) {
        return  "-$" + Math.abs(money)
    } else {
        return "$" + money
    }
}