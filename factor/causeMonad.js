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
const cat = fp.flowRight(printV, readFile)
const r = cat("package.json")
console.log(r) // => IO { _value: [Function] }
// 此时得到的r为：IO(IO(v)) 内部_value对应的[Function]返回结果就是io函子
// 解析：
// 1.flowRight组合了readFile和printV
// 2.readFile返回的是一个io函子对象
// 3.printV中的v是readFile返回的io函子
// 4.所以printV中保存的值就是readFile返回的io函子
// 5.因此cat得到的是执行readFile和printV之后的IO(IO(v))

// 那我们如何获取到我们想要的最终的值呢？
console.log(r._value()._value()) // => 输出package.json
// 我们可以通过连续调用_value()方法获取到我们想要的，这用起来很不方便
// 如何解决呢？Monad函子！
