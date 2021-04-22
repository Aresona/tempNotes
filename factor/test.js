// function test() {
// 	let a = []
// 	return function (b) {
// 		a.push(b)
// 		console.log(a)
// 	}
// }
//
// let a = test()
// let b = test()
// a(1)
// a(33)
// b(2)
//
// let compose = (...args) => (value) => args.reverse().reduce((acc, fn) => fn(acc), value)

//  normal functor
class Container {
	static of(value) {
		return new Container(value)
	}

	constructor(value) {
		this._value = value
	}

	map(fn) {
		return Container.of(fn(this._value))
	}
}

let r = Container.of(5)
	.map((x) => x + 2)
	.map((x) => x * x)
console.log(r)

// Either functor
class Left {
	static of(value) {
		return new Left(value)
	}
	constructor(value) {
		this._value = value
	}
	map(fn) {
		return this
	}
}

class Right {
	static of(value) {
		return new Right(value)
	}
	constructor(value) {
		this._value = value
	}
	map(fn) {
		return Right.of(fn(this._value))
	}
}

let r1 = Right.of(12).map((x) => x + 2)
let r2 = Left.of(12).map((x) => x + 2)

function parseJson(str) {
	try {
		return Right.of(JSON.parse(str))
	} catch (e) {
		return Left.of({ error: e.message })
	}
}

let r = parseJson("{name: zs}").map((x) => x.name.toUpperCase())
console.log(r)

// IO functor
const fp = require("lodash/fp")

class IO {
	static of(value) {
		return new IO(function () {
			return value
		})
	}
	constructor(fn) {
		this._value = fn
	}

	map(fn) {
		// return a functor
		return IO.of(fp.flowRight(fn, this._value))
	}
}

let r = IO.of(process).map((p) => p.execPath)
console.log(r)
