import React, { ChangeEvent, Component, MouseEvent } from 'react'
import { Food } from './Food';

type NewFoodProps = {
    onAddClick: (food: Food) => void,
}

type NewFoodState = {
    name: string,
    metric: string,
    cost: number,
    servings: number,
    lbsBought: number,
    fats: number,
    carbs: number,
    proteins: number,
    list: string,
    error: string
}

export class NewFood extends Component<NewFoodProps, NewFoodState> {
    constructor(props: NewFoodProps) {
        super(props);
        this.state = {
            name: "", metric: "lbs", 
            cost: 0, servings: 1, lbsBought: 0, fats: 0, 
            carbs: 0, proteins: 0, list: "Calculator", error: ""
        }
    }

    render =(): JSX.Element => {
        return (
            <div>
                <div>
                    <h2>New Food Form</h2>

                    <div>
                        <label htmlFor='Name'>Name: </label>
                        <input type="text" id="Name" onChange={this.doNameChange}></input>
                    </div> 

                    <div>
                        <label htmlFor='Metric'>Metric: </label>
                        <select id="Metric" onChange={this.doMetricChange}>
                            <option value="lbs">lbs</option>
                            <option value="grams">grams</option>
                        </select>
                    </div> 

                    <div>
                        <label htmlFor='Units Bought'>LBS in 1 serving: </label>
                        <input type="number" id="Units Bought" onChange={this.doUnitsBoughtChange}></input>
                    </div> 

                    <div>
                        <label htmlFor='Cost'>Cost per LB: $</label>
                        <input type="number" id="Cost" onChange={this.doCostChange}></input>
                    </div> 

                    <div>
                        <label htmlFor='Fats'>Fats: </label>
                        <input type="number" id="Fats" onChange={this.doFatsChange}></input>
                    </div> 

                    <div>
                        <label htmlFor='Carbs'>Carbs: </label>
                        <input type="number" id="Carbs" onChange={this.doCarbsChange}></input>
                    </div> 

                    <div>
                        <label htmlFor='Proteins'>Proteins: </label>
                        <input type="number" id="Proteins" onChange={this.doProteinsChange}></input>
                    </div> 

                    <div>
                        <label htmlFor='List'>List: </label>
                        <select id="List" defaultValue="Calculator" onChange={this.doListChange}>
                            <option value="Inventory">Inventory</option>
                            <option value="Calculator">Calculator</option>
                        </select>
                    </div> 

                    <div>
                        <button onClick={this.doAddClick} type="button">ADD</button>
                    </div>
                </div>
                {this.state.error}
            </div>
        )
    }

    doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.name === "" || this.state.metric === "") {
            this.setState({error: " Missing input"})
            return;
        } else if (isNaN(this.state.lbsBought) || isNaN(this.state.cost) || isNaN(this.state.fats) || isNaN(this.state.carbs) || isNaN(this.state.proteins)) {
            this.setState({error: "All inputs other than metric and name have to be a number"})
            return;
        } else {
            this.setState({error: ""})
            this.props.onAddClick({
                name: this.state.name, metric: this.state.metric, 
                cost: this.state.cost, servings: this.state.servings, lbsBought: this.state.lbsBought, fats: this.state.fats, 
                carbs: this.state.carbs, proteins: this.state.proteins, list: this.state.list, bought: 1
            })
        }
    }

    doListChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
        this.setState({list: evt.target.value})
    }

    doProteinsChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        console.log(this.state.proteins)
        this.setState({proteins: Number(evt.target.value)})
    }

    doCarbsChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({carbs: Number(evt.target.value)})
    }

    doFatsChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({fats: Number(evt.target.value)})
    }

    doUnitsBoughtChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({lbsBought: Number(evt.target.value)})
    }

    doMetricChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
        this.setState({metric: evt.target.value})
    }

    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({name: evt.target.value})
    }

    doCostChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({cost: Number(evt.target.value)})
    }

    doServingsChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({servings: Number(evt.target.value)})
    }
}