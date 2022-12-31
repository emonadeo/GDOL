import { ParentComponent } from 'solid-js';

import { edit, editActions } from './edit.module.scss';

export interface AdminEditProps {
	onReset: () => void;
	onSubmit: () => void;
}

export const AdminEdit: ParentComponent<AdminEditProps> = function (props) {
	function onReset() {
		props.onReset();
	}

	function onSubmit(e: Event) {
		e.preventDefault();
		props.onSubmit();
	}

	return (
		<form class={edit} onReset={onReset} onSubmit={onSubmit}>
			{props.children}
			<ul role="list" class={editActions}>
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
