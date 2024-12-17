import axios from 'axios'
import React, { useState } from 'react'
import '../App.css'

// async function ping(n: number) {
// 	let response: any
// 	if (n) {
// 		response = await fetch('http://localhost:8080/todo')
// 	} else {
// 		response = await fetch('http://localhost:8080')
// 	}

// 	console.log(await response.json())
// }

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
	const [quantity, setQuantity] = useState(0)
	const handleBoreQuantityChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'] =
		event => {
			if (Number(event.target.value) >= 0) {
				setQuantity(Number(event.target.value))
			}
		}

	return (
		<>
			<div style={controlBar}>
				<UploadFile />

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
			</div>
			<SettingsBox quantity={quantity} />
			{/* <Req /> */}
			<MyForms />
		</>
	)
}

function UploadFile() {
	const [file, setFile] = useState<File | null>(null)

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0])
		}
	}
	const handleUpload: React.InputHTMLAttributes<HTMLButtonElement>['onClick'] =
		async () => {
			if (file) {
				console.log('Uploading file...')
				const formData = new FormData()
				formData.append('file', file)

				try {
					const result = await fetch('http://0.0.0.0:8080/uploadfiles/', {
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
				<button onClick={handleUpload} className='submit'>
					Запуск модуля подгонки
				</button>
			)}
		</>
	)
}

const MyForms = () => {
	const [formsData, setFormsData] = useState([
		{
			date1: '',
			date2: '',
			number: 0,
		},
	])

	const handleChange = (
		index: number,
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { name, value } = e.target

		const updatedForms = formsData.map((form, i) =>
			i === index ? { ...form, [name]: value } : form
		)

		setFormsData(updatedForms)
	}

	const addForm = () => {
		setFormsData([
			...formsData,
			{
				date1: '',
				date2: '',
				number: 0,
			},
		])
		console.log(formsData)
	}

	const removeForm = (index: number) => {
		const updatedForms = formsData.filter((_, i) => i !== index)

		setFormsData(updatedForms)
	}

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault()

		let data = JSON.stringify(formsData)

		try {
			const response = await axios.post(
				'http://0.0.0.0:8080/uploadlimits',
				data
			)

			console.log('Success:', response.data)
		} catch (error) {
			console.error('Error:', error)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			{formsData.map((form, index) => (
				<div
					key={index}
					style={{
						marginBottom: '20px',
						border: '1px solid #ccc',
						padding: '10px',
					}}
				>
					<h3>Промежуток {index + 1}</h3>
					<div>
						<label>
							Начало:
							<input
								type='date'
								name='date1'
								value={form.date1}
								onChange={e => handleChange(index, e)}
							/>
						</label>
					</div>
					<div>
						<label>
							Конец:
							<input
								type='date'
								name='date2'
								value={form.date2}
								onChange={e => handleChange(index, e)}
							/>
						</label>
					</div>

					<div>
						<label>
							Ограничение:
							<input
								type='number'
								name='number1'
								value={form.number}
								onChange={e => handleChange(index, e)}
							/>
						</label>
					</div>

					<button type='button' onClick={() => removeForm(index)}>
						Удалить форму
					</button>
				</div>
			))}

			<button type='button' onClick={addForm}>
				Добавить форму
			</button>

			<button type='submit'>Отправить</button>
		</form>
	)
}

function SettingsBox(props: any) {
	let boreQuantity = [...Array(props.quantity).keys()]
	const [boreLimits, addBoreLimit] = useState(Object)
	const addLimit = (boreNumber: number) => {
		addBoreLimit((prevLimits: any[]) => ({
			...prevLimits,
			[boreNumber]: ((prevLimits[boreNumber] || 0) + 1) % 2,
		}))
		console.log(boreLimits)
	}

	return (
		<>
			<form>
				<div style={settingsBoxes}>
					{boreQuantity.map(bore => {
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
				</div>
				<button type='submit'>Submit</button>
			</form>
		</>
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
			let g = JSON.stringify([
				{
					date1: '2024-12-18',
					date2: '2024-12-20',
					number1: '1111',
					number2: '2222',
				},
			])
			try {
				const response = await axios.post('http://0.0.0.0:8080/q/', g)

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
