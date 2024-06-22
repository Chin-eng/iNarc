import { isRecord } from "./record";

// Description of Food
export type Food = {
    readonly name: string,
    readonly metric: string,
    readonly cost: number,
    readonly servings: number,
    readonly lbsBought: number,
    readonly fats: number,
    readonly carbs: number,
    readonly proteins: number,
    readonly bought: number,
    readonly list: string
}
/**
 * Parse data into a Food
 * @param val   unknown data to be parsed into a Food
 *  @returns    Food if val is a valid Food, undefined otherwise
 */
export const parseFood = (val: unknown): undefined | Food => {
    if (!isRecord(val)) {
        console.error("not a food", val)
        return undefined;
    }

    if (typeof val.name !== "string") {
        console.error("not a food: missing 'name'", val)
        return undefined;
    }

    if (typeof val.metric !== "string") {
        console.error("not a food: missing 'metric'", val)
        return undefined;
    }

    if (typeof val.cost !== "number") {
        console.error("not a food: missing 'cost'", val)
        return undefined;
    }

    if (typeof val.servings !== "number") {
        console.error("not a food: missing 'servings'", val)
        return undefined;
    }

    if (typeof val.lbsBought !== "number") {
        console.error("not a food: missing 'lbsBought'", val)
        return undefined;
    }

    if (typeof val.fats !== "number") {
        console.error("not a food: missing 'fats'", val)
        return undefined;
    }

    if (typeof val.carbs !== "number") {
        console.error("not a food: missing 'carbs'", val)
        return undefined;
    }

    if (typeof val.proteins !== "number") {
        console.error("not a food: missing 'proteins'", val)
        return undefined;
    }

    if (typeof val.list !== "string") {
        console.error("not a food: missing 'list'", val)
        return undefined;
    }

    if (typeof val.bought !== "number") {
        console.error("not a food: missing 'bought'", val)
        return undefined;
    }

    return {
        name: val.name,
        metric: val.metric, 
        cost: val.cost, 
        servings: val.servings, 
        lbsBought: val.lbsBought, 
        fats: val.fats, 
        carbs: val.carbs, 
        proteins: val.proteins,
        bought: val.bought,
        list: val.list
    }
}