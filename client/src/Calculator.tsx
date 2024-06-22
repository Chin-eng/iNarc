import React, { ChangeEvent, Component, MouseEvent } from 'react';
import { Food } from './Food';

type CalculatorProps = {
    onDeleteClick: (food: Food) => void,
    onAddClick: (food: Food) => void,
    onAddFoodPage: () => void,
    onDayChange: (day: number) => void,
    onBudgetChange: (budget: number) => void,
    budget: number,
    day: number,
    foods: Food[]
}

type CalculatorState = {
    moneyGoal: number,
    budget: number, 
    day: number,
    foodSort: string
}

export class Calculator extends Component<CalculatorProps, CalculatorState> {
    constructor(props: CalculatorProps) {
        super(props);
        this.state = {moneyGoal: 0, budget: this.props.budget, day: this.props.day, foodSort: "weight"}
    }
    
    componentDidUpdate(prevProps: CalculatorProps) {
        if (prevProps.day !== this.props.day) {
            this.setState({ day: this.props.day });
        }
        if (prevProps.budget !== this.props.budget) {
            this.setState({ budget: this.props.budget });
        }
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
        const dailyCost = absMoney(round(totalCost / this.state.day, 2))
        const totalSurplus = absMoney(round(this.state.budget * this.state.day - totalCost, 2))
        const daillySurplus = absMoney(round(this.state.budget - totalCost / this.state.day, 2))

        return (
            <div>
                <h2>Summary: </h2>
                    <table>
                        <tbody>
                            <tr>
                                <th>Total Cost:</th>
                                <th>{absMoney(round(totalCost, 2))}</th>
                            </tr>
                            <tr>
                                <th>Daily Cost:</th>
                                <th>{dailyCost}</th>
                            </tr>
                            <tr>
                                <th>Total Surplus:</th>
                                <th>{totalSurplus}</th>
                            </tr>
                            <tr>
                                <th>Daily Surplus:</th>
                                <th>{daillySurplus}</th>
                            </tr>
                            <tr>
                                <th>Total LBS:</th>
                                <th>{round(totalLbs, 2)} LBS</th>
                            </tr>
                            <tr>
                                <th>Daily LBS:</th>
                                <th>{round(totalLbs / this.state.day, 2)} LBS</th>
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
                        Days planned out: <input type="number" onChange={this.doDayChange} value={this.state.day} min={0}></input>
                    </div>
                    <div>
                        Daily Budget: <input type="number" onChange={this.doBudgetChange} value={this.state.budget} min={0}></input>
                    </div>
            </div>
        )
    }

    // TODO: Add in "miscellanous" and separate current table into TABLE OF MEATS
    renderFoods = (totalCost: number): JSX.Element => {
        const foods: JSX.Element[] = [];

        const sort: string = this.state.foodSort;
        if (sort === "bought") {
            this.props.foods.sort((a, b) => b.bought - a.bought);
        } else if (sort === "weight") {
            this.props.foods.sort((a, b) => b.lbsBought - a.lbsBought);
        } else {
            this.props.foods.sort((a, b) => b.cost - a.cost);
        }

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
                        <td>{round(100 * currFood.lbsBought * currFood.bought * currFood.cost / totalCost, 2)}</td>

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

                    <div>
                        <label htmlFor="sort">Sort Food By:</label>
                        <select value={this.state.foodSort} id="sort" onChange={this.doSortChange}>
                            <option value="bought">Bought</option>
                            <option value="weight">Weight</option>
                            <option value="unitPrice">Unit Price</option>
                        </select>
                    </div>

                    <table>
                        <tbody>
                            <tr>
                                <th></th>
                                <th>Bought-</th>
                                <th>Name-----------</th> 
                                <th>Cost/lb---</th>
                                <th>Weight----</th>
                                <th>% Cost----</th>
                                <th>LBS Bought---</th>
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
        this.props.onDayChange(Number(evt.target.value))
        this.setState({day: Number(evt.target.value)})
    }

    doBudgetChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.props.onBudgetChange(Number(evt.target.value))
        this.setState({budget: Number(evt.target.value)})
    }

    doCheckPropsClick = (): void => {
        console.log(this.props.foods)
    }

    doSortChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
        const sort: string = evt.target.value;
        if (sort === "weight") {
            this.setState({foodSort: "weight"})
        } else if (sort === "bought") {
            this.setState({foodSort: "bought"})
        } else {
            this.setState({foodSort: "unitPrice"})
        }
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