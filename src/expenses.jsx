
import React, { Component } from 'react';
import { ExpenseComponent } from './expense.jsx'
import * as uuid from 'uuid/v4'
import * as LuigiClient from '@kyma-project/luigi-client'
export class Expense {

    constructor(id, part, distance, price) {
        this.id = id
        this.part = part
        this.distance = distance
        this.price = price
    }
}

export class ExpensesComponent extends Component {
    constructor(props) {
        super(props);
        this.carService = props.carService
        this.state = {
            expenses: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.init()
    }

    async init() {
        LuigiClient.uxManager().showLoadingIndicator()
        this.carId = await this.carService.getOrCreateCar()
        const expenses = await this.carService.getExpenses(this.carId) || []
        expenses.push(new Expense(uuid(), '', '', ''))
        this.setState({ expenses })
        LuigiClient.uxManager().hideLoadingIndicator()
    }

    handleChange(idx, fieldName, event) {
        const newExpenses = this.state.expenses.slice()
        const val = event.target.type === 'number' && event.target.value !== '' ? parseFloat(event.target.value) : event.target.value
        newExpenses[idx][fieldName] = val

        const last = newExpenses[newExpenses.length - 1]
        if (last.part && last.distance > 0 && last.price > 0) {
            newExpenses.push(new Expense(uuid(), '', '', ''))
        }
        this.setState({ expenses: newExpenses })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.carService.saveExpenses(this.carId, this.state.expenses)
        LuigiClient.uxManager().showAlert({text: 'Saved sucessfully', type: 'success', closeAfter: 3000})
    }

    handleDelete(idx) {
        const expenses = this.state.expenses.slice()
        expenses.splice(idx, 1)
        this.setState({ expenses })
    }

    displayButton(idx, expenses) {
        if (idx < expenses.length - 1) {
            return (
                <button type="button" className="fd-button" onClick={() => this.handleDelete(idx)}>Delete</button>
            )
        }

    }

    renderExpenses() {
        return (
            this.state.expenses.map((expense, idx, expenses) => {
                return (
                    <tr className="fd-table__row" key={expense.id}>
                        <ExpenseComponent expense={expense} idx={idx} changeHandler={this.handleChange} />
                        <td>
                            {this.displayButton(idx, expenses)}
                        </td>
                    </tr>
                )
            })
        )
    }

    render() {
        return (
            <div>
                <form className="fd-has-margin-top-l" name="form" onSubmit={this.handleSubmit}>
                    <table className="fd-table">
                        <thead className="fd-table__header">
                            <tr className="fd-table__row">
                                <th className="fd-table__cell" scope="col">Part</th>
                                <th className="fd-table__cell" scope="col">Kilometers</th>
                                <th className="fd-table__cell" scope="col">Price</th>
                                <th className="fd-table__cell" scope="col"></th>
                            </tr>
                        </thead>
                        <tbody className="fd-table__body">
                            {this.renderExpenses()}
                        </tbody>
                    </table>
                    <div>
                        <button type="submit" className="fd-button">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}