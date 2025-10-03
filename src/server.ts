import express, { RequestHandler } from "express";
import 'dotenv/config';
import helmet from "helmet";
import { middlewares } from "@/infra/middlewares";
import { routes } from "@/routes";

const app = express();

app.use(helmet());
app.use(middlewares as RequestHandler[]);
app.use(routes);

const PORT = process.env.PORT || 8000

if(process.env.NODE_ENV !== "test") {
	app.listen(PORT, function (){
		console.info('--------------------------------------')
		console.info("Carango running on port %d", PORT);
		console.info('--------------------------------------')
	});
}

export { app };
