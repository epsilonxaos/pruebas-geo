import { VscError } from "react-icons/vsc";
import { RxCheckCircled } from "react-icons/rx";
import * as YUP from "yup";

import { useState } from "react";

export default function App() {
	const [validate, setValidate] = useState(false);
	const [errors, setErrors] = useState({});
	const datos = {
		titulo: true,
		tipoTitulo: { value: "personalizado", label: "Personalizado" },
		tituloValue: "Primer",
		subtitulo: false,
		subtituloValue: "",
		agrupacion: true,
		agruparPor: { value: "nombre", label: "Nombre" },
		operacion: { value: "contar", label: "Contar" },
		operando: { value: "", label: "Seleccione una opción" },
		ordenarPorColumna: { value: "nombre", label: "Nombre" },
		orden: { value: "desc", label: "Descendente" },
		ordenTipo: "ordenar",
		etiquetaVertical: false,
		etiquetaVerticalValue: "",
		etiquetaHorizontal: false,
		etiquetaHorizontalValue: "",
	};

	function validateSettings() {
		let isValid = true;
		let error = {};

		if (datos.tipoTitulo.value === "personalizado") !datos.tituloValue && ((isValid = false), (error.tituloValue = true));
		if (datos.subtitulo) !datos.subtituloValue && ((isValid = false), (error.subtituloValue = true));
		if (datos.etiquetaVertical) !datos.etiquetaVerticalValue && ((isValid = false), (error.etiquetaVerticalValue = true));
		if (datos.etiquetaHorizontal) !datos.etiquetaHorizontalValue && ((isValid = false), (error.etiquetaHorizontalValue = true));

		if (datos.agrupacion) {
			if (datos.operacion.value !== "contar") !datos.operando.value && ((isValid = false), (error.operando = true));
		}

		setErrors(error);
		setValidate(isValid);
	}

	return (
		<div className="p-4">
			<pre className="text-sm mb-2 bg-gray-50">{JSON.stringify(datos, null, 4)}</pre>
			<p className="text-base font-semibold mb-3">
				Validado: <span>{!validate ? <VscError className="text-red-500 inline-block" /> : <RxCheckCircled className="text-green-500 inline-block" />}</span>
			</p>
			<div className="bg-red-300 text-sm mb-2">
				{errors?.tituloValue && <span className="text-red-800 font-semibold">Titulo Este campo es obligatorio</span>}
				{errors?.subtituloValue && <span className="text-red-800 font-semibold">subtitulo Este campo es obligatorio</span>}
			</div>
			<button className="px-4 py-1 bg-blue-500 text-white rounded" onClick={() => validateSettings()}>
				Validar
			</button>
		</div>
	);
}
