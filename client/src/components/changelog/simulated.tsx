/**
 * @file Provides a wrapper component around {@link ChangelogOverview} that includes
 * additional logic to simulate changes being applied to the list.
 * Useful for previewing changes before submitting them.
 */

import { Component, createMemo } from 'solid-js';
import { ChangelogOverview } from 'src/components/changelog/overview';
import { Level } from 'src/generated/openapi';
import { Changelog, ChangelogAction, ExtractChangelogAction } from 'src/util/changelog';
import { simulateListAdd, simulateListArchive, simulateListMove } from 'src/util/list';

import './overview.scss';

/**
 * Map {@link ChangelogAction} to action-specific {@link ChangelogOverviewSimProps}
 * 'add' -> ChangelogOverviewSimPropsAdd
 * 'archive' -> ChangelogOverviewSimPropsArchive
 * 'move' -> ChangelogOverviewSimPropsMove
 */
export type ExtractChangelogOverviewSimState<T extends ChangelogAction> = Extract<
	ChangelogOverviewSimState,
	{ action: T }
>;

/**
 * Props shared between all action-specific {@link ChangelogOverviewSim}
 */
export interface ChangelogOverviewSimStateAdd {
	action: ExtractChangelogAction<'add'>;
	level: Level;
	to: number;
	maxLength?: number;
}

export interface ChangelogOverviewSimStateArchive {
	action: ExtractChangelogAction<'archive'>;
	from: number;
}

export interface ChangelogOverviewSimStateMove {
	action: ExtractChangelogAction<'move'>;
	from: number;
	to: number;
}

export type ChangelogOverviewSimState =
	| ChangelogOverviewSimStateAdd
	| ChangelogOverviewSimStateArchive
	| ChangelogOverviewSimStateMove;

export interface ChangelogOverviewSimProps {
	list: Level[];
	reason?: string;
	state: ChangelogOverviewSimState;
}

/**
 * Compute {@link ChangelogOverview} from a given list by simulating a given change on it
 */
export const ChangelogOverviewSim: Component<ChangelogOverviewSimProps> = function (props) {
	const changelog = createMemo<Changelog>(() => {
		const common = {
			timestamp: new Date(),
			before: props.list,
			reason: props.reason,
		} as const;
		switch (props.state.action) {
			case 'add':
				return {
					...common,
					action: 'add',
					level: props.state.level,
					to: props.state.to,
					after: simulateListAdd(
						props.list,
						props.state.level,
						props.state.to,
						props.state.maxLength
					),
				};
			case 'archive':
				return {
					...common,
					action: 'archive',
					level: props.list[props.state.from],
					from: props.state.from,
					after: simulateListArchive(props.list, props.state.from),
				};
			case 'move':
				return {
					...common,
					action: 'move',
					level: props.list[props.state.from],
					from: props.state.from,
					to: props.state.to,
					after: simulateListMove(props.list, props.state.from, props.state.to),
				};
		}
	});

	return <ChangelogOverview {...changelog()} />;
};
