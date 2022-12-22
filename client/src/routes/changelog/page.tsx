import { useRouteData } from '@solidjs/router';
import { Component, For, Show } from 'solid-js';
import { ChangelogOverview } from 'src/components/changelog/overview';
import { ChangelogData } from 'src/openapi';
import { ChangelogAction, getChangelogIcon } from 'src/util/changelog';

import './page.scss';

const dict: { [action in ChangelogAction]: string } = {
	add: 'Added',
	move: 'Moved',
	archive: 'Archived',
};

const Page: Component = function () {
	const changelog = useRouteData<typeof ChangelogData>();

	return (
		<div class="page-changelog">
			<h1>Changelog</h1>
			<ol role="list" class="log">
				<For each={changelog()}>
					{(entry) => {
						return (
							<>
								<li class="entry">
									<div class="date">
										<p class="mono">{new Date(entry.timestamp).toLocaleDateString()}</p>
									</div>
									<div class="summary">
										<p>
											{dict[entry.action] + ' '}
											<a href={`/level/${entry.level.id}`}>{entry.level.name}</a>
										</p>
									</div>
									<div class="changes">
										<Show when={entry.action === 'move' && entry} keyed>
											{(e) => <p class="from">#{e.from}</p>}
										</Show>
										<div class="icon">
											<img src={getChangelogIcon(entry)} alt="change" />
										</div>
										<p class="to">#{entry.action === 'archive' ? entry.from : entry.to}</p>
									</div>
									<div class="actions">
										<p />
									</div>
									<Show when={entry.reason || entry.action !== 'add'}>
										<div class="details">
											<Show
												when={entry.reason}
												fallback={<p class="no-reason">No Reason specified</p>}
											>
												<p>
													<span>Reason: </span>
													<span>{entry.reason}</span>
												</p>
											</Show>
										</div>
									</Show>
									<ChangelogOverview {...entry} />
								</li>
							</>
						);
					}}
				</For>
			</ol>
		</div>
	);
};

export default Page;
