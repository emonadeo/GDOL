import { Component, createResource, For } from 'solid-js';
import { AdminEdit } from 'src/admin/components/edit';
import { api } from 'src/api';
import { Level } from 'src/generated/openapi';
import { fetchUsers } from 'src/openapi';

export interface LevelEditProps {
	level: Level | undefined;
	onReset?: () => void;
	onSubmit?: () => void;
}

export const AdminLevelsEdit: Component<LevelEditProps> = function (props) {
	const [users] = createResource(fetchUsers);

	async function onSubmit() {
		const res = await api.levels.createLevel({});
		props.onSubmit && props.onSubmit();
	}

	function onReset() {
		props.onReset && props.onReset();
	}

	return (
		<AdminEdit onSubmit={onSubmit} onReset={onReset}>
			<h2>{props.level ? `Edit ${props.level.name}` : `Create Level`}</h2>
			<label for="name" class="type-title-sm">
				Name
			</label>
			<input id="name" name="name" type="text" class="type-label-lg" value={props.level?.name} />
			<label for="gd-id" class="type-title-sm">
				Geometry Dash ID
			</label>
			<input
				id="gd-id"
				name="gd_id"
				type="number"
				class="type-label-lg"
				value={props.level?.gd_id?.toString()}
			/>
			<label for="requirement" class="type-title-sm">
				Requirement
			</label>
			<input
				id="requirement"
				name="requirement"
				type="number"
				class="type-label-lg"
				value={props.level?.requirement?.toString()}
			/>
			<label for="video" class="type-title-sm">
				User
			</label>
			<select name="user" id="user" class="type-label-lg">
				<For each={users()}>
					{(user) => (
						<option value={user.id} selected={user.id === props.level?.user.id}>
							{user.name}
						</option>
					)}
				</For>
			</select>
			<label for="video" class="type-title-sm">
				Verifier
			</label>
			<select name="verifier" id="verifier" class="type-label-lg">
				<For each={users()}>
					{(user) => (
						<option value={user.id} selected={user.id === props.level?.verifier.id}>
							{user.name}
						</option>
					)}
				</For>
			</select>
			<label for="video" class="type-title-sm">
				Creators
			</label>
			{/* TODO: Editable Creators List */}
			<select name="creators" id="creators" class="type-label-lg" multiple>
				<For each={users()}>{(user) => <option value={user.id}>{user.name}</option>}</For>
			</select>
			<label for="video" class="type-title-sm">
				Video
			</label>
			<input
				id="video"
				name="video"
				type="url"
				class="type-label-lg"
				value={props.level?.video || undefined}
			/>
		</AdminEdit>
	);
};
