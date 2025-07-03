import express from "express";
import 'dotenv/config';
import helmet from "helmet";
import { middlewares } from "@/infra/middlewares";
import { routes } from "@/routes";

const app = express();

app.use(helmet());
app.use(middlewares);
app.use(routes);

if(process.env.NODE_ENV !== "tests") {
	app.listen(process.env.PORT || 8000, function (){
		console.log("Carango running on port %d", 7011);
	});
}

export { app };
