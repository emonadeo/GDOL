import { children, Component, JSX } from 'solid-js';

import { Level } from 'src/openapi';
import { getYoutubeIdFromUrl } from 'src/util';

import './levels.scss';

interface ListLevelsProps {
	children: JSX.Element;
}

export const ListLevels: Component<ListLevelsProps> = function (props) {
	const levels = children(() => props.children);

	return (
		<ol role="list" class="page-list-levels">
			{levels()}
		</ol>
	);
};

interface ListLevelProps {
	level: Level;
}

export const ListLevel: Component<ListLevelProps> = function (props) {
	return (
		<li class="page-list-level" id={props.level.rank.toString()}>
			<a href={`/list/${props.level.rank}`}>
				<div class="rank">
					<h2 classList={{ outline: props.level.rank < 100 }}>
						{Math.floor((props.level.rank / 100) % 10)}
					</h2>
					<h2 classList={{ outline: props.level.rank < 10 }}>
						{Math.floor((props.level.rank / 10) % 10)}
					</h2>
					<h2>{Math.floor(props.level.rank % 10)}</h2>
				</div>
				<img
					class="thumbnail"
					src={`https://img.youtube.com/vi/${getYoutubeIdFromUrl(
						props.level.video || 'https://www.youtube.com/watch?v=oHg5SJYRHA0'
					)}/mqdefault.jpg`}
					alt="Thumbnail"
				/>
				<div class="meta">
					<h2 class="name">{props.level.name}</h2>
					<p>{props.level.user.name}</p>
				</div>
			</a>
		</li>
	);
};
