/**
 * `data-status` attribute
 */
export default class {
	#paused = true;

	get paused(): boolean {
		return this.#paused;
	}

	set paused(paused: boolean) {
		this.#paused = paused;
	}

	toggle() {
		this.#paused = !this.#paused;
	}
}
