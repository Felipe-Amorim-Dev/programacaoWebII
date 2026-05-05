import express, { Request, Response } from "express";

import { CreatePartidaDto } from "./app/dtos/createPartidaDto";
import { CreateTimeDto } from "./app/dtos/createTimeDto";

import { TimeService } from "./app/Services/time.service";
import { PartidaService } from "./app/Services/partida.service";

const app = express();
const port = 3000;

const timeService = new TimeService();
const partidaService = new PartidaService();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    mensagem: "API de Times e Partidas com Express"
  });
});

app.post("/times", async (req: Request, res: Response) => {
  try {
    const dados = new CreateTimeDto(
      req.body.nome,
      req.body.cidade,
      req.body.estadio
    );

    const novoTime = await timeService.criar(dados);

    return res.status(201).json(novoTime);
  } catch (error) {
    return res.status(400).json({
      mensagem: error instanceof Error ? error.message : "Erro ao criar time"
    });
  }
});

app.get("/times", async (req: Request, res: Response) => {
  const times = await timeService.listar();

  return res.status(200).json(times);
});

app.post("/partidas", async (req: Request, res: Response) => {
  try {
    const dados = new CreatePartidaDto(
      Number(req.body.timeCasaId),
      Number(req.body.timeForaId),
      Number(req.body.golsCasa),
      Number(req.body.golsFora),
      req.body.data
    );

    const novaPartida = await partidaService.criar(dados);

    return res.status(201).json(novaPartida);
  } catch (error) {
    return res.status(400).json({
      mensagem: error instanceof Error ? error.message : "Erro ao criar partida"
    });
  }
});

app.get("/partidas", async (req: Request, res: Response) => {
  const partidas = await partidaService.listar();

  return res.status(200).json(partidas);
});

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    mensagem: "Rota não encontrada"
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});