const MyPromise = require("./promise")

let promise = new MyPromise((resolve, reject) => {
	setTimeout(() => {
		resolve("success")
	}, 2000)
})

promise.then(
	(value) => {
		console.log(value)
	},
	(reason) => {
		console.log(reason)
	}
)
