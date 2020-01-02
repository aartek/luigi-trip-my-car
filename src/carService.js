import * as uuid from 'uuid/v4'
import {
    ExpensesComponent,
    Expense
} from './expenses.jsx'

export class CarService {


    constructor(database, userId) {
        this.database = database
        this.userId = userId
    }

    async getOrCreateCar() {
        const carsRef = await this.database.ref(`users/${this.userId}/cars`).once('value')
        console.log('cars', carsRef.val())
        if (!carsRef.val() || !Object.keys(carsRef.val()).length) {
            const newCarUuid = uuid();
            await database.ref(`users/${this.userId}/cars/${newCarUuid}`).set({
                name: "My car"
            })
            return newCarUuid
        } else {
            return Object.keys(carsRef.val())[0]
        }
    }

    async getExpenses(carId) {
        const ref = this.database.ref(`users/${this.userId}/expenses`)
        const expensesResponse = await ref.orderByChild('car').equalTo(carId).once('value')
        const expenses = expensesResponse.val() || {};
        return (Object.keys(expenses)).map(expenseKey => {
            const expense = expenses[expenseKey]
            return new Expense(expenseKey, expense.part, expense.distance, expense.price)
        })
    }

    async saveExpenses(carId, expenses) {
        const toSave = {}
        expenses
            .filter(expense => expense.id && expense.part && expense.price > 0 && expense.distance > 0 )
            .forEach(expense => {
                toSave[expense.id] = {
                    ...expense,
                    car: carId
                }
            })
        console.log('to save', toSave)
        return await this.database.ref(`users/${this.userId}/expenses`).set(toSave)
    }


}