const fp = require("lodash/fp")
const inspect = require("util").inspect
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
	map(fn) {
		return new IO(fp.flowRight(fn, this._value))
	}
	join() {
		return this._value()
	}
	flatMap(fn) {
		return this.map(fn).join()
	}
}

// 使用ＩＯ函子读取文件

const readFile = function (fileName) {
	return new IO(function () {
		// 此处使用同步读取
		return fs.readFileSync(fileName, "utf-8")
	})
}
// readFile 函子
// {
// 	_value: function(){
// 		return fs.readFileSync(fileName, 'utf-8')
// 		}
// }
//

const printV = function (v) {
	return new IO(function () {
		console.log(v)
		return v
	})
}

// printV 函子
//{
//	_value: function(){
//v = {
//	_value: function(){
//		return fs.readFileSync('package.json', 'utf-8')
//		}
//	}
//		console.log(v) // readFile函子
//		return v
//		}
//}

// 使用
// const cat = fp.flowRight(printV, readFile)
// const r = cat("package.json")
// console.log(r._value()._value())

// monad使用
const upperR = readFile("package.json").map(fp.toUpper).flatMap(printV)
console.log(upperR)
//const upperR = readFile("package.json").map(fp.toUpper).flatMap(printV).join()
// 1 readFile("package.json")
//console.log(inspect(readFile("package.json")))
//console.log(readFile("package.json")._value.toString())
//{ _value:
//function () {
//                // 此处使用同步读取
//                return fs.readFileSync(fileName, "utf-8")
//        }
//        }
// 2 map(fp.toUpper)
// console.log(inspect(readFile("package.json").map(fp.toUpper)))
// console.log(readFile("package.json").map(fp.toUpper)._value)
// {
// 	_value: fp.flowRight(fp.toUpper, () => fs.readFileSync('package.json')),
// 	map(){},
// 	join(){},
// 	flatMap(){}
// }
// 3 flatMap(printV):
// 31 map(printV)
// {
//	_value: fp.flowRight(printV, fp.flowRight(fp.toUpper, () => fs.readFileSync('package.json'))),
//	join(){},
//	map(){},
//	flatMap(){}
// }
// 32 join()
//	 fp.flowRight(printV, fp.flowRight(fp.toUpper, () => fs.readFileSync(fileName)))('package.json')
//
// console.log(inspect(readFile("package.json").map(fp.toUpper).flatMap(printV)))
//console.log(readFile("package.json").map(fp.toUpper).flatMap(printV)._value().toString())
//console.log(readFile("package.json").map(fp.toUpper).flatMap(printV).join())
//
