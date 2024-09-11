export interface Room {
	id: string;
	creator_username: string;
	current_players: number;
	max_players: number;
	currency_type: string;
	max_buy_in: number;
	small_blind: number;
	big_blind: number;
	creator_id: string;
	button_seat: number;
}

export interface UserData {
	user_id: string;
	rooms: Room[];
	form: any; // Adjust this type based on your form structure
}

export interface Player {
	// Define the structure of a player object
	player_id: string;
	username: string;
	stack: number;
	current_wager: number;
	seat_number: number;
	sitting_out: boolean;
	has_cards: boolean;
	room_id: string;
}
