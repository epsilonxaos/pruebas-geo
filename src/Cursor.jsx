import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./css/cursor.css";

function App() {
	const [mousePosition, setMousePosition] = useState({
		x: 0,
		y: 0,
	});
	const [cursorVariant, setCursorVariant] = useState("default");

	useEffect(() => {
		const mouseMove = (e) => {
			setMousePosition({
				x: e.clientX,
				y: e.clientY,
			});
		};

		window.addEventListener("mousemove", mouseMove);

		return () => {
			window.removeEventListener("mousemove", mouseMove);
		};
	}, []);

	const variants = {
		default: {
			x: mousePosition.x - 16,
			y: mousePosition.y - 16,
			backgroundColor: "white",
		},
		text: {
			height: 150,
			width: 150,
			x: mousePosition.x - 75,
			y: mousePosition.y - 75,
			// x: mousePosition.x - 16,
			// y: mousePosition.y - 16,
			backgroundColor: "white",
			mixBlendMode: "difference",
		},
		btn: {
			height: 0,
			width: 0,
			// x: mousePosition.x - 75,
			// y: mousePosition.y - 75,
			x: mousePosition.x - 16,
			y: mousePosition.y - 16,
			backgroundColor: "white",
			color: "green",
			mixBlendMode: "overlay",
			duration: 0,
		},
	};

	const punteroBotones = () => setCursorVariant("btn");
	const punteroTextos = () => setCursorVariant("text");
	const punteroNormal = () => setCursorVariant("default");

	return (
		<main className="bg-black text-center p-8">
			<div className="App">
				<h1 onMouseEnter={punteroTextos} onMouseLeave={punteroNormal} className="title">
					Hello World
				</h1>
			</div>

			<button onMouseEnter={punteroBotones} onMouseLeave={punteroNormal} className="bg-white text-black px-2 py-6 hover:bg-sky-400 hover:text-black">
				Probando
			</button>
			<motion.div className="cursor" variants={variants} animate={cursorVariant} />
		</main>
	);
}

export default App;
