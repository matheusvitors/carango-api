declare global {
	namespace NodeJs {
		interface ProcessEnv{
			[key: string]: string;
			PORT: string;
			DATABASE_URL: string;
		}
	}
}

export {}
