import type { RequestEvent } from '@sveltejs/kit';

export function handleLoginRedirect(
	event: RequestEvent,
	message: string = 'You must be logged in to access this page!'
) {
	const redirectTo = event.url.pathname + event.url.search;
	return `/auth?redirectTo=${encodeURIComponent(redirectTo)}&message=${encodeURIComponent(message)}`;
}

class Node<T> {
	value: T;
	next: Node<T> | null = null;

	constructor(value: T) {
		this.value = value;
	}
}

export class LinkedListQueue<T> {
	private head: Node<T> | null = null;
	private tail: Node<T> | null = null;
	private length: number = 0;

	enqueue(item: T): void {
		const node = new Node(item);
		if (this.tail) {
			this.tail.next = node;
		}
		this.tail = node;
		if (!this.head) {
			this.head = node;
		}
		this.length++;
	}

	dequeue(): T | undefined {
		if (!this.head) {
			return undefined;
		}
		const value = this.head.value;
		this.head = this.head.next;
		if (!this.head) {
			this.tail = null;
		}
		this.length--;
		return value;
	}

	isEmpty(): boolean {
		return this.length === 0;
	}

	size(): number {
		return this.length;
	}

	peek(): T | undefined {
		return this.head ? this.head.value : undefined;
	}
}
