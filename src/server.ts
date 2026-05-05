import express, { Request, Response } from "express";
import cors from "cors";

import { setupSwagger } from "./Config/Swagger";

import { CreateTimeDto } from "./app/dtos/createTimeDto";
import { CreatePartidaDto } from "./app/dtos/createPartidaDto";

import { TimeService } from "./app/Services/time.service";
import { PartidaService } from "./app/Services/partida.service";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

setupSwagger(app);

const timeService = new TimeService();
const partidaService = new PartidaService();

app.get("/", (req: Request, res: Response) => {
  return res.json({
    mensagem: "API REST de Futebol rodando com Express"
  });
});

app.post("/times", (req: Request, res: Response) => {
  try {
    const dados = new CreateTimeDto(
      req.body.nome,
      req.body.cidade,
      req.body.estadio
    );

    const novoTime = timeService.criar(dados);

    return res.status(201).json(novoTime);
  } catch (error) {
    return res.status(400).json({
      mensagem: error instanceof Error ? error.message : "Erro ao criar time"
    });
  }
});

app.get("/times", (req: Request, res: Response) => {
  const times = timeService.listar();

  return res.status(200).json(times);
});

app.post("/partidas", (req: Request, res: Response) => {
  try {
    const dados = new CreatePartidaDto(
      Number(req.body.timeCasaId),
      Number(req.body.timeForaId),
      Number(req.body.golsCasa),
      Number(req.body.golsFora),
      req.body.data
    );

    const novaPartida = partidaService.criar(dados);

    return res.status(201).json(novaPartida);
  } catch (error) {
    return res.status(400).json({
      mensagem: error instanceof Error ? error.message : "Erro ao criar partida"
    });
  }
});

app.get("/partidas", (req: Request, res: Response) => {
  const partidas = partidaService.listar();

  return res.status(200).json(partidas);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Swagger rodando em http://localhost:${port}/api-docs`);
});