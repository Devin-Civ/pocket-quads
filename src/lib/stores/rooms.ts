import { writable } from 'svelte/store';
import type { Room } from '$lib/types';

export const roomsStore = writable<Room[]>([]);
