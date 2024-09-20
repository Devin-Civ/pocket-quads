export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			heartbeats: {
				Row: {
					last_heartbeat: string | null;
					player_id: string;
				};
				Insert: {
					last_heartbeat?: string | null;
					player_id: string;
				};
				Update: {
					last_heartbeat?: string | null;
					player_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'heartbeats_player_id_fkey';
						columns: ['player_id'];
						isOneToOne: true;
						referencedRelation: 'players';
						referencedColumns: ['player_id'];
					}
				];
			};
			messages: {
				Row: {
					content: string;
					created_at: string;
					message_id: string;
					room_id: string;
					user_id: string | null;
					username: string | null;
				};
				Insert: {
					content: string;
					created_at?: string;
					message_id?: string;
					room_id: string;
					user_id?: string | null;
					username?: string | null;
				};
				Update: {
					content?: string;
					created_at?: string;
					message_id?: string;
					room_id?: string;
					user_id?: string | null;
					username?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'messages_room_id_fkey';
						columns: ['room_id'];
						isOneToOne: false;
						referencedRelation: 'rooms';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'messages_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					}
				];
			};
			player_cards: {
				Row: {
					card_1: string | null;
					card_2: string | null;
					player_id: string;
					updated_at: string;
				};
				Insert: {
					card_1?: string | null;
					card_2?: string | null;
					player_id: string;
					updated_at?: string;
				};
				Update: {
					card_1?: string | null;
					card_2?: string | null;
					player_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'player_cards_player_id_fkey';
						columns: ['player_id'];
						isOneToOne: true;
						referencedRelation: 'players';
						referencedColumns: ['player_id'];
					}
				];
			};
			players: {
				Row: {
					current_wager: number | null;
					has_cards: boolean;
					joined_at: string;
					player_id: string;
					room_id: string | null;
					seat_number: number | null;
					sitting_out: boolean;
					stack: number | null;
					username: string | null;
				};
				Insert: {
					current_wager?: number | null;
					has_cards?: boolean;
					joined_at?: string;
					player_id: string;
					room_id?: string | null;
					seat_number?: number | null;
					sitting_out?: boolean;
					stack?: number | null;
					username?: string | null;
				};
				Update: {
					current_wager?: number | null;
					has_cards?: boolean;
					joined_at?: string;
					player_id?: string;
					room_id?: string | null;
					seat_number?: number | null;
					sitting_out?: boolean;
					stack?: number | null;
					username?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'players_player_id_fkey';
						columns: ['player_id'];
						isOneToOne: true;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'players_room_id_fkey';
						columns: ['room_id'];
						isOneToOne: false;
						referencedRelation: 'rooms';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'players_username_fkey';
						columns: ['username'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['username'];
					}
				];
			};
			profiles: {
				Row: {
					avatar_url: string | null;
					full_name: string | null;
					id: string;
					last_heartbeat: string | null;
					silver: number;
					updated_at: string | null;
					username: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					full_name?: string | null;
					id: string;
					last_heartbeat?: string | null;
					silver?: number;
					updated_at?: string | null;
					username?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					full_name?: string | null;
					id?: string;
					last_heartbeat?: string | null;
					silver?: number;
					updated_at?: string | null;
					username?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'profiles_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			room_cards: {
				Row: {
					deck: string[] | null;
					id: string;
					muck: string[] | null;
				};
				Insert: {
					deck?: string[] | null;
					id: string;
					muck?: string[] | null;
				};
				Update: {
					deck?: string[] | null;
					id?: string;
					muck?: string[] | null;
				};
				Relationships: [
					{
						foreignKeyName: 'rooms_cards_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'rooms';
						referencedColumns: ['id'];
					}
				];
			};
			rooms: {
				Row: {
					big_blind: number;
					button_seat: number;
					created_at: string;
					creator_id: string | null;
					creator_username: string;
					currency_type: string | null;
					current_players: number | null;
					id: string;
					max_buy_in: number;
					max_players: number;
					min_buy_in: number;
					shared_cards: string[] | null;
					small_blind: number;
				};
				Insert: {
					big_blind: number;
					button_seat?: number;
					created_at?: string;
					creator_id?: string | null;
					creator_username?: string;
					currency_type?: string | null;
					current_players?: number | null;
					id?: string;
					max_buy_in: number;
					max_players?: number;
					min_buy_in: number;
					shared_cards?: string[] | null;
					small_blind: number;
				};
				Update: {
					big_blind?: number;
					button_seat?: number;
					created_at?: string;
					creator_id?: string | null;
					creator_username?: string;
					currency_type?: string | null;
					current_players?: number | null;
					id?: string;
					max_buy_in?: number;
					max_players?: number;
					min_buy_in?: number;
					shared_cards?: string[] | null;
					small_blind?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'rooms_creator_id_fkey';
						columns: ['creator_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'rooms_creator_username_fkey';
						columns: ['creator_username'];
						isOneToOne: true;
						referencedRelation: 'profiles';
						referencedColumns: ['username'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			bring_flop: {
				Args: {
					p_room_id: string;
				};
				Returns: undefined;
			};
			build_deck: {
				Args: Record<PropertyKey, never>;
				Returns: string[];
			};
			check_for_stale_heartbeats: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			check_user_exists: {
				Args: {
					s_email: string;
				};
				Returns: boolean;
			};
			cleanup_between_hands: {
				Args: {
					in_room_id: string;
				};
				Returns: undefined;
			};
			fold_cards: {
				Args: {
					in_player_id: string;
				};
				Returns: undefined;
			};
			join_room: {
				Args: {
					in_room_id: string;
					in_player_id: string;
					in_buy_in: number;
				};
				Returns: undefined;
			};
			leave_room: {
				Args: {
					in_player_id: string;
					in_room_id: string;
				};
				Returns: undefined;
			};
			pass_button: {
				Args: {
					room_id_input: string;
				};
				Returns: undefined;
			};
			reverse_button: {
				Args: {
					in_room_id: string;
				};
				Returns: undefined;
			};
			shuffle_and_deal: {
				Args: {
					room_id_input: string;
				};
				Returns: undefined;
			};
			update_heartbeat: {
				Args: {
					p_player_id: string;
				};
				Returns: undefined;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;
