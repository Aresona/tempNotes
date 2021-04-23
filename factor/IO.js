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
	map(fn) {
		return new IO(fp.flowRight(fn, this._value))
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
const cat = fp.flowRight(printV, readFile)
const r = cat("package.json")
console.log(r._value()._value())
