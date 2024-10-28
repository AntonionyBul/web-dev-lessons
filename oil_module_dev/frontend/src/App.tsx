import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from './pages/About'
import Home from './pages/Home'
import Layout from './pages/Layout'

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<Home />} />
					<Route path='about' element={<About />} />

					{/* <Route path="*" element={<App />} /> */}
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
