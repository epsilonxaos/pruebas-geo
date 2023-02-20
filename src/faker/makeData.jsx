import { faker } from '@faker-js/faker/locale/es_MX';

function createRandomUser() {
	return {
		name: faker.name.firstName(),
		lastName: faker.name.lastName(),
		age: faker.datatype.number({ min: 10, max: 100 }),
		email: faker.internet.email(),
		status: faker.internet.httpStatusCode(),
		progress: faker.random.numeric(2)
	}
}

export function getmakeData (maxLeng) {
	maxLeng = maxLeng || 25;
	const users = [];

	Array.from({ length: maxLeng }).forEach(() => {
		users.push(createRandomUser());
	});

	return users;
}