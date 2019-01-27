import React from "react";
import "./App.css";
import "./CalcButton.css";
import "./DisplayArea.css";
import CalcButton from "./CalcButton";
import DisplayArea from "./DisplayArea";
import CalculatorOperations from "./CalculatorOperations";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedBtn: "",
			displayString: "0",
			displayNumObj: {},
			isNextInputNewOperand: true,
			runningTotal: {},
			operand: {},
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
			Backspace: () => this.backspace(),
			c: () => this.clear(),
			n: () => this.togglePosNeg(),
			"+/-": () => this.togglePosNeg(),
			"%": () => this.toPercentage(),
			p: () => this.toPercentage()
		};

		this.Calc = new CalculatorOperations();
		// console.log(
		// 	this.Calc.optimizeFraction({
		// 		numerator: 7404566174000593,
		// 		denominator: 9107616394020732
		// 	})
		// );
		this.resultArr = [];
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

		// console.table(this.state);
	}

	addInputNum = key => {
		const { displayString, isNextInputNewOperand } = this.state;
		let tempState = { displayString: displayString };

		if (isNextInputNewOperand)
			tempState = {
				...tempState,
				isNextInputNewOperand: false,
				displayString: ""
			};

		if (tempState.displayString.length < 20) {
			displayString[0] === "0" && displayString.length === 1
				? (tempState = { ...tempState, displayString: key })
				: (tempState = {
						...tempState,
						displayString: tempState.displayString + key
				  });
		}

		tempState = {
			...tempState,
			displayNumObj: this.Calc.toNumObj(tempState.displayString)
		};

		this.setState(tempState);
	};

	backspace = () => {
		let { displayString, isNextInputNewOperand } = this.state;
		let tempState = {};
		if (!isNextInputNewOperand) {
			if (displayString.toString().length > 1) {
				tempState = {
					...tempState,
					displayString: displayString.toString().slice(0, -1)
				};
			} else {
				tempState = { ...tempState, displayString: "0" };
			}
		}

		tempState = {
			...tempState,
			displayNumObj: this.Calc.toNumObj(tempState.displayString)
		};

		this.setState(tempState);
	};

	addDecimal = () => {
		let { displayString } = this.state;
		if (displayString.indexOf(".") < 0) {
			displayString += ".";
			this.setState({
				displayString,
				displayNumObj: this.Calc.toNumObj(displayString)
			});
		}
	};

	addOperator = newOperator => {
		const { displayNumObj, operator } = this.state;

		let tempState = {
			operator: newOperator,
			msg: newOperator,
			isNextInputNewOperand: true
		};

		if (!operator) {
			tempState = {
				...tempState,
				runningTotal: displayNumObj
			};
		}

		this.setState(tempState);
	};

	calculate = () => {
		console.log("calc called");
		let {
			operator,
			displayNumObj,
			runningTotal,
			operand,
			isNextInputNewOperand
		} = this.state;

		let tempState = {};
		let result = null;
		let firstNum = runningTotal;
		let secondNum = null;

		if (isNextInputNewOperand && operator) {
			secondNum = operand;
		} else {
			secondNum = displayNumObj;
			tempState = { ...tempState, operand: secondNum };
		}

		console.log("set first and second num");

		switch (operator) {
			case "/":
				try {
					if (this.Calc.toFloat(secondNum) === 0)
						throw new Error("Cannot divide by 0");
					console.log("calling divide method...");
					console.table(this.state);
					result = this.Calc.divide(firstNum, secondNum);
				} catch (err) {
					tempState = {
						...tempState,
						msg: err.message,
						isNextInputNewOperand: true,
						runningTotal: null,
						operand: null
					};
				}
				break;
			case "x":
				result = this.Calc.multiply(firstNum, secondNum);
				break;
			case "-":
				result = this.Calc.subtract(firstNum, secondNum);
				break;
			case "+":
				result = this.Calc.add(firstNum, secondNum);
				break;
			default:
				//no default
				break;
		}

		console.log("operation performed");

		tempState = {
			...tempState,
			runningTotal: result,
			displayNumObj: result,
			displayString: this.Calc.toFloat(result).toString(),
			isNextInputNewOperand: true
		};

		this.setState(tempState);
		// this.resultArr.push([result.numerator, result.denominator]);
		// console.table(this.resultArr);
	};

	clear = () => {
		this.setState({
			displayString: "0",
			displayNumObj: {},
			operator: "",
			msg: "",
			isNextInputNewOperand: false
		});
	};

	togglePosNeg = () => {
		let { displayNumObj } = this.state;
		let result = this.Calc.multiply(displayNumObj, this.Calc.toNumObj(-1));
		this.setState({
			displayString: this.Calc.toFloat(result),
			displayNumObj: result
		});
	};
	toPercentage = () => {
		let { displayNumObj } = this.state;
		let result = this.Calc.divide(displayNumObj, this.Calc.toNumObj(100));
		this.setState({
			displayString: this.Calc.toFloat(result),
			displayNumObj: result
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
						displayString={this.state.displayString}
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
