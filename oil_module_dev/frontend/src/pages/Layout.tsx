/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import '../App.css'

const navigation: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'space-around',
	width: '100%',
	backgroundColor: '#9797978c',
	padding: '10px 0',
	borderBottom: '2px solid #000',
	fontSize: '1rem',
}

const navButton: React.CSSProperties = {
	background: 'none',
	border: '1px solid #000',
	padding: '10px 20px',
	cursor: 'pointer',
	fontSize: '18px',
}

export default function Layout() {
	return (
		<div>
			<nav style={navigation}>
				<Link to='/'>
					<button style={navButton}>Home</button>
				</Link>
				<Link to='/about'>
					<button style={navButton}>About</button>
				</Link>
			</nav>

			<Outlet />
		</div>
	)
}
