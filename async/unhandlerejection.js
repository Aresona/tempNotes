window.addEventListener(
	"unhandledrejection",
	(event) => {
		const { reason, promise } = event
		console.log(reason, promise)
		// reason => promise failed cuase, is a error object
		// promise => which promise is wrong
		event.preventDefault()
	},
	false
)

process.on("unhandledrejection", (reason, promise) => {
	console.log(reason, promise)
})

function* main() {
	try {
		const users = yield ajax("hehe")
		console.log("users")
	} catch (e) {
		console.log(e)
	}
}

const g = main()
const result = g.next()
result.value.then((data) => {
	g.next(data)
})

function handleResult(result) {
	if (result.done) return
	result.value.then(
		(data) => {
			handleResult(g.next(data))
		},
		(error) => {
			g.throw(error)
		}
	)
}

handleResult(g.next())

function co(generator) {
	const g = generator()
	function handleResult(result) {
		if (result.done) return
		result.value.then(
			(data) => {
				handleResult(g.next(data))
			},
			(error) => {
				g.throw(error)
			}
		)
	}

	handleResult(g.next())
}
