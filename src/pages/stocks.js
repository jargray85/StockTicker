import React from 'react'
import { Link } from 'react-router-dom'

const Stocks = () => {

    const stocks = [
        {name: "Apple Inc.", symbol: "AAPL",},
        {name: "Microsoft Corporation", symbol: "MSFT"},
        {name: "Alphabet Inc.", symbol: "GOOGL"},
        {name: "Facebook, Inc.", symbol: "FB"},
        {name: "Oracle Corporation", symbol: "ORCL"},
        {name: "Intel Corporation", symbol: "INTL"}
    ]

    return (
        <div className='stocks'>
            {stocks.map((stock) => {
                const {name, symbol} = stock
                return (
                    <Link to={`/price/${symbol}`} key={symbol} >
                        <h2>{name}</h2>
                    </Link>
                )
            })}
        </div>
    )
}

export default Stocks