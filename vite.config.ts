import type { PreviewServer, UserConfig, ViteDevServer } from 'vite';

const contentTypeCharset = (server: PreviewServer | ViteDevServer): void => {
	server.middlewares.use((_req, res, next) => {
		const writeHead = res.writeHead.bind(res);
		res.writeHead = ((...args: Parameters<typeof res.writeHead>) => {
			const contentType = res.getHeader('Content-Type');
			if (typeof contentType === 'string' && ['text/html', 'text/css', 'text/javascript'].includes(contentType)) {
				res.setHeader('Content-Type', `${contentType};charset=utf-8`);
			}
			return writeHead(...args);
		}) as typeof res.writeHead;
		next();
	});
};

export default {
	plugins: [
		{
			name: 'content-type-charset',
			configurePreviewServer(server) {
				contentTypeCharset(server);
			},
			configureServer(server) {
				contentTypeCharset(server);
			},
		},
	],
	build: {
		outDir: '.vite', // デフォルトの `dist` のままだとライブリロードの対象外になるため別のディレクトリにする（Vite による build は行わないため実際には使用されない）
	},
} satisfies UserConfig;
