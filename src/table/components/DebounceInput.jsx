import React, { useEffect, useState } from "react";

export const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
	const [value, setValue] = useState(initialValue);

	const handleInputChange = (e) => setValue(e.target.value);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value]);

	return <input {...props} value={value} onChange={handleInputChange} />;
};

export default DebouncedInput;
