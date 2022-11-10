import { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

const BASE_URL = `https://api.exchangerate.host/latest`;

function App() {
	const [currencyOptions, setCurrencyOptions] = useState([]);
	const [fromCurrency, setFromCurrency] = useState();
	const [toCurrency, setToCurrency] = useState();
	const [exchangeRate, setExchangeRate] = useState();
	const [amount, setAmount] = useState(1);
	const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

	let toAmount, fromAmount;
	if (amountInFromCurrency) {
		fromAmount = amount;
		toAmount = parseFloat(amount * exchangeRate).toFixed(2);
	} else {
		toAmount = amount;
		fromAmount = parseFloat(amount / exchangeRate).toFixed(2);
	}

	useEffect(() => {
		fetch(BASE_URL)
			.then((res) => res.json())
			.then((data) => {
				const baseCurrency = Object.keys(data.rates).find(
					(usd) => usd === 'USD'
				);
				const firstCurrency = Object.keys(data.rates).find(
					(bdt) => bdt === 'BDT'
				);

				setCurrencyOptions([...Object.keys(data.rates)]);
				setFromCurrency(baseCurrency);
				setToCurrency(firstCurrency);
				setExchangeRate(data.rates[firstCurrency]);
			});
	}, []);

	useEffect(() => {
		if (fromCurrency != null && toCurrency != null) {
			fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
				.then((res) => res.json())
				.then((data) => setExchangeRate(data.rates[toCurrency]));
		}
	}, [fromCurrency, toCurrency]);

	function handleFromAmountChange(e) {
		setAmount(e.target.value);
		setAmountInFromCurrency(true);
	}

	function handleToAmountChange(e) {
		setAmount(e.target.value);
		setAmountInFromCurrency(false);
	}

	return (
		<main className="container">
			<h2>
				<i className="fa-solid fa-coins"></i> Currency Converter
			</h2>
			<hr />
			<div className="converter">
				<CurrencyRow
					currencyOptions={currencyOptions}
					selectedCurrency={fromCurrency}
					onChangeCurrency={(e) => setFromCurrency(e.target.value)}
					onChangeAmount={handleFromAmountChange}
					amount={fromAmount}
				/>
				<div className="loader">
					{amountInFromCurrency ? (
						<i className="fa-solid fa-angles-down"></i>
					) : (
						<i className="fa-solid fa-angles-up"></i>
					)}
				</div>
				<CurrencyRow
					currencyOptions={currencyOptions}
					selectedCurrency={toCurrency}
					onChangeCurrency={(e) => setToCurrency(e.target.value)}
					onChangeAmount={handleToAmountChange}
					amount={toAmount}
				/>
			</div>
		</main>
	);
}

export default App;
