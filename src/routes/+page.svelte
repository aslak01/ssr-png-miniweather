<script lang="ts">
	import { onMount } from 'svelte';
	import { dimensions } from './chart.png/data';
	import { getTransports } from './chart.png/data/transit';
	import { page } from '$app/stores';
	const mock = !!$page.url.searchParams.get('mock');
	const src = mock ? '/chart.png?mock=true' : '/chart.png';
	const { height, width } = dimensions;
</script>

<main>
	<img {src} {height} {width} alt="chart" />
</main>

<style>
	:root {
		color-scheme: light dark;
	}
	main {
		padding: 0;
		min-height: 100dvh;
		display: grid;
		justify-content: center;
		align-items: center;
		background-color: light-dark(#eee, #212121);
	}
</style>
