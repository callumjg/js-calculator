import React from "react";
import "./App.css";
import "./CalcButton.css";
import "./DisplayArea.css";
import CalcButton from "./CalcButton";
import DisplayArea from "./DisplayArea";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedBtn: "",
			displayValue: "0",
			isNextInputNewOperand: true,
			runningTotal: null,
			operand: null,
			operator: ""
		};
	}

	componentDidMount() {
		document.addEventListener("click", this.onInput.bind(this));
		document.addEventListener("keydown", this.onInput.bind(this));
		this.keyRouting = {
			"0": () => this.addInputNum("0"),
			"1": () => this.addInputNum("1"),
			"2": () => this.addInputNum("2"),
			"3": () => this.addInputNum("3"),
			"4": () => this.addInputNum("4"),
			"5": () => this.addInputNum("5"),
			"6": () => this.addInputNum("6"),
			"7": () => this.addInputNum("7"),
			"8": () => this.addInputNum("8"),
			"9": () => this.addInputNum("9"),
			".": () => this.addDecimal(),
			"/": () => this.addOperator("/"),
			"*": () => this.addOperator("x"),
			"-": () => this.addOperator("-"),
			"+": () => this.addOperator("+"),
			"=": () => this.calculate(),
			Enter: () => this.calculate(),
			c: () => this.clear(),
			n: () => this.togglePosNeg(),
			"+/-": () => this.togglePosNeg(),
			"%": () => this.toPercentage(),
			p: () => this.toPercentage()
		};
	}

	onInput(e) {
		let key = "";

		if (e.type === "keydown" && e.key !== "Shift") {
			this.setState({ selectedBtn: e.key });
			key = e.key;
		}

		if (e.type === "click") {
			this.setState({ selectedBtn: e.target.id });
			key = e.target.id;
		}

		try {
			if (this.keyRouting[key]) this.keyRouting[key]();
		} catch (err) {
			this.setState({ msg: "Error: " + err });
		}
	}

	addDecimal = () => {
		let { displayValue } = this.state;
		if (displayValue.indexOf(".") < 0) {
			this.setState({ displayValue: (displayValue += ".") });
		}
	};

	addInputNum = key => {
		const { displayValue, isNextInputNewOperand } = this.state;
		let tempState = { displayValue: displayValue };

		if (isNextInputNewOperand)
			tempState = {
				...tempState,
				isNextInputNewOperand: false,
				displayValue: ""
			};

		if (tempState.displayValue.length < 20) {
			displayValue[0] === "0" && displayValue.length === 1
				? (tempState = { ...tempState, displayValue: key })
				: (tempState = {
						...tempState,
						displayValue: tempState.displayValue + key
				  });
		}

		this.setState(tempState);
	};

	addOperator = newOperator => {
		const { displayValue, operator } = this.state;

		let tempState = {
			operator: newOperator,
			msg: newOperator,
			isNextInputNewOperand: true
		};

		if (!operator) {
			tempState = {
				...tempState,
				runningTotal: displayValue
			};
		}

		this.setState(tempState);
	};

	calculate = () => {
		let {
			operator,
			displayValue,
			runningTotal,
			operand,
			isNextInputNewOperand
		} = this.state;

		let tempState = {};
		let result = null;
		let firstNum = parseFloat(runningTotal);
		let secondNum = null;

		if (isNextInputNewOperand) {
			secondNum = parseFloat(operand);
		} else {
			secondNum = parseFloat(displayValue);
			tempState = { ...tempState, operand: parseFloat(displayValue) };
		}

		const factorOfTen = this.getFactorOfTen([firstNum, secondNum]);

		switch (operator) {
			case "/":
				result = this.divide(firstNum, secondNum, factorOfTen);
				break;
			case "x":
				result = this.multiply(firstNum, secondNum, factorOfTen);
				break;
			case "-":
				result = this.subtract(firstNum, secondNum, factorOfTen);
				break;
			case "+":
				result = this.add(firstNum, secondNum, factorOfTen);
				break;
			default:
				//no default
				break;
		}

		tempState = {
			...tempState,
			runningTotal: result,
			displayValue: result,
			isNextInputNewOperand: true
		};

		this.setState(tempState);
		console.log(`result: ${result}`);
	};

	divide = (firstNum, secondNum, factorOfTen) => {
		try {
			if (secondNum === 0) {
				throw new Error("Cannot divide by 0");
			}

			let result =
				Math.round(
					(Math.round(firstNum * factorOfTen) /
						Math.round(secondNum * factorOfTen)) *
						Math.pow(10, 16)
				) / Math.pow(10, 16);

			return result;
		} catch (err) {
			console.log(err);

			this.setState({
				msg: err.message,
				isNextInputNewOperand: true,
				runningTotal: null,
				operand: null
			});

			return 0;
		}
	};

	multiply = (firstNum, secondNum, factorOfTen) => {
		return (
			Math.round(
				Math.round(firstNum * factorOfTen) *
					Math.round(secondNum * factorOfTen)
			) / Math.pow(factorOfTen, 2)
		);
	};

	subtract = (firstNum, secondNum, factorOfTen) => {
		return (
			(Math.round(firstNum * factorOfTen) -
				Math.round(secondNum * factorOfTen)) /
			factorOfTen
		);
	};

	add = (firstNum, secondNum, factorOfTen) => {
		return (firstNum * factorOfTen + secondNum * factorOfTen) / factorOfTen;
	};

	clear = () => {
		this.setState({
			displayValue: "0",
			operator: "",
			msg: "",
			isNextInputNewOperand: false
		});
	};

	togglePosNeg = () => {
		this.setState({
			displayValue: (this.state.displayValue * -1).toString()
		});
	};
	toPercentage = () => {
		this.setState({
			displayValue: (this.state.displayValue / 100).toString()
		});
	};

	getPrecision = num => {
		if (!isFinite(num) || num === "") return 0;
		var e = 1,
			precision = 0;
		while (Math.round(num * e) / e !== num) {
			e *= 10;
			precision++;
		}
		return precision;
	};

	// returns factor of 10 required to convert to an integer
	// the number in an array with the most precision
	getFactorOfTen = arr => {
		if (arr.constructor !== Array) {
			arr = [arr];
		}

		let highestPrecision = null;

		try {
			let numArray = arr.map(num => parseFloat(num));
			numArray.forEach(num => {
				if (!isFinite(num) || typeof num != "number")
					throw new Error("Invalid Number");
				let thisPrecision = this.getPrecision(num);
				if (thisPrecision > highestPrecision)
					highestPrecision = thisPrecision;
			});
			return Math.pow(10, highestPrecision);
		} catch (err) {
			console.log(err);
			this.setState({ msg: err.message });
		}
	};

	render() {
		return (
			<div className="movable-container">
				<div className="calc-container">
					<DisplayArea
						operator={this.state.operator}
						msg={this.state.msg}
						displayValue={this.state.displayValue}
					/>
					<CalcButton
						btnValue="c"
						btnType="control"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="+/-"
						btnType="control"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="%"
						btnType="control"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="/"
						btnType="operator"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="7"
						btnType="num"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="8"
						btnType="num"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="9"
						btnType="num"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="*"
						btnType="operator"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="4"
						btnType="num"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="5"
						btnType="num"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="6"
						btnType="num"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="-"
						btnType="operator"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="1"
						btnType="num"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="2"
						btnType="num"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="3"
						btnType="num"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="+"
						btnType="operator"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="0"
						btnType="num btn-zero"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="."
						btnType="num"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
					<CalcButton
						btnValue="="
						btnType="operator"
						onInput={this.onInput}
						selectedBtn={this.state.selectedBtn}
					/>
				</div>
			</div>
		);
	}
}

export default App;
