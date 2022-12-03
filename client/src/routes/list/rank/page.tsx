import { useParams, useRouteData } from '@solidjs/router';
import { Component, For, Show } from 'solid-js';
import { LevelByRankData } from 'src/openapi';
import { embed, ordinal } from 'src/util';

import './page.scss';

import iconYouTube from 'src/assets/icons/media/youtube.svg';

const Page: Component = function () {
	const params = useParams();
	const { level, records } = useRouteData<typeof LevelByRankData>();

	return (
		<div class="page page-level">
			<div class="details">
				<span class="rank type-title-lg">{params.rank.padStart(3, '0')}</span>
				<h2 class="name">{level()?.name}</h2>
				<Show when={level()?.video} keyed>
					{(video) => (
						<iframe
							class="video"
							src={embed(video)}
							title="youtube video player"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						/>
					)}
				</Show>
				<dl class="credits">
					<div class="publisher">
						<dt class="type-title-sm">Publisher</dt>
						<dd class="type-body-lg">{level()?.user.name}</dd>
					</div>
					<div class="verifier">
						<dt class="type-title-sm">Verifier</dt>
						<dd class="type-body-lg">{level()?.verifier.name}</dd>
					</div>
					<div class="creators">
						<dt class="type-title-sm">Creators</dt>
						<dd class="type-body-lg">
							<For each={level()?.creators}>
								{(creator) => (
									<>
										<a href={`/users/${creator.id}`}>{creator.name}</a>
										<span>, </span>
									</>
								)}
							</For>
						</dd>
					</div>
				</dl>
			</div>
			<div class="records">
				<h5>Leaderboard</h5>
				<table>
					<For each={records()}>
						{(record, i) => (
							<tr class="record">
								<td
									class="rank"
									classList={{ gold: i() === 0, silver: i() === 1, bronze: i() === 2 }}
								>
									<Show when={record.percentage === 100}>
										<p class="mono" class:type-body-md={i() > 2}>
											<span>{i() + 1}</span>
											<span>{ordinal(i() + 1)}</span>
										</p>
									</Show>
								</td>
								<td class="percentage">
									<p class="mono" classList={{ bold: record.percentage === 100 }}>
										{record.percentage}%
									</p>
								</td>
								<td class="user">
									<a href={`/users/${record.user.id}`}>
										<p>{record.user.name}</p>
									</a>
								</td>
								<td class="video">
									<a href={record.video} target="_blank">
										<img src={iconYouTube} alt="YouTube" />
									</a>
								</td>
							</tr>
						)}
					</For>
				</table>
			</div>
		</div>
	);
};

export default Page;
