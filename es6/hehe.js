var elements = [{}, {}, {}]

for (var i = 0; i < elements.length; i++) {
	elements[i].onclick = (function (i) {
		return function () {
			console.log(i)
		}
	})(i)
}

elements[1].onclick()

console.log(Object.is(NaN, NaN))
console.log(Object.is(+0, -0))

const person = {
	name: "zzz",
	age: 20
}

const proxy = new Proxy(person, {
	get(target, property) {
		return Reflect.get(target, property)
	}
})

class Person {
	constructor(name) {
		this.name = name
	}
	say() {
		console.log(`hi, my name is ${this.name}`)
	}
}

class Student extends Person {
	constructor(name, number) {
		super(name)
		this.number = number
	}

	hello() {
		super.say()
		console.log(`my school number is ${this.number}`)
	}
}

const s = new Set()
s.add(1).add(2).add(3).add(2)
s.forEach((i) => console.log(i))

for (let i of s) {
	console.log(i)
}

console.log(s.size)
console.log(s.has(2))
console.log(s.delete(100))
s.clear() // remove all

//const arr = [1, 2, 3, 3]
//let result = new Set(arr)
//result = Array.from(result)
//result = [...result]

const m = new Map()
const tom = { name: "tom" }
m.set(tom, 90)
console.log(m)
m.forEach((value, key) => console.log(key, value))
console.log(m.get(tom))
console.log(m.delete(tom))
console.log(m.clear())
console.log(m.has(tom))

const s1 = Symbol.for("foo")
const s2 = Symbol.for("foo")
console.log(s1 === s2)

console.log(Symbol.iterator)
console.log(Symbol.hasInstance)

// const todos = {
// 	life: ["eat", "study", "sleep"],
// 	learn: ["english", "math", "compute"],
// 	work: ["tea"],
// 	each: function (callback) {
// 		const all = [].concat(this.life, this.learn, this.work)
// 		for (const item of all) {
// 			callback(item)
// 		}
// 	},
// 	[Symbol.iterator]: function () {
// 		const all = [...this.life, ...this.learn, ...this.work]
// 		let index = 0
// 		return {
// 			next: function () {
// 				return {
// 					value: all[index],
// 					done: index++ >= all.length
// 				}
// 			}
// 		}
// 	}
// }
//
// todos.each(function (item) {
// 	console.log(item)
// })

// console.log("-------------")
// for (const item of todos) {
// 	console.log(item)
// }

function* foo() {
	console.log("hehe")
	return 120
}

const result = foo()
console.log(result)
console.log(result.next())

function* bar() {
	console.log("111")
	yield 100
	console.log("222")
	yield 200
	console.log("333")
	yield 300
}

const generator = bar()
console.log(generator.next())
console.log(generator.next())
console.log(generator.next())

function* createIdMaker() {
	let id = 1
	while (true) {
		yield id++
	}
}

const idMaker = createIdMaker()
console.log(idMaker.next().value)

const todos = {
	life: ["eat", "study", "sleep"],
	learn: ["english", "math", "compute"],
	work: ["tea"],
	[Symbol.iterator]: function* () {
		const all = [...this.life, ...this.learn, ...this.work]
		for (const item of all) {
			yield item
		}
	}
}

const oo = {
	foo: "value1",
	bar: "value2"
}

console.log(Object.values(oo))
console.log(Object.entries(oo))
for (const [key, value] of Object.entries(oo)) {
	console.log(key, value)
}

console.log(new Map(Object.entries(oo)))

console.log(Object.getOwnPropertyDescriptors)

const p1 = {
	firstName: "lei",
	lastName: "wang",
	get fullName() {
		return this.firstName + this.lastName
	}
}
let p2 = Object.assign({}, p1)
p2.firstName = "hehe"
console.log(p2.fullName)

const descriptors = Object.getOwnPropertyDescriptors(p1)
p2 = Object.defineProperties({}, descriptors)
p2.firstName = "hah"
console.log(p2.fullName)

const books = {
	html: 4,
	css: 6,
	javascript: 128
}

for (const [name, count] of Object.entries(books)) {
	console.log(`${name.padEnd(16, "-")}|${count.toString().padStart(3, "0")}`)
}

function foo(bar, baz) {}
