import { client } from "./main";

export function createResultJSON(data: any | undefined = {}, err: any | undefined = {}) {
    return {
        data,
        err,
    };
}
export function quickGen() {
    let array = [];
    for (let x = 0; x < 12; x++) {
        array.push(Math.floor(Math.random() * 9))
    }
    return array.join('').toString();
}
export async function checkDB(x: any) {
    console.log(x);

    const result = await client.query(`SELECT * from users where name = ${x}`);
    if (!result.rows[0]) {
        return false
    } else {
        return true
    }
}
export async function registerGoogle(x: any, y: any) {

    let newY = y.slice(1, y.length - 1)

    await client.query('INSERT INTO users (name,password) values ($1,$2)', [x, newY])
}

export async function registerDB(x: any, y: any) {
    let newX = x.slice(1, x.length - 1)
    let newY = y.slice(1, y.length - 1)

    await client.query('INSERT INTO users (name,password) values ($1,$2)', [newX, newY])
}
export async function checkPassword(x: any, y: any) {
    const result = await client.query(`SELECT * from users where name = ${x}`);
    console.log(result.rows[0].password)
    if (`'${result.rows[0].name}'` == x && `'${result.rows[0].password}'` == y) {
        return true
    } else {
        return false
    }
}