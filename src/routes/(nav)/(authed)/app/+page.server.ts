const testRooms = [{ name: 'DCiv', max_players: 9, players: [] }];

export const load = async () => {
	return { rooms: testRooms };
};

export const actions = {
	createRoom: async () => {
		console.log('Creating lobby');
	}
};
