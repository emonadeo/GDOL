import { Accessor, Component, createSignal, Match, Show, Switch } from 'solid-js';
import { Level, archiveLevelByRank, addOrMoveLevel } from 'src/openapi';

type ListEditMode = 'add' | 'archive' | 'move';

interface ListEditState {
	index: number;
	mode: ListEditMode;
}

type ListEdit = [(index: number, mode: ListEditMode) => void, Component];

function createListEditComponent(
	list: Accessor<Level[]>,
	state: Accessor<ListEditState | undefined>,
	onReset: () => void,
	onSubmit: () => void
): Component {
	function reset() {
		onReset();
	}

	async function submit(e: Event) {
		e.preventDefault();
		const _state = state();
		if (!_state) return;
		// Submit
		switch (_state.mode) {
			case 'add': {
				break;
			}
			case 'archive': {
				await archiveLevelByRank(_state.index + 1);
				break;
			}
			case 'move': {
				const levelId = list().at(_state.index)?.id;
				if (levelId === undefined) {
					throw new Error(`List is empty`);
				}
				await addOrMoveLevel(_state.index + 1, levelId);
				break;
			}
		}
		onSubmit();
	}

	return function () {
		return (
			<Show when={state()} keyed>
				{(state) => (
					<form class="list-edit" onReset={reset} onSubmit={submit}>
						<Switch>
							<Match when={state.mode === 'add'}>
								<h3>Add Level</h3>
								<label for="rank" class="type-title-sm">
									Rank
								</label>
								<input
									class="type-label-lg"
									name="rank"
									id="rank"
									type="number"
									min={1}
									max={list().length}
									value={state.index + 1}
									required
								/>
								<label for="level" class="type-title-sm">
									Level
								</label>
								<input type="text" name="level" id="level" required />
							</Match>
							<Match when={state.mode === 'archive'}>
								<h3>Archive {list().at(state.index)?.name}</h3>
							</Match>
							<Match when={state.mode === 'move'}>
								<h3>Move {list().at(state.index)?.name}</h3>
								<label for="to" class="type-title-sm">
									To
								</label>
								<input
									class="type-label-lg"
									name="to"
									id="to"
									type="number"
									min={1}
									max={list().length}
									value={state.index + 1}
									required
								/>
							</Match>
						</Switch>
						<label for="reason" class="type-title-sm">
							Reason
						</label>
						<textarea class="type-body-lg" name="reason" id="reason" rows="3" autocomplete="off" />
						<h6>Preview</h6>
						<p>TODO</p>
						<ul role="list" class="actions">
							<li>
								<button type="reset" class="type-label-lg">
									Cancel
								</button>
							</li>
							<li>
								<button type="submit" class="type-label-lg">
									Submit
								</button>
							</li>
						</ul>
					</form>
				)}
			</Show>
		);
	};
}

export function useListEdit(list: Accessor<Level[]>): ListEdit {
	const [state, setState] = createSignal<ListEditState>();

	const edit = (index: number, mode: ListEditMode) => {
		setState({ index, mode });
	};

	function onReset() {
		// Clear state
		setState();
	}

	function onSubmit() {}

	const component = createListEditComponent(list, state, onReset, onSubmit);

	return [edit, component];
}
