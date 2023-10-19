<script lang="ts">
	import { onMount } from 'svelte';
	import type { Peer, DataConnection } from 'peerjs';
	import Board from '$lib/components/TicTacToeBoard.svelte';

	let peer: Peer;
	let peerId = '';
	let connection: DataConnection;
	let isError = false;
	let player = 'X';

	function handleJoin(e: SubmitEvent) {
		if (!e.target) return (isError = true);

		const formEl = e.target as HTMLFormElement;
		const formData = new FormData(formEl);
		const data = new Map(formData);
		const friendId = data.get('friendId')?.toString();
		if (!friendId || friendId === peerId) return (isError = true);

		const conn = peer.connect(friendId);
		if (connection) return (isError = true);

		conn.once('open', () => {
			console.log('connection opened');
			player = 'O';
			connection = conn;
		});
	}

	onMount(async () => {
		const Peer = await import('peerjs').then((m) => m.default);
		peer = new Peer();
		peer.on('open', (id) => (peerId = id));
		peer.on('connection', (conn) => {
			console.log('connection received', conn);
			conn.on('open', () => {
				console.log('connection opened');
				connection = conn;
			});
		});
	});
</script>

{#if connection}
	<Board {connection} {player} />
{:else}
	<div
		class="flex flex-col justify-center items-center h-screen w-screen gap-5 max-w-2xl mx-auto p-4"
	>
		<h1 class="text-6xl md:text-8xl font-extrabold">Tic-Tac-Toe</h1>
		<h2 class="text-xl italic">Peer-to-peer game with your friend!</h2>

		<button
			class="flex w-full bg-slate-200 rounded-lg px-4 py-2 font-bold shrink-0 active:bg-green-300 active:transition duration-1000"
			on:click={() => {
				navigator.clipboard.writeText(peerId);
			}}
		>
			Your room ID: {peerId}
		</button>

		<form class="flex w-full gap-4" on:submit|preventDefault={handleJoin}>
			<input
				class="bg-slate-200 rounded-lg grow px-4 {isError && 'border-2 border-red-600'}"
				type="text"
				name="friendId"
				placeholder="Enter your friend's ID"
				on:change={() => (isError = false)}
			/>
			<button
				type="submit"
				class=" bg-slate-300 rounded-lg px-4 py-2 font-bold active:invert active:transition duration-1000"
				>Connect!</button
			>
		</form>

		<span class="text-xs"
			>more games are coming! check out <a class="underline" href="https://hinry.space"
				>my website</a
			>
			for more update!</span
		>
	</div>
{/if}
