import React from "react";
// import "./DisplayArea.css";

class DisplayArea extends React.Component {
	
	
	checkFontSize = () =>{
		const {displayValue} = this.props;
		let newFontSize = 68;
		

		if(displayValue && displayValue.toString().length > 8){
			let numOfChar = displayValue.toString().length;
			newFontSize = Math.round((490 * (Math.pow(numOfChar, -0.95)))*10)/10;
		}
		// console.log(`Char: ${displayValue.toString().length}, fontsize: ${newFontSize}`)
		return newFontSize
	}

	render(){
		const {msg, displayValue} = this.props;
		return (
		<div className="calc-display">
			<div className="calc-display-operation">{msg}</div>
			<div className="calc-display-value">
				<p style = {{fontSize:this.checkFontSize() + 'px'}}>{displayValue}</p>
			</div>
		</div>
	)
}
};

export default DisplayArea;
