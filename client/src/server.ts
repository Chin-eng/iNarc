import { isRecord } from './record';
import { Food } from './Food';

// -------------------------- RECIEVING LIST OF ALL FOODS -------------------------- //
export type ListCallback = (foods: Food[]) => void;
export const listFoods = (cb: ListCallback): void => {
  fetch("/api/list")
    .then((res) => doListResp(res, cb))
    .catch(() => doError("failed to connect to server", "list"));
};
const doListResp = (res: Response, cb: ListCallback): void => {
  if (res.status === 200) {
      res.json().then((res) => doListJson(res, cb))
      .catch(() => doError("200 response is not JSON", "list"));
  } else if (res.status === 400) {
      res.text().then(doGeneralError)
      .catch(() => doError("400 response is not text", "list"));
  } else {
      doError(`bad status code: ${res.status}`, "list");
  }
};
const doListJson = (res: unknown, cb: ListCallback): void => {
  if (!isRecord(res) || !Array.isArray(res.foodsArr)) {
    console.error('Invalid JSON from /api/list', res);
    return;
  }
  cb(res.foodsArr);
};

// -------------------------- RECIEVING DAY -------------------------- //
export type GetDayCallback = (day: number) => void;
export const getDay = (cb: GetDayCallback): void => {
  fetch("/api/getDay")
    .then((res) => doDayResp(res, cb))
    .catch(() => doError("failed to connect to server", "getDay"));
};

const doDayResp = (res: Response, cb: GetDayCallback): void => {
  if (res.status === 200) {
      res.json().then((res) => doGetDayJson(res, cb))
      .catch(() => doError("200 response is not JSON", "getDay"));
  } else if (res.status === 400) {
      res.text().then(doGeneralError)
      .catch(() => doError("400 response is not text", "getDay"));
  } else {
      doError(`bad status code: ${res.status}`, "getDay");
  }
};

const doGetDayJson = (res: unknown, cb: GetDayCallback): void => {
  if (!isRecord(res) || typeof res.day !== "number") {
    console.error('Invalid JSON from /api/getDay', res);
    return;
  }
  cb(res.day);
};

// -------------------------- CHANGING DATE: GC -------------------------- //
export const updateDay = (day: number): void => {
  fetch("/api/updateDay", {method: 'POST', body: JSON.stringify({day: day}), headers: {'Content-Type': 'application/json'}})
    .then((res) => doGeneralResp(res, "updateDay"))
    .catch(() => doError("failed to connect to server", "updateDay"));
}

// -------------------------- SAVING FOOD: GC -------------------------- //
export const saveFood = (food: Food): void => {
  fetch("/api/add", {method: 'POST', body: JSON.stringify(food), headers: {'Content-Type': 'application/json'}})
    .then((res) => doGeneralResp(res, "add"))
    .catch(() => doError("failed to connect to server", "add"));
}

// -------------------------- DELETING FOOD: GC -------------------------- //
export const deleteFood = (food: Food): void => {
  fetch("/api/delete", {method: 'POST', body: JSON.stringify(food), headers: {'Content-Type': 'application/json'}})
    .then((res) => doGeneralResp(res, "delete"))
    .catch(() => doError("failed to connect to server", "delete"));
}

// -------------------------- GENERAL CHANGE -------------------------- //
// Use when you're just changing something in the server and not receiving information
// HAS to have res.sent({saved: true})
const doGeneralResp = (res: Response, path: string): void => {
  if (res.status === 200) {
    res.json().then((res) => doGeneralJson(res, path))
    .catch(() => doGeneralError("200 response is not JSON"));
  } else if (res.status === 400) {
    res.text().then(doGeneralError)
    .catch(() => doError("400 response is not text", path)) 
  } else {
    doGeneralError(`bad status code: ${res.status}`);
  }
}

const doGeneralJson = (res: unknown, path: string): void => {
  if (!isRecord(res) || typeof res.saved !== 'boolean' || res.saved !== true) {
    console.error("Invalid JSON from /api/" + path, res)
    return;
  } 
}

// -------------------------- ERRORS -------------------------- //
// Called if an error occurs at specific instance
const doError = (msg: string, route: string): void => {
  console.error(`Error fetching /api/${route}: ${msg}`);
};

// Called if an error occurs
const doGeneralError = (msg: string): void => {
  console.error(msg);
};
