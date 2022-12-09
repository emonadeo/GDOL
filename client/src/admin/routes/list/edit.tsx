import { Accessor, Component, createMemo, createSignal, Setter } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { api } from 'src/api';
import { ListChange } from 'src/components/listChange';
import { Changelog, Level } from 'src/generated/openapi';

import './edit.scss';

/**
 * Shared fields by all action-specific states
 */
export class ListEditState {
	index: Accessor<number>;
	setIndex: Setter<number>;
	reason: Accessor<string | undefined>;
	setReason: Setter<string | undefined>;

	constructor(index: number) {
		[this.index, this.setIndex] = createSignal<number>(index);
		[this.reason, this.setReason] = createSignal<string>();
	}
}

/**
 * Add action specific fields
 */
export class ListEditStateAdd extends ListEditState {
	levelId: Accessor<number | undefined>;
	setLevelId: Setter<number | undefined>;

	constructor(index: number) {
		super(index);
		[this.levelId, this.setLevelId] = createSignal<number>();
	}
}

/**
 * Archive action specific fields
 */
export class ListEditStateArchive extends ListEditState {}

/**
 * Move action specific fields
 */
export class ListEditStateMove extends ListEditState {
	to: Accessor<number | undefined>;
	setTo: Setter<number | undefined>;

	constructor(index: number) {
		super(index);
		[this.to, this.setTo] = createSignal();
	}
}

interface ListEditProps {
	list: Level[];
	state: ListEditState;
	onReset?: (e: Event) => void;
	onSubmit?: () => void;
}

export const ListEdit: Component<ListEditProps> = function (props) {
	const edit = useListEdit(
		() => props.list,
		() => props.state
	);

	// TODO: Clean up, along with src/components/listChange.tsx
	const preview = createMemo<Changelog>(() => {
		switch (props.state.constructor) {
			case ListEditStateAdd: {
				const state = props.state as ListEditStateAdd;
				const level = {
					name: 'Placeholder',
				};
				return {
					action: 'add',
					timestamp: new Date().toISOString(),
					level,
					list: [
						...props.list.slice(0, state.index()),
						level,
						...props.list.slice(state.index()),
					].slice(0, 150),
					list_before: props.list,
					to: state.index() + 1,
				};
			}
			case ListEditStateArchive: {
				const state = props.state as ListEditStateArchive;
				return {
					action: 'delete',
					timestamp: new Date().toISOString(),
					level: props.list.at(state.index())!,
					list: props.list.filter((_, i) => i !== state.index()),
					list_before: props.list,
					from: state.index() + 1,
				};
			}
			case ListEditStateMove: {
				const state = props.state as ListEditStateMove;
				const list_after = props.list.filter((_, i) => i !== state.index());
				list_after.splice((state.to() || 1) - 1, 0, props.list.at(state.index())!);
				return {
					action: 'move',
					timestamp: new Date().toISOString(),
					level: props.list.at(state.index()),
					list: list_after,
					list_before: props.list,
					reason: state.reason(),
					from: state.index() + 1,
					to: state.to(),
				};
			}
			default:
				// FIXME: Breaks Vite HMR
				throw new Error(`Unknown List Edit State`);
		}
	});

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
			<h6>Preview</h6>
			<ListChange entry={preview()} />
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

type Edit<T extends ListEditState> = (
	list: Accessor<Level[]>,
	state: Accessor<T>
) => {
	component: Component;
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
const useListEdit: Edit<ListEditState> = function (list, state) {
	switch (state().constructor) {
		case ListEditStateAdd:
			return useListEditAdd(list, state as Accessor<ListEditStateAdd>);
		case ListEditStateArchive:
			return useListEditArchive(list, state as Accessor<ListEditStateArchive>);
		case ListEditStateMove:
			return useListEditMove(list, state as Accessor<ListEditStateMove>);
		default:
			// FIXME: Breaks Vite HMR
			throw new Error(`Unknown List Edit State`);
	}
};

/**
 * Form elements unique to Add Action ({@link ListEditStateAdd})
 */
const useListEditAdd: Edit<ListEditStateAdd> = function (list, state) {
	const onSubmit = async function () {
		const levelId = state().levelId();
		if (levelId === undefined) throw new Error(`Level ID empty`);

		const res = await api.list.updateList(state().index() + 1, {
			level_id: levelId,
			reason: state().reason(),
		});
	};

	const component: Component = function () {
		const maxRank = createMemo(() => Math.min(list().length + 1, 150));

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
					max={maxRank()} // TODO: Fetch max_length
					value={state().index() + 1}
					onInput={(e) => {
						const value = Number((e.target as HTMLInputElement).value);
						state().setIndex(value - 1);
					}}
					required
				/>
				<label for="level" class="type-title-sm">
					Level
				</label>
				<input
					type="text"
					name="level"
					id="level"
					// TODO: Search for levels by name and resolve level ID
					onInput={(e) => {
						state().setLevelId(Number((e.target as HTMLInputElement).value));
					}}
					required
				/>
			</>
		);
	};

	return { component, onSubmit };
};

/**
 * Form elements unique to Archive Action ({@link ListEditStateArchive})
 */
const useListEditArchive: Edit<ListEditStateArchive> = function (list, state) {
	const onSubmit = async function () {
		const res = await api.list.archiveLevelByListRank(state().index() + 1, {
			reason: state().reason(),
		});
	};

	const component: Component = function () {
		return (
			<>
				<h3>Archive {list().at(state().index())?.name}</h3>
			</>
		);
	};

	return { component, onSubmit };
};

/**
 * Form elements unique to Move Action ({@link ListEditStateMove})
 */
const useListEditMove: Edit<ListEditStateMove> = function (list, state) {
	const onSubmit = async function () {
		const to = state().to();
		if (to === undefined) throw Error(`'to' is empty`);

		const level = list().at(state().index());
		if (!level) throw Error(`Rank exceeds list length`);

		const res = await api.list.updateList(to, {
			level_id: level.id,
			reason: state().reason(),
		});
	};

	const component: Component = function () {
		return (
			<>
				<h3>Move {list().at(state().index())?.name}</h3>
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

	return { component, onSubmit };
};
