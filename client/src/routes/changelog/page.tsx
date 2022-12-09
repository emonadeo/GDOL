import { useRouteData } from '@solidjs/router';
import { Component, For, Show } from 'solid-js';
import { getIcon, ListChange } from 'src/components/listChange';
import { ChangelogData } from 'src/openapi';

import './page.scss';

const dict = {
	add: 'Added',
	move: 'Moved',
	delete: 'Archived',
};

const Page: Component = function () {
	const changelog = useRouteData<typeof ChangelogData>();

	return (
		<div class="page-changelog">
			<h1>Changelog</h1>
			<ol role="list" class="log">
				<For each={changelog()}>
					{(entry) => {
						const isAdd = entry.action === 'add';
						const isDelete = entry.action === 'delete';
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
										<Show when={entry.from != null && !isDelete}>
											<p class="from">#{entry.from}</p>
										</Show>
										<div class="icon">
											<img src={getIcon(entry)} alt="change" />
										</div>
										<p class="to">#{isDelete ? entry.from : entry.to}</p>
									</div>
									<div class="actions">
										<p />
									</div>
									<Show when={entry.reason || !isAdd}>
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
									<ListChange entry={entry} />
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
