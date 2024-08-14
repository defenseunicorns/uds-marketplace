export * from './gen';

export interface Application {
	kind: string;
	metadata: {
		name: string;
		vendor: {
			name: string;
			url: string;
		};
	};
	spec: {
		icons: Array<{
			src: string;
			type: string;
			size: string;
		}>;
		repository: string;
		description: string;
		links: Array<{
			description: string;
			url: string;
		}>;
		versions: string[];
	};
}