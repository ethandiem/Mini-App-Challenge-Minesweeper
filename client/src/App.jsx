import "./App.css";
import { useState, useEffect } from "react";
import {Routes, Route} from "react-router-dom";
import Grid from "./Grid/Grid.jsx";

function App() {
	return (
	<>
		<h1 className = "title">Minesweeper</h1>
		<Grid />
	</>
	)
}

export default App;
