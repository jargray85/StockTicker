import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Price = (props) => {
    // API key
    const apiKey = 'c70eede2154ffd89e1d9381562d4ed23'

    // grab stock symbol from URL params
    const {symbol} = useParams()
    console.log(symbol)
    const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`

    const [stock, setStock] = useState(null)

    const getStock = async () => {
        // fetch api
        const response = await fetch(url)
        // get info
        const data = await response.json()
        // use data info to set state
        console.log(data)

        for (let i = 0; i < data.length; i++) {
            setStock(data[i])
        }
    }

    useEffect(() => {
        getStock()
    }, [])

    const Loaded = () => {
        return (
            <div>
                <h1>{stock.name}/{stock.symbol}</h1>
                <h2>Price: {stock.price}</h2>
                <h2>Day High: {stock.dayHigh}</h2>
                <h2>Day Low: {stock.dayLow}</h2>
                <h2>Change: {stock.change}</h2>
                <h2>Year High: {stock.yearHigh}</h2>
                <h2>Year Low: {stock.yearLow}</h2>
            </div>
        )
    }

    const Loading = () => <h1>Loading...</h1>

    return stock ? <Loaded /> : <Loading />
}

export default Price