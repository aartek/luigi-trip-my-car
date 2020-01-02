


export function ExpenseComponent(props) {
    return (
        <React.Fragment>
            <td className="fd-table__cell"><input name={'part-' + props.id} className="fd-input" type="text" placeholder="Part" value={props.expense.part} onChange={(e) => props.changeHandler(props.idx, 'part', e)} minLength="1" maxLength="280"></input></td>
            <td className="fd-table__cell"><input className="fd-input" type="number" placeholder="Distance in kilometers" value={props.expense.distance} onChange={(e) => props.changeHandler(props.idx, 'distance', e)} min="0" max="5000000" step="1"></input></td>
            <td className="fd-table__cell"><input className="fd-input" type="number" placeholder="Price" value={props.expense.price} onChange={(e) => props.changeHandler(props.idx, 'price', e)} min="0" max="5000000" step="1"></input></td>
        </React.Fragment>
    )
}
