import React from "react";
// import "./CalcButton.css";

class CalcButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			opacityFX: 0,
			selected: false
		};
	}

	componentDidMount() {
		const { btnType, btnValue } = this.props;
		if (btnType === "operator" && btnValue !== "0")
			this.setState({ operator: true });
		document.addEventListener("click", this.onClick);
		document.addEventListener("keydown", this.onKeyPress);
	}

	onClick = event => {
		const { btnValue } = this.props;
		if (event.target.id === btnValue) {
			this.btnAnimate();
		}
	};

	onKeyPress = event => {
		const { btnValue } = this.props;
		if (event.key === btnValue) {
			this.btnAnimate();
		}
	};

	btnAnimate = () => {
		this.setState({ opacityFX: 1.0 });
		let interval = 0.0625;
		let time = 17;
		const opacityFXLoop = setInterval(() => {
			if (this.state.opacityFX <= 0) {
				clearInterval(opacityFXLoop);
			} else {
				this.setState({ opacityFX: this.state.opacityFX - interval });
			}
		}, time);
	};

	helperFX() {
		const { btnValue, selectedBtn, btnType } = this.props;
		let classString = "btn-fx";
		if (btnValue === "0") classString += " btn-zero";
		if (
			btnValue === selectedBtn &&
			btnType === "operator" &&
			btnValue !== "="
		)
			classString += " btn-selected";
		return (
			<div
				className={classString}
				style={{
					background: `rgba(255, 255, 255, ${this.state.opacityFX}`
				}}
				id={btnValue}
			/>
		);
	}

	render() {
		const { btnValue, btnType } = this.props;
		return (
			<div
				className={`btn-calc btn-calc-${btnType}`}
				onClick={this.onClick}>
				<p>{btnValue}</p>
				{this.helperFX()}
			</div>
		);
	}
}

export default CalcButton;
