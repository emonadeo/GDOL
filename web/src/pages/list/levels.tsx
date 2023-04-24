import { Level } from '@gdol/api/types';
import { For, Component } from 'solid-js';

import { levels, level, rank, outline, thumbnail, meta, meta_name } from './levels.css.ts';
import { setScrollPosition } from './store.ts';

import { observeScroll } from 'src/directives/observeScroll.ts';
import { display_medium } from 'src/styles/atomic/typography.css.ts';
import { getYoutubeIdFromUrl } from 'src/util.ts';

observeScroll;

type ListLevelsProps = {
	levels: Level[];
};

export const ListLevels: Component<ListLevelsProps> = function (props) {
	return (
		<main class={levels} use:observeScroll={setScrollPosition}>
			<ol>
				<For each={props.levels}>{(level, i) => <ListLevel rank={i() + 1} level={level} />}</For>
			</ol>
		</main>
	);
};

type ListLevelProps = {
	rank: number;
	level: Level;
};

export const ListLevel: Component<ListLevelProps> = function (props) {
	return (
		<li id={props.rank.toString()}>
			<a class={level} href={`/list/${props.rank}`}>
				<div class={rank}>
					<span class={display_medium} classList={{ [outline]: props.rank < 100 }}>
						{Math.floor((props.rank / 100) % 10)}
					</span>
					<span class={display_medium} classList={{ [outline]: props.rank < 10 }}>
						{Math.floor((props.rank / 10) % 10)}
					</span>
					<span class={display_medium}>{Math.floor(props.rank % 10)}</span>
				</div>
				<img
					class={thumbnail}
					src={`https://img.youtube.com/vi/${getYoutubeIdFromUrl(
						props.level.video ?? 'https://www.youtube.com/watch?v=oHg5SJYRHA0'
					)}/mqdefault.jpg`}
					alt="Thumbnail"
				/>
				<div class={meta}>
					<h2 class={meta_name}>{props.level.name}</h2>
					<p>{props.level.user.name}</p>
				</div>
			</a>
		</li>
	);
};
