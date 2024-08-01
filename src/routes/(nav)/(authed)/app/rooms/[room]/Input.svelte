<div id="app">
	<div class="container">
		<div role="group" class="button-group">
			<button>Check/Call</button>
			<button>Fold</button>
			<button>Raise</button>
		</div>
	</div>
</div>

<style>
	#app {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.container {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	button {
		--pico-border-radius: 0rem;
		--pico-typography-spacing-vertical: 1.5rem;
		--pico-form-element-spacing-vertical: 1rem;
	}

	.button-group {
		position: absolute;
		bottom: 0;
		right: 0;
	}
</style>
