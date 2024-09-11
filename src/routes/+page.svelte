<script lang="ts">
	import { onMount } from 'svelte';
	import { dimensions } from './chart.png/data';
	import { getTransports } from './chart.png/data/transit';
	const { height, width } = dimensions;
	onMount(async () => {
		const test = await getTransports();
	});
</script>

<main>
	<img src="/chart.png" {height} {width} alt="chart" />
</main>

<style>
	main {
		padding: 0;
		min-height: 100dvh;
		display: grid;
		justify-content: center;
		align-items: center;
	}
</style>
