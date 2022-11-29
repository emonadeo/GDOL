// TODO: Generate using OpenAPI
export interface Level {
	rank: number;
	id: number;
	gd_id?: number;
	name: string;
	user: {
		id: number;
		name: string;
	};
	video?: string;
}
