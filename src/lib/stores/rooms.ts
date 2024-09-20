import { writable } from 'svelte/store';
import type { Room } from '$lib/types/general';

export const roomsStore = writable<Room[]>([]);
export const currentRoomStore = writable<Room | null>(null);
