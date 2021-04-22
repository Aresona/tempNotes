const fp = require("lodash/fp")
const fs = require("fs")
class IO {
	static of(value) {
		return new IO(function () {
			return value
		})
	}
	constructor(fn) {
		this._value = fn
	}

	// 我们需要在普通的IO函子中添加join方法
	join() {
		// 此处直接将当前函子的值(_value)返回(返回就是函子)
		return this._value()
	}

	map(fn) {
		return new IO(fp.flowRight(fn, this._value))
	}

	// 我们在使用Monad的时候需要将join和map结合使用
	// 此时我们再添加一个flatMap函数
	// flatMap函数的作用就是调用join和map函数将函子变扁
	flatMap(fn) {
		// fn供map使用
		return this.map(fn).join()
	}
}

// 使用IO函子读取文件(package.json)
const readFile = function (fileName) {
	return new IO(function () {
		// 此处我们使用同步读取
		return fs.readFileSync(fileName, "utf-8")
	})
}

const printV = function (v) {
	return new IO(function () {
		console.log(v)
		return v
	})
}

// 使用
// 分析：
// 此处的flatMap的作用是调用函子内部的map方法然后调用join方法
// 得到的是什么呢？
// 执行flatMap中map时是执行了printV，返回的是io函子，此时io函子是一个嵌套的函子，内部嵌套的是readFile返回的函子
// 调用flatMap中的join时返回了当前函子(printV汉子)保存的值(readFile函子)
// 紧接着在调用readFile函子中的join方法，此时返回的就是readFile返回函子存储的值(_value:读取文件的函数)的执行结果，也就是读取的文件的内容
const r = readFile("package.json").flatMap(printV).join()
console.log(r) // => package.json内容

// 如果在读取文件后，需要将内容中的字母转成大写
const upperR = readFile("package.json").map(fp.toUpper).flatMap(printV).join()
console.log(upperR) // => 大写的package.json内容
