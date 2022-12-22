import {
	Accessor,
	Component,
	createMemo,
	createResource,
	createSignal,
	For,
	Setter,
	Show,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { api } from 'src/api';
import {
	ChangelogOverviewSim,
	ExtractChangelogOverviewSimState,
} from 'src/components/changelog/simulated';
import { Level } from 'src/generated/openapi';
import { fetchLevels, fetchListSettings } from 'src/openapi';
import { ChangelogAction } from 'src/util/changelog';

import './edit.scss';

/**
 * Shared fields by all action-specific states
 */
interface ListEditStateBase {
	reason: Accessor<string | undefined>;
	setReason: Setter<string | undefined>;
}

function createListEditStateBase(): ListEditStateBase {
	const [reason, setReason] = createSignal<string | undefined>();
	return { reason, setReason };
}

/**
 * Add action specific fields
 */
export interface ListEditStateAdd extends ListEditStateBase {
	action: 'add';
	selected: Accessor<number>;
	setSelected: Setter<number>;
	to: Accessor<number | undefined>;
	setTo: Setter<number | undefined>;
}

export function createListEditStateAdd(to = 1): ListEditStateAdd {
	const [selected, setSelected] = createSignal<number>(0);
	const [_to, setTo] = createSignal<number | undefined>(to);
	return {
		...createListEditStateBase(),
		action: 'add',
		selected,
		setSelected,
		to: _to,
		setTo,
	};
}

/**
 * Archive action specific fields
 */
export interface ListEditStateArchive extends ListEditStateBase {
	action: 'archive';
	from: Accessor<number>;
	setFrom: Setter<number>;
}

export function createListEditStateArchive(from: number): ListEditStateArchive {
	const [_from, setFrom] = createSignal<number>(from);
	return {
		...createListEditStateBase(),
		action: 'archive',
		from: _from,
		setFrom,
	};
}

/**
 * Move action specific fields
 */
export interface ListEditStateMove extends ListEditStateBase {
	action: 'move';
	from: Accessor<number>;
	setFrom: Setter<number>;
	to: Accessor<number | undefined>;
	setTo: Setter<number | undefined>;
}

export function createListEditStateMove(from: number): ListEditStateMove {
	const [_from, setFrom] = createSignal<number>(from);
	const [to, setTo] = createSignal<number | undefined>();
	return {
		...createListEditStateBase(),
		action: 'move',
		from: _from,
		setFrom,
		to,
		setTo,
	};
}

export type ListEditState = ListEditStateAdd | ListEditStateArchive | ListEditStateMove;

type ListEditProps = {
	list: Level[];
	state: ListEditState;
	onReset?: (e: Event) => void;
	onSubmit?: () => void;
};

export const ListEdit: Component<ListEditProps> = function (props) {
	const edit = useListEdit(
		() => props.list,
		() => props.state
	);

	function onReset(e: Event) {
		props.onReset && props.onReset(e);
	}

	async function onSubmit(e: Event) {
		e.preventDefault();

		await edit.onSubmit();

		// Pass event to parent
		props.onSubmit && props.onSubmit();
	}

	return (
		<form class="list-edit" onReset={onReset} onSubmit={onSubmit}>
			{/* State-specific */}
			<Dynamic component={edit.component} />
			{/* Universal */}
			<label for="reason" class="type-title-sm">
				Reason
			</label>
			<textarea
				class="type-body-lg"
				name="reason"
				id="reason"
				rows="3"
				autocomplete="off"
				onInput={(e) => {
					props.state.setReason((e.target as HTMLTextAreaElement).value || undefined);
				}}
			/>
			<Show when={edit.changelog()} keyed>
				{(p) => (
					<>
						<h6>Preview</h6>
						<ChangelogOverviewSim list={props.list} reason={props.state.reason()} state={p} />
					</>
				)}
			</Show>
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
	);
};

/**
 * Map {@link ChangelogAction} to action-specific {@link ListEditState}
 * @example
 * 'add' -> ListEditStateAdd
 * 'archive' -> ListEditStateArchive
 * 'move' -> ListEditStateMove
 */
type PickListEditState<T extends ChangelogAction> = Extract<ListEditState, { action: T }>;

/**
 * Given the current list and a specific {@link ListEditState}
 * (i.e. either of {@link ListEditStateAdd}, {@link ListEditStateArchive}, {@link ListEditStateMove})
 * create
 * - a `component` containing state-specific form elements,
 * - a `changelog` that contains props passed to the rendered {@link ChangelogOverviewSim},
 * - and an async `onSubmit` function, that calls the REST API.
 */
type Edit<T extends ChangelogAction = ChangelogAction> = (
	list: Accessor<Level[]>,
	state: Accessor<PickListEditState<T>>
) => {
	component: Component;
	changelog: Accessor<ExtractChangelogOverviewSimState<T> | undefined>;
	onSubmit: () => Promise<void>;
};

/**
 * Maps a specific {@link ListEditState} to their Component
 *
 * @example
 * ListEditStateAdd -> ListEditAdd
 * ListEditStateArchive -> ListEditArchive
 * ListEditStateMove -> ListEditMove
 */
const useListEdit: Edit = function (list, state) {
	const _state = state();
	switch (_state.action) {
		case 'add':
			return useListEditAdd(list, () => _state);
		case 'archive':
			return useListEditArchive(list, () => _state);
		case 'move':
			return useListEditMove(list, () => _state);
		default:
			throw new Error(`Unknown List Edit State`);
	}
};

/**
 * Add Action ({@link ListEditStateAdd})
 */
const useListEditAdd: Edit<'add'> = function (list, state) {
	const [levels] = createResource(fetchLevels);
	const [listSettings] = createResource(fetchListSettings);

	const levelsNotOnList = createMemo<Level[] | undefined>(() => {
		return levels()?.filter((l) => list().findIndex((ll) => ll.id === l.id) === -1);
	});

	const onSubmit = async function () {
		const level = levelsNotOnList()?.at(state().selected());
		if (level === undefined) throw new Error(`No Level selected`);

		const to = state().to();
		if (to === undefined) throw new Error(`'To' empty`);

		const res = await api.list.updateList(to, {
			level_id: level.id,
			reason: state().reason(),
		});
	};

	const changelog = createMemo(() => {
		const to = state().to();
		const level = levelsNotOnList()?.at(state().selected());
		if (to === undefined || level === undefined) return undefined;
		return {
			action: 'add',
			level,
			to,
			maxLength: listSettings()?.max_length,
		} as const;
	});

	const component: Component = function () {
		const maxRank = createMemo<number | undefined>(() => {
			const settings = listSettings();
			if (settings === undefined || settings.max_length === undefined) return undefined;
			return Math.min(list().length + 1, settings.max_length);
		});

		return (
			<>
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
					max={maxRank()}
					value={state().to()}
					onInput={(e) => {
						const value = Number((e.target as HTMLInputElement).value);
						state().setTo(value);
					}}
					required
				/>
				<label for="level" class="type-title-sm">
					Level
				</label>
				<select
					name="level"
					id="level"
					class="levels type-label-lg"
					onInput={(e) => {
						state().setSelected(Number((e.target as HTMLInputElement).value));
					}}
					required
				>
					<For each={levelsNotOnList()}>
						{(level, i) => <option value={i()}>{level.name}</option>}
					</For>
				</select>
			</>
		);
	};

	return { component, changelog, onSubmit };
};

/**
 * Archive Action ({@link ListEditStateArchive})
 */
const useListEditArchive: Edit<'archive'> = function (list, state) {
	const onSubmit = async function () {
		const res = await api.list.archiveLevelByListRank(state().from(), {
			reason: state().reason(),
		});
	};

	const changelog = createMemo(() => {
		return {
			action: 'archive',
			from: state().from(),
		} as const;
	});

	const component: Component = function () {
		return (
			<>
				<h3>Archive {list().at(state().from() - 1)?.name}</h3>
				{/* No additional archive-specific form elements */}
			</>
		);
	};

	return { component, changelog, onSubmit };
};

/**
 * Move Action ({@link ListEditStateMove})
 */
const useListEditMove: Edit<'move'> = function (list, state) {
	const onSubmit = async function () {
		const to = state().to();
		if (to === undefined) throw Error(`'to' is empty`);

		const level = list().at(state().from() - 1);
		if (!level) throw Error(`Rank exceeds list length`);

		const res = await api.list.updateList(to, {
			level_id: level.id,
			reason: state().reason(),
		});
	};

	const changelog = createMemo(() => {
		const to = state().to();
		if (to === undefined) return undefined;
		return {
			action: 'move',
			from: state().from(),
			to,
		} as const;
	});

	const component: Component = function () {
		return (
			<>
				<h3>Move {list().at(state().from() - 1)?.name}</h3>
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
					value={state().to()}
					onInput={(e) => {
						const value = Number((e.target as HTMLInputElement).value);
						state().setTo(Number.isNaN(value) ? undefined : value);
					}}
					required
				/>
			</>
		);
	};

	return { component, changelog, onSubmit };
};
