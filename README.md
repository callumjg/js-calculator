# JS Calculator

A simple calculator made with React.<br>

## Installation

In the project directory, install the project dependencies by running:<br>

### `npm install`

Then run the application in development mode to try it in on your local machine:<br>

### `npm run dev`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.<br>

The page will reload if you make edits.<br>
You will also see any lint errors in the console.<br>

## Rounding Inaccuracies

To prevent rounding inaccuracies, operands are stored in state as <b>fractions</b> where both the numerator and denominator are integers.<br>

For example `1.2` is stored behind the scenes as `12/10` and `0.123` is stored as `123/1000`.<br>

When a value is displayed to the user, the decimal value is displayed.<br>

This prevents rounding inaccuracies where a number cannot accurately be expressed as a decimal value (such as 7/22 or 2/3).<br>

Where the user divides 1 by 3, for example, the result is stored as a fraction of integers `i.e. 1/3` - and then displayed to the user in decimal format `i.e. 0.33333...`<br>

In this way, any future operations calculated on the result of the initial calculation are performed on the fraction and not the rounded decimal value.

## Euclidean's Algorithm

Of course, the above approach results in stored fractions quickly becoming quite large. <br>

Euclidean's algorithm is used to reduce fractions to their smallest possible size to avoid fractions escalating in size after successive operations. <br>

For example, if the user enters `2.6 divided by 3.45`, this would be calculated in the following manner: <br>

1. The operands are stored in state as fractions of integers. The calculator then calculates `26/10 divided by 345/100`, the result being `2600/3450`.
2. Next, the result is converted to its simplest form which is `52/69` and this is stored in state.
3. The result is displayed to the user as a decimal value `0.7536...`.
4. Any successive operations are then performed on the result, as stored in state, in its fractional form `52/69`.

## Largest safe integer

Nominally small inaccuracies may be introduced, however, if the numerator or denominator of a stored value exceeds the maximum safe integer available in JavaScript. If so, small inaccuracies can be expected.<br>
