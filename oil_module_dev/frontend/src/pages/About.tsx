import React from 'react'
import '../App.css'

export default function About() {
	return (
		<>
			<Introduction />
			<ScrollWithCandle />
		</>
	)
}

const Introduction: React.FC<{}> = () => {
	return (
		<div style={introBoxStyle}>
			<div style={introTextBoxStyle}>
				Команда занимающаяся созданием модуля подгонки под уровни добычи нефти
			</div>
		</div>
	)
}

const ScrollWithCandle: React.FC<{}> = () => {
	return (
		<>
			<div style={boxStyle}>
				<div style={textBoxStyle}>
					<div className='firstPar' style={firstParagraphs}>
						<p style={aboutAuthors}>Булах Антон</p>
					</div>
					<div className='firstPar' style={firstParagraphs}>
						<p style={aboutAuthors}>Куценко Лев</p>
					</div>
					<div className='firstPar' style={firstParagraphs}>
						<p style={aboutAuthors}>Радомская Алина</p>
					</div>
				</div>
			</div>
		</>
	)
}

const introBoxStyle: React.CSSProperties = {
	backgroundImage:
		'linear-gradient(90deg, rgba(0, 55, 55, 1.5), rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))',
	width: '100%',
	height: '455px',
	margin: 0,
	display: 'flex',
}

const introTextBoxStyle: React.CSSProperties = {
	margin: '7% 5% 0 5%',
	fontStyle: '',
	fontSize: '6rem',
	color: 'white',
	fontFamily: 'cursive',
	textAlign: 'center',
}

const boxStyle: React.CSSProperties = {
	backgroundImage:
		'linear-gradient(90deg, rgba(0, 55, 55, 1.5), rgba(0, 0, 0, 1), rgba(0, 0, 15, 1))',
	width: '100%',
	height: '442px',
	display: 'flex',
}

const textBoxStyle: React.CSSProperties = {
	height: '25%',
	margin: '100px 140px 100px 320px',
	display: 'flex',
}

const firstParagraphs: React.CSSProperties = {
	height: '200px',
	width: '200px',
	margin: '100px',
	alignContent: 'center',
	alignItems: 'center',
	display: 'center',
}

const aboutAuthors: React.CSSProperties = {
	padding: '35px',
	textAlign: 'center',
}
