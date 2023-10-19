<script lang="ts">
	import type { DataConnection } from 'peerjs';
	import { onMount } from 'svelte';
	export let connection: DataConnection;
	export let player = 'X';

	type Board = (string | null)[][];
	let board = [
		[null, null, null],
		[null, null, null],
		[null, null, null]
	] as Board;
	$: moves = board.flatMap((row) => row).filter((cell) => Boolean(cell)).length;
	$: myTurn = player === 'X' ? moves % 2 === 0 : moves % 2 === 1;
	$: winner = checkWinner(board);

	function checkWinner(board: Board) {
		const winningLines = [
			// horizontal
			[board[0][0], board[0][1], board[0][2]],
			[board[1][0], board[1][1], board[1][2]],
			[board[2][0], board[2][1], board[2][2]],
			// vertical
			[board[0][0], board[1][0], board[2][0]],
			[board[0][1], board[1][1], board[2][1]],
			[board[0][2], board[1][2], board[2][2]],
			// diagonal
			[board[0][0], board[1][1], board[2][2]],
			[board[0][2], board[1][1], board[2][0]]
		];
		for (const line of winningLines) {
			const [a, b, c] = line;
			if (a && a === b && b === c) {
				return a;
			}
		}
		return null;
	}

	function handleGame(x: number, y: number) {
		if (!myTurn || winner || x < 0 || x > 2 || y < 0 || y > 2 || !connection || board[y][x]) {
			return;
		}

		board[y][x] = player;
		board = board;
		connection.send(board);
	}

	function reset() {
		board = [
			[null, null, null],
			[null, null, null],
			[null, null, null]
		];
		player = player === 'X' ? 'O' : 'X';
	}

	onMount(() => {
		connection.on('data', (data) => {
			console.log('data received', data);
			if (data === 'reset') {
				return reset();
			}
			board = data as Board;
		});
	});
</script>

<div
	class="w-screen h-screen flex flex-col justify-center items-center gap-4 max-w-screen-sm mx-auto px-5"
>
	<span class="italic text-4xl">
		{#if winner}
			{winner === player ? 'You win!' : 'You lose!'}
		{:else if moves === 9}
			It's a draw!
		{:else}
			{myTurn ? 'Your turn' : "Your opponent's turn"}
		{/if}
	</span>
	<div class="grid grid-cols-3 auto-cols-fr gap-4 w-full">
		{#each board as row, y}
			{#each row as cell, x}
				<button
					class="aspect-square rounded bg-slate-200 shadow-md text-7xl sm:text-9xl"
					on:click|preventDefault={() => handleGame(x, y)}>{cell ? cell : ''}</button
				>
			{/each}
		{/each}
	</div>
	{#if winner || moves === 9}
		<button
			class="w-full py-2 font-bold bg-red-500 shadow-md rounded text-white active:scale-95 active:transition"
			on:click={() => {
				connection.send('reset');
				reset();
			}}>Play again?</button
		>
	{/if}
</div>
