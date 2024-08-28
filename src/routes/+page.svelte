<script lang="ts">
	import { drawTheCanvas } from '$lib/canvas';
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement | null = null;

	onMount(() => {
		canvas && drawTheCanvas(canvas);
	});
</script>

<canvas bind:this={canvas}></canvas>
