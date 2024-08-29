import { redirect } from '@sveltejs/kit';

export type joinRequest = {
	room_id: string;
	buy_in: number;
	user_id: number;
};

export default async function joinRoom({ room_id, buy_in, user_id }: joinRequest) {
	return redirect(302, `/app/rooms/${room_id}`);
}
