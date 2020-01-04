import {
  Expense
} from './expenses.jsx'
import {
  Observable
} from 'rxjs'

export class CarService {

  constructor(database, userId) {
    this.database = database
    this.userId = userId
  }

  async getOrCreateCar() {
    const carsRef = await this.database.ref(`users/${this.userId}/cars`).once('value')
    if (!carsRef.val() || !Object.keys(carsRef.val()).length) {
      const res = await this.database.ref(`users/${this.userId}/cars`).push({
        name: "My car"
      })
      return res.key
    } else {
      return Object.keys(carsRef.val())[0]
    }
  }

  getExpenses(carId) {
    return new Observable(subscriber => {
      const ref = this.database.ref(`users/${this.userId}/expenses`)
      ref.orderByChild('car').equalTo(carId).on('value', (snapshot) => {
        const items = []
        snapshot.forEach(snapshot => {
          const expense = snapshot.val()
          items.push(new Expense(snapshot.key, expense.part, expense.distance, expense.price))
        })
        subscriber.next(items)
      })
    })
  }

  async saveExpenses(carId, expenses) {
    const toSave = {}
    expenses
      .filter(expense => expense.id && expense.part && expense.price > 0 && expense.distance > 0)
      .forEach(expense => {
        toSave[expense.id] = {
          ...expense,
          car: carId
        }
      })
    console.log('to save', toSave)
    return await this.database.ref(`users/${this.userId}/expenses`).set(toSave)
  }

  async generateExpenseId(){
    return (await this.database.ref(`users/${this.userId}/expenses`).push()).key
  }


}
