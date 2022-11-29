import { children, Component, JSX } from 'solid-js';

import { Level as ILevel } from 'src/openapi';
import { getYoutubeIdFromUrl } from 'src/util';

import './levels.scss';

interface LevelsProps {
	children: JSX.Element;
}

export const Levels: Component<LevelsProps> = function (props) {
	const levels = children(() => props.children);

	return (
		<>
			<ol role="list" class="levels">
				{levels()}
			</ol>
		</>
	);
};

interface LevelProps {
	level: ILevel;
}

export const Level: Component<LevelProps> = function (props) {
	return (
		<li id={`rank-${props.level.rank}`}>
			<a href={`/list/${props.level.rank}`} class="level">
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
					<h2>{props.level.name}</h2>
					<p>{props.level.user.name}</p>
				</div>
			</a>
		</li>
	);
};
