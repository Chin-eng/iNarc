import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response; 

type Food = {
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

const map: Map<string, Food> = new Map();
// map.set("Beef Skirt", {
//     name: "Beef Skirt",
//     metric: "LB",
//     cost: 4.79,
//     servings: 1,
//     lbsBought: 2,
//     fats: 1,
//     carbs: 1,
//     proteins: 1,
//     bought: 1,
//     list: "Calculator"
// })

// GENERAL CHANGE METHOD
export const deleteFood = (req: SafeRequest, res: SafeResponse): void => { 
  const name = req.body.name;
  if (name == undefined || typeof name !== "string") {
    res.status(400).send("food not in our map");
    return;
  }

  map.delete(name)
  res.send({saved: true})
}

// GENERAL CHANGE METHOD
export const addFood = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== "string") {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const metric = req.body.metric;
  if (metric === undefined || typeof metric !== "string") {
    res.status(400).send('required argument "metric" was missing');
    return;
  }

  const cost = req.body.cost;
  if (cost === undefined || typeof cost !== "number") {
    res.status(400).send('required argument "cost" was missing');
    return;
  }

  const servings = req.body.servings;
  if (servings === undefined || typeof servings !== "number") {
    res.status(400).send('required argument "servings" was missing');
    return;
  }

  const lbsBought = req.body.lbsBought;
  if (lbsBought === undefined || typeof lbsBought !== "number") {
    res.status(400).send('required argument "lbsBought" was missing');
    return;
  }

  const fats = req.body.fats;
  if (fats === undefined || typeof fats !== "number") {
    res.status(400).send('required argument "fats" was missing');
    return;
  }

  const carbs = req.body.carbs;
  if (carbs === undefined || typeof carbs !== "number") {
    res.status(400).send('required argument "carbs" was missing');
    return;
  }

  const proteins = req.body.proteins;
  if (proteins === undefined || typeof proteins !== "number") {
    res.status(400).send('required argument "proteins" was missing');
    return;
  }

  const bought = req.body.bought;
  if (bought === undefined || typeof bought !== "number") {
    res.status(400).send('required argument "bought" was missing');
    return;
  }

  const list = req.body.list;
  if (list === undefined || typeof list !== "string") {
    res.status(400).send('required argument "list" was missing');
    return;
  }

  const currFood: Food = {
    name: name,
    metric: metric,
    cost: cost,
    servings: servings,
    lbsBought: lbsBought,
    fats: fats,
    carbs: carbs,
    proteins: proteins,
    bought: bought,
    list: list
  }

  map.set(name, currFood)
  res.send({saved: true})
}

export const listFoods = (_req: SafeRequest, res: SafeResponse): void => {
    // TODO: Sort this by param
    const names: string[] = Array.from(map.keys()).sort((a, b) => (map.get(b) as Food).cost - (map.get(a) as Food).cost);
    let i = 0;
    const foods: unknown[] = [];
    // Inv: IDK
    while (i < names.length) {
      foods.push(map.get(names[i]))
      i = i + 1;
    }
    res.send({foodsArr: foods});
}

let currDays: number = 0;
export const updateDay = (req: SafeRequest, res: SafeResponse): void => {
  const day = req.body.day
  if (typeof day !== "number") {
    res.status(400).send("Day is not a number")
    return;
  }
  currDays = Number(day)
  res.send({saved: true})
}

export const getDay = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({day: currDays});
}

// Helper to return the (first) value of the parameter if any was given.
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
