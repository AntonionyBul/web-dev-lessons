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
		<div style={{ margin: '0% 3%' }}>
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

const ControlBar: React.FC<{}> = () => {
	const [quantity, setQuantity] = useState(0)
	const handleBoreQuantityChange: React.InputHTMLAttributes<HTMLInputElement>['onChange'] =
		event => {
			if (Number(event.target.value) >= 0) {
				setQuantity(Number(event.target.value))
			}
		}

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

	let boreQuantity = [...Array(quantity).keys()]
	const [boreLimits, addBoreLimit] = useState(Object)
	const addLimit = (boreNumber: number) => {
		addBoreLimit((prevLimits: any[]) => ({
			...prevLimits,
			[boreNumber]: ((prevLimits[boreNumber] || 0) + 1) % 2,
		}))
	}

	return (
		<>
			<div style={controlBar}>
				1. Выберите файл
				<div style={{ marginLeft: '20px' }}>
					<input
						id='file'
						accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
						type='file'
						onChange={handleFileChange}
					/>
				</div>
				{file && (
					<div style={{ marginLeft: '30%' }}>
						2. Введите количество скважин
						<input
							style={{ marginLeft: '20px' }}
							min={0}
							max={100}
							defaultValue={0}
							type='number'
							onChange={handleBoreQuantityChange}
						/>
					</div>
				)}
			</div>
			{file && (
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
				</form>
			)}
			{/* <Req /> */}
			{file && <>3. Выберите даты и ограничения</>}
			{file ? <MyForms file={file} boreLimits={boreLimits} /> : null}
		</>
	)
}

const MyForms = (props: any) => {
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
		sendlimit()
		sendwells()
		e.preventDefault()
		sendfile()
	}
	let sendlimit = async () => {
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

	let sendwells = async () => {
		let data = JSON.stringify(props.boreLimits)

		try {
			const response = await axios.post('http://0.0.0.0:8080/uploadwells', data)

			console.log('Success:', response.data)
		} catch (error) {
			console.error('Error:', error)
		}
	}

	let sendfile = async () => {
		if (props.file) {
			console.log('Uploading file...')
			const formData = new FormData()
			formData.append('file', props.file)

			try {
				const result = await fetch('http://0.0.0.0:8080/uploadfiles/', {
					method: 'POST',
					body: formData,
				})
				const data = await result.json()
				console.log(data)
				get_file()
			} catch (error) {
				console.error(error)
			}
		}
	}
	let get_file = async () => {
		fetch('http://0.0.0.0:8080/file/download', {
			method: 'GET',
			headers: {
				'Content-Type':
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			},
		})
			.then(response => response.blob())
			.then(blob => {
				// Create blob link to download
				const url = window.URL.createObjectURL(new Blob([blob]))
				const link = document.createElement('a')
				link.href = url
				link.setAttribute('download', `output.xlsx`)

				// Append to html link element page
				document.body.appendChild(link)

				// Start download
				link.click()

				// Clean up and remove the link
				// link.parentNode.removeChild(link)
			})
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
								name='number'
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

const controlBar: React.CSSProperties = {
	width: '100%',
	height: '90px',
	backgroundColor: 'lightblue',
	display: 'flex',
	alignItems: 'center',
	padding: '0 20px',
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

const settingsBoxes: React.CSSProperties = {
	borderRadius: '10px',

	padding: '10px',
	margin: '10px',
	display: 'grid',
	gridTemplateColumns: 'repeat(6, 1fr)',
}
