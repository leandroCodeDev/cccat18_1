import crypto from "crypto";
import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";

type Body = {
	id?:string
	name:string
	email:string
	cpf:string
	carPlate?: string
	isDriver?: boolean
	isPassenger?: boolean
	password?: string
}

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const input = req.body;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {	
		const [acc] = await connection.query("select * from ccca.account where email = $1", [input.email]);

		if (acc) {
			throw new Error("-4");
		}

		validateBody(input)

		const id = crypto.randomUUID();
		await connection.query("insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver, input.password]);
		
		res.json({
			accountId: id
		});

	}catch(error){
		res.status(422).json({ message: error });
	} finally {
		await connection.$pool.end();
	}
});


function validateBody(body: Body ){
	if (validateName(body.name))  throw new Error("-3");
	if (validateEmail(body.email)) throw new Error("-2");
	if (!validateCpf(body.cpf)) throw new Error("-1");
	if (body.isDriver && body.carPlate && validateCarPlate(body.carPlate)) throw new Error("-5");
}

function validateName(name: string){ 
	return !(name.match(/[a-zA-Z] [a-zA-Z]+/))
}
function validateEmail(email: string){
	return !(email.match(/^(.+)@(.+)$/))
}

function validateCarPlate(carPlate: string){
	return !(carPlate.match(/[A-Z]{3}[0-9]{4}/))
}


app.listen(3000);

export default app;