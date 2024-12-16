import axios from 'axios'
import React, { useState } from 'react'
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
		<div style={windowStyle}>
			<div>
				<ControlBar />
				{/* <div className='pingButton' onClick={() => ping(0)}>
					get 'hi' in log
				</div>

				<div className='pingButton' onClick={() => ping(1)}>
					click to get log
				</div> */}
			</div>
		</div>
	)
}

const controlBar: React.CSSProperties = {
	width: '100%',
	height: '90px',
	backgroundColor: 'lightblue',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: '0 20px',
}

const ControlBar: React.FC<{}> = () => {
	const [quantity, setQuantity] = useState([0, 0])
	const handleBoreQuantityChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'] =
		event => {
			if (Number(event.target.value) >= 0) {
				setQuantity((prevQuantity: any[]) => [
					Number(event.target.value),
					prevQuantity[1],
				])
				// boreQuantity = [...Array(Number(quantity)).keys()]
				// console.log(boreQuantity)
			}
		}
	const handleTimeQuantityChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'] =
		event => {
			if (Number(event.target.value) >= 0) {
				setQuantity((prevQuantity: any[]) => [
					prevQuantity[0],
					Number(event.target.value),
				])
				// boreQuantity = [...Array(Number(quantity)).keys()]
				// console.log(boreQuantity)
			}
		}

	return (
		<>
			<div style={controlBar}>
				<div>
					Введите количество скважин
					<input
						min={0}
						max={100}
						defaultValue={0}
						type='number'
						onChange={handleBoreQuantityChange}
					/>
				</div>
				<div>
					Введите количество временных промежутков
					<input
						min={0}
						max={50}
						defaultValue={0}
						type='number'
						onChange={handleTimeQuantityChange}
					/>
				</div>
				<UploadFile />
			</div>
			<SettingsBox quantity={quantity} />
			<Req />
		</>
	)
}

// let options = []
function SettingsBox(props: any) {
	let boreQuantity = [
		[...Array(props.quantity[0]).keys()],
		[...Array(props.quantity[1]).keys()],
	]
	const [boreLimits, addBoreLimit] = useState(Object)
	const addLimit = (boreNumber: number) => {
		addBoreLimit((prevLimits: any[]) => ({
			...prevLimits,
			[boreNumber]: ((prevLimits[boreNumber] || 0) + 1) % 2,
		}))
		console.log(boreLimits)
		// addBoreLimit()
		// boreQuantity = [...Array(Number(quantity)).keys()]
		// console.log(boreQuantity)
	}

	return (
		<div style={settingsBoxes}>
			{boreQuantity[0].map(bore => {
				return (
					<div style={boxStyle}>
						Скважина {bore + 1}
						<label className='switch'>
							<input type='checkbox'></input>
							<span
								className='slider round'
								onClick={() => addLimit(bore)}
							></span>
						</label>
					</div>
				)
			})}
			{boreQuantity[1].map(bore => {
				return (
					<div style={boxDateStyle}>
						Промежуток {bore + 1}
						<input type='date'></input>
						<input type='date'></input>
						Ограничение
						<input
							min={0}
							max={100}
							defaultValue={0}
							type='number'
							// onChange={''}
						/>
					</div>
				)
			})}
		</div>
	)
}

function Req() {
	const [item, setItem] = useState({
		name: '',
		description: '',
		price: 0,
		tax: 0,
	})

	const handleChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'] =
		e => {
			const { name, value } = e.target

			setItem(prevItem => ({
				...prevItem,
				[name]: value,
			}))
		}

	const handleSubmit: React.InputHTMLAttributes<HTMLFormElement>['onSubmit'] =
		async e => {
			e.preventDefault()

			try {
				const response = await axios.post('http://0.0.0.0:8080/q/', item)

				console.log('Success:', response.data)
			} catch (error) {
				console.error('Error:', error)
			}
		}

	return (
		<div>
			<h1>Create Item</h1>

			<form onSubmit={handleSubmit}>
				<input
					type='text'
					name='name'
					placeholder='Item Name'
					value={item.name}
					onChange={handleChange}
					required
				/>

				<input
					type='text'
					name='description'
					placeholder='Description'
					value={item.description}
					onChange={handleChange}
				/>

				<input
					type='number'
					name='price'
					placeholder='Price'
					value={item.price}
					onChange={handleChange}
					required
				/>

				<input
					type='number'
					name='tax'
					placeholder='Tax'
					value={item.tax}
					onChange={handleChange}
				/>

				<button type='submit'>Submit</button>
			</form>
		</div>
	)
}

const boxStyle: React.CSSProperties = {
	width: '200px',
	height: '90px',
	backgroundColor: 'lightblue',
	borderRadius: '10px',
	border: '1px solid grey',
	borderColor: 'grey',
	padding: '10px',
	margin: '10px',
	position: 'inherit',
}

const boxDateStyle: React.CSSProperties = {
	width: '200px',
	height: '160px',
	backgroundColor: 'lightblue',
	borderRadius: '10px',
	border: '1px solid grey',
	borderColor: 'grey',
	padding: '10px',
	margin: '10px',
}

const settingsBoxes: React.CSSProperties = {
	borderRadius: '10px',

	padding: '10px',
	margin: '10px',
	display: 'grid',
	gridTemplateColumns: 'repeat(6, 1fr)',
}

const windowStyle: React.CSSProperties = {
	margin: '0% 3%',
}

function UploadFile(props: any) {
	const [file, setFile] = useState<File | null>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0])
		}
	}
	// const handleSubmit: React.InputHTMLAttributes<HTMLFormElement>['onSubmit'] =
	// 	async e => {
	// 		e.preventDefault()

	// 		try {
	// 			const response = await axios.post('http://0.0.0.0:8080/q/', item)

	// 			console.log('Success:', response.data)
	// 		} catch (error) {
	// 			console.error('Error:', error)
	// 		}
	// 	}
	const handleUpload: React.InputHTMLAttributes<HTMLButtonElement>['onClick'] =
		async () => {
			if (file) {
				console.log('Uploading file...')

				const formData = new FormData()
				formData.append('file', file)

				try {
					const result = await fetch('http://0.0.0.0:8080/uploadfile/', {
						method: 'POST',
						body: formData,
					})
					const data = await result.json()
					console.log(data)
				} catch (error) {
					console.error(error)
				}
			}
		}
	return (
		<>
			<div className='input-group'>
				<input
					id='file'
					accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					type='file'
					onChange={handleFileChange}
				/>
			</div>
			{file && (
				<section>
					File details:
					<ul>
						<li>Name: {file.name}</li>
						<li>Type: {file.type}</li>
						<li>Size: {file.size} bytes</li>
					</ul>
				</section>
			)}
			{file && (
				<button onClick={handleUpload} className='submit'>
					Запуск модуля подгонки
				</button>
			)}
		</>
	)
}

// const Upload: React.FC<{}> = ({ onUpload }) => {
// 	const id = useId()
// 	return (
// 		<label htmlFor='id'>
// 			<input type='file' id={id} />
// 		</label>
// 	)
// }
