export async function fetchDataGeo() {
	var myHeaders = new Headers();
		myHeaders.append("token", " eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NzQ4Mzk5MzIsIm5iZiI6MTY3NDgzOTkzMiwiaWRzZXNpb24iOiI0Mzk2MzA1In0.N6Dh4KnJ5_xq842ZA8zLKVpOjvzbrGJWWgC-pPdQrSM");

	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};

	const response = await fetch("https://geoportal.merida.gob.mx/api/proyecto/getDatosCapaDocumento/a85a1750c4129fb5ef30c14b188784a8/datos", requestOptions)
	const json = await response.json();

	console.log(json);
	
	if(json) {
		const newJson = []
		json.features.forEach(({properties}) => {
			newJson.push(properties)
		});

		return {features: newJson};
	}
	  
}