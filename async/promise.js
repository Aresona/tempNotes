const promise = new Promise(function (resolve, reject) {
	//
	resolve(100)
	reject(new Error("promise rejected"))
})

promise.then(
	function (value) {
		console.log(value)
	},
	function (error) {
		console.log("rejected", error)
	}
)
