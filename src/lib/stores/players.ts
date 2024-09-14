import { writable } from 'svelte/store';
import type { Player } from '../types';

export const playersStore = writable<Player[]>([]);
