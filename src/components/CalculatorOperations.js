export default class CalculatorOperations {
	getPrecision = inputNum => {
		if (!isFinite(inputNum) || inputNum === "") return 0;
		let factor = 1,
			precision = 0,
			num = parseFloat(inputNum);
		while (
			typeof num === "number" &&
			Math.round(num * factor) / factor !== num
		) {
			factor *= 10;
			precision++;
		}
		return precision;
	};

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
		let precision = this.getPrecision(floatNum),
			factorOfTen = Math.pow(10, precision);

		return this.optimizeFraction({
			numerator: Math.round(floatNum * factorOfTen),
			denominator: factorOfTen
		});
	};

	toFloat = num => {
		return num.numerator / num.denominator;
	};

	makeSameDenominator = arr => {
		let [a, b] = arr,
			factor = null;

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
			let aFactor = b.denominator,
				bFactor = a.denominator;
			a.denominator *= aFactor;
			a.numerator *= aFactor;
			b.denominator *= bFactor;
			b.numerator *= bFactor;
		}
		return [a, b];
	};

	getLargerNumber = arr => {
		let [a, b] = arr;
		a = Math.abs(a);
		b = Math.abs(b);

		if (a > b) {
			return [a, b];
		} else {
			return [b, a];
		}
	};

	getGCD = arr => {
		let [largerNumber, smallerNumber] = this.getLargerNumber(arr);
		if (smallerNumber === 0 || largerNumber === 0) return 1;
		if (largerNumber % smallerNumber === 0) {
			return smallerNumber;
		} else {
			largerNumber %= smallerNumber;
			return this.getGCD([largerNumber, smallerNumber]);
		}
	};

	optimizeFraction = num => {
		let { numerator, denominator } = num;

		if (numerator === 0) {
			return { numerator: 0, denominator: 1 };
		} else {
			let greatestCommonDivisor = this.getGCD([numerator, denominator]);
			return {
				numerator: numerator / greatestCommonDivisor,
				denominator: denominator / greatestCommonDivisor
			};
		}
	};

	divide = (a, b) => {
		let firstNum = a,
			secondNum = b;

		return this.optimizeFraction({
			numerator: firstNum.numerator * secondNum.denominator,
			denominator: firstNum.denominator * secondNum.numerator
		});
	};

	multiply = (a, b) => {
		let firstNum = a,
			secondNum = b;

		return this.optimizeFraction({
			numerator: firstNum.numerator * secondNum.numerator,
			denominator: firstNum.denominator * secondNum.denominator
		});
	};

	subtract = (a, b) => {
		let firstNum = a,
			secondNum = b;

		[firstNum, secondNum] = this.makeSameDenominator([firstNum, secondNum]);
		return this.optimizeFraction({
			numerator: firstNum.numerator - secondNum.numerator,
			denominator: firstNum.denominator
		});
	};

	add = (a, b) => {
		let firstNum = a,
			secondNum = b;
		[firstNum, secondNum] = this.makeSameDenominator([firstNum, secondNum]);
		return this.optimizeFraction({
			numerator: firstNum.numerator + secondNum.numerator,
			denominator: firstNum.denominator
		});
	};
}
