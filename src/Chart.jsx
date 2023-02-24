import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { faker } from "@faker-js/faker/locale/es_MX";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function App() {
	const options = {
		indexAxis: "y",
		maintainAspectRatio: true,
		elements: {
			bar: {
				borderWidth: 2,
			},
		},
		responsive: true,
		plugins: {
			legend: false,
			title: {
				display: true,
				text: "Chart.js Horizontal Bar Chart",
			},
		},
	};

	const labels = ["January", "February", "March", "January", "February", "March", "April", "May", "June", "July", "January", "February", "March", "January", "February", "March", "April", "May", "June", "July", "January", "February", "March", "January", "February", "March", "April", "May", "June", "July", "January", "February", "March", "January", "February", "March", "April", "May", "June", "July", "January", "February", "March", "January", "February", "March", "April", "May", "June", "July", "January", "February", "March"];

	const data = {
		labels,
		datasets: [
			{
				label: ["Datos"],
				data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
				borderColor: "rgb(53, 162, 235)",
				backgroundColor: "rgba(53, 162, 235, 0.5)",
				datalabels: {
					color: "#000",
					font: {
						weight: "600",
					},
				},
			},
		],
	};

	console.log(data);

	function getSizeY() {
		let h = 200;

		h = labels.length * 10;

		return h + "px";
	}

	return (
		<>
			<Bar options={options} data={data} height={getSizeY()} plugins={[ChartDataLabels]} />
		</>
	);
}
