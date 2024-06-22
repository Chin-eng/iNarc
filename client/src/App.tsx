import React, { Component } from "react";
import { Food } from "./Food";
import { Calculator } from "./Calculator";
import { deleteFood, listFoods, saveFood} from "./server";
import { NewFood } from "./NewFood";

type Page = "Inventory" | "Calculator" | "New Food"
type AppState = {
    page: Page, foodList: Array<Food>
}

export class App extends Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            page: "Calculator", foodList: []
        };
    }

    componentDidMount(): void {
        listFoods(this.doListResp);
    }

    render = (): JSX.Element => {
        if (this.state.page === "Calculator") {
            return <Calculator  onDeleteClick={this.doDeleteClick} 
                                onAddClick={this.doAddClick} 
                                foods={this.state.foodList}
                                onAddFoodPage={this.doAddFoodPageChange}/>
        } else if (this.state.page === "Inventory") {
            return <div>Trying to go to inventory</div>
        } else {
            return <NewFood onAddClick={this.doAddClick}></NewFood>
        }
    };

    // doDayChange = (day: number): void => {
    //     updateDay(day)
    // }

    // doGetDayResp = (day: number): void => {
    //     this.setState({day: day})
    // }

    doAddFoodPageChange = (): void => {
        this.setState({page: "New Food"});
    }

    doListResp = (foods: Food[]): void => {
        this.setState({foodList: foods})
    }

    doAddClick = (food: Food): void => {
        saveFood(food)
        listFoods(this.doListResp);
        this.setState({page: "Calculator"})
    }

    doDeleteClick = (food: Food): void => {
        deleteFood(food)
    }
}