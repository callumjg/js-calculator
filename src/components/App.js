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
			displayNumObj: { numerator: 0, denominator: 1 },
			isNextInputNewOperand: true,
			runningTotal: { numerator: 0, denominator: 1 },
			operand: { numerator: 0, denominator: 1 },
			operator: ""
		};
	}

	componentDidMount() {
		this.calc = new CalculatorOperations();
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
			"x": () => this.addOperator("x"),
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
			console.log(err);
			this.setState({ msg: err.message });
		}
	}

	addInputNum = key => {
		let { displayString, isNextInputNewOperand } = this.state;

		displayString = displayString.toString();
		if (isNextInputNewOperand) displayString = "";
		if (displayString.length < 20) {
			displayString += key;
		}
		if (
			displayString.toString()[0] === "0" &&
			displayString.indexOf(".") === -1 &&
			displayString.length > 1
		) {
			displayString = displayString.slice(1, displayString.length);
		}

		this.setState({
			isNextInputNewOperand: false,
			displayNumObj: this.calc.toNumObj(displayString),
			displayString: displayString
		});
	};

	backspace = () => {
		let { displayString, isNextInputNewOperand } = this.state,
			newDisplayString;

		if (!isNextInputNewOperand) {
			if (displayString.toString().length > 1) {
				newDisplayString = displayString.toString().slice(0, -1);
				this.setState({
					displayNumObj: this.calc.toNumObj(newDisplayString),
					displayString: newDisplayString
				});
			} else {
				this.setState({
					displayNumObj: this.calc.toNumObj(0),
					displayString: "0"
				});
			}
		}
	};

	addDecimal = () => {
		let { displayString } = this.state;
		if (displayString.indexOf(".") < 0) {
			displayString += ".";
			this.setState({
				displayString,
				displayNumObj: this.calc.toNumObj(displayString)
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
		let {
				operator,
				displayNumObj,
				runningTotal,
				operand,
				isNextInputNewOperand
			} = this.state,
			tempState = {},
			result = null,
			firstNum = runningTotal,
			secondNum = null;

		if (isNextInputNewOperand && operator) {
			secondNum = operand;
		} else {
			secondNum = displayNumObj;
			tempState = { ...tempState, operand: displayNumObj };
		}

		if (operator) {
			switch (operator) {
				case "/":
					try {
						if (this.calc.toFloat(secondNum) === 0) {
							throw new Error("Cannot divide by 0");
						}
						result = this.calc.divide(firstNum, secondNum);
					} catch (err) {
						result = { numerator: 0, denominator: 1 };
						tempState = {
							...tempState,
							msg: err.message
						};
					}
					break;
				case "x":
					result = this.calc.multiply(firstNum, secondNum);
					break;
				case "-":
					result = this.calc.subtract(firstNum, secondNum);
					break;
				case "+":
					result = this.calc.add(firstNum, secondNum);
					break;
				default:
					//no default
					break;
			}
			tempState = {
				...tempState,
				runningTotal: result,
				displayNumObj: result,
				displayString: this.calc.toFloat(result).toString(),
				isNextInputNewOperand: true
			};
		}
		this.setState(tempState);
	};

	clear = () => {
		this.setState({
			displayString: "0",
			displayNumObj: { numerator: 0, denominator: 1 },
			operand: { numerator: 0, denominator: 1 },
			runningTotal: { numerator: 0, denominator: 1 },
			operator: "",
			msg: "",
			isNextInputNewOperand: false
		});
	};

	togglePosNeg = () => {
		let { displayNumObj } = this.state,
			result = this.calc.multiply(displayNumObj, this.calc.toNumObj(-1));
		this.setState({
			displayString: this.calc.toFloat(result),
			displayNumObj: result
		});
	};

	toPercentage = () => {
		let { displayNumObj } = this.state,
			result = this.calc.divide(displayNumObj, this.calc.toNumObj(100));
		this.setState({
			displayString: this.calc.toFloat(result),
			displayNumObj: result
		});
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
						btnValue="x"
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
