import '../App.css'

async function ping(n: number) {
	let response: any
	if (n) {
		response = await fetch('http://localhost:8080/todo')
	} else {
		response = await fetch('http://localhost:8080')
	}

	console.log(await response.json())
}

export default function Home() {
	return (
		<>
			<div className='pingButton' onClick={() => ping(0)}>
				get 'hi' in log
			</div>

			<div className='pingButton' onClick={() => ping(1)}>
				click to get log
			</div>
		</>
	)
}
