export default class CalculatorOperations {
	getPrecision = inputNum => {
		if (!isFinite(inputNum) || inputNum === "") return 0;

		let factor = 1;
		let precision = 0;
		let num = parseFloat(inputNum);

		while (
			typeof num === "number" &&
			Math.round(num * factor) / factor !== num
		) {
			factor *= 10;
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
				if (!isFinite(num) || typeof num !== "number")
					throw new Error("Invalid Number");
				let thisPrecision = this.getPrecision(num);
				if (thisPrecision > highestPrecision)
					highestPrecision = thisPrecision;
			});
			return Math.pow(10, highestPrecision);
		} catch (err) {
			console.log(err);
		}
	};

	toNumObj = floatNum => {
		let resultNum = {
			numerator: null,
			denominator: null
		};
		let precision = this.getPrecision(floatNum);
		let factorOfTen = Math.pow(10, precision);

		resultNum.numerator = Math.round(floatNum * factorOfTen);
		resultNum.denominator = factorOfTen;
		resultNum = this.optimizeFraction(resultNum);

		return resultNum;
	};

	toFloat = num => {
		return num.numerator / num.denominator;
	};

	makeSameDenominator = arr => {
		let [a, b] = arr;
		let factor = null;

		if (a.denominator === b.denominator) {
		} else if (a.denominator % b.denominator === 0) {
			factor = a.denominator / b.denominator;
			b.denominator *= factor;
			b.numerator *= factor;
		} else if (b.denominator % a.denominator === 0) {
			factor = b.denominator / a.denominator;
			a.denominator *= factor;
			a.numerator *= factor;
		} else {
			let aFactor = b.denominator;
			let bFactor = a.denominator;
			a.denominator *= aFactor;
			a.numerator *= aFactor;
			b.denominator *= bFactor;
			b.numerator *= bFactor;
		}
		return [a, b];
	};

	getLargerNumber = arr => {
		let [a, b] = arr;
		let largerNumber = null;
		let smallerNumber = null;

		if (a > b) {
			largerNumber = a;
			smallerNumber = b;
		} else {
			largerNumber = b;
			smallerNumber = a;
		}
		return [largerNumber, smallerNumber];
	};

	getGCD = arr => {
		let [largerNumber, smallerNumber] = this.getLargerNumber(arr);
		let result = null;
		if (largerNumber % smallerNumber === 0) {
			result = smallerNumber;
		} else {
			largerNumber %= smallerNumber;
			this.getGCD([largerNumber, smallerNumber]);
		}

		return result;
	};

	optimizeFraction = num => {
		let { numerator, denominator } = num;
		let greatestCommonDivisor = this.getGCD([numerator, denominator]);
		let result = {
			numerator: numerator / greatestCommonDivisor,
			denominator: denominator / greatestCommonDivisor
		};
		return result;
	};

	divide = (a, b) => {
		let firstNum = a;
		let secondNum = b;
		let resultNum = {
			numerator: null,
			denominator: null
		};

		resultNum.numerator = firstNum.numerator * secondNum.denominator;
		resultNum.denominator = firstNum.denominator * secondNum.numerator;

		resultNum = this.optimizeFraction(resultNum);
		console.table(resultNum);

		return resultNum;
	};

	multiply = (a, b) => {
		let firstNum = a;
		let secondNum = b;
		let resultNum = {
			numerator: null,
			denominator: null
		};

		resultNum.numerator = firstNum.numerator * secondNum.numerator;
		resultNum.denominator = firstNum.denominator * secondNum.denominator;

		resultNum = this.optimizeFraction(resultNum);

		return resultNum;
	};

	subtract = (a, b) => {
		let firstNum = a;
		let secondNum = b;
		let resultNum = {
			numerator: null,
			denominator: null
		};
		[firstNum, secondNum] = this.makeSameDenominator([firstNum, secondNum]);

		resultNum.numerator = firstNum.numerator - secondNum.numerator;
		resultNum.denominator = firstNum.denominator;

		resultNum = this.optimizeFraction(resultNum);

		return resultNum;
	};

	add = (a, b) => {
		let firstNum = a;
		let secondNum = b;
		let resultNum = {
			numerator: null,
			denominator: null
		};
		[firstNum, secondNum] = this.makeSameDenominator([firstNum, secondNum]);
		resultNum.numerator = firstNum.numerator + secondNum.numerator;
		resultNum.denominator = firstNum.denominator;

		resultNum = this.optimizeFraction(resultNum);

		return resultNum;
	};
}
