import { writable } from 'svelte/store';
import type { Room } from '$lib/types/general';

export const roomsStore = writable<Room[]>([]);
const createCurrentRoomStore = () => {
	const { subscribe, set, update } = writable<Room | null>(null);

	const refresh = async (supabaseClient, roomId: string) => {
		try {
			const { data, error } = await supabaseClient
				.from('rooms')
				.select('*')
				.eq('id', roomId)
				.single();

			if (error) {
				throw error;
			}

			set(data);
		} catch (error) {
			console.error('Error refreshing current room:', error);
		}
	};

	return {
		subscribe,
		set,
		update,
		refresh
	};
};

export const currentRoomStore = createCurrentRoomStore();
