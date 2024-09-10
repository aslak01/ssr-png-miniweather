<script lang="ts">
	import { dimensions } from './chart.png/data';
	const { height, width } = dimensions;
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
