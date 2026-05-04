import * as http from "node:http";
import { CreatePartidaDto } from "./app/dtos/createPartidaDto";
import { CreateTimeDto } from "./app/dtos/createTimeDto";

import { TimeService } from "./app/Services/time.service";
import { PartidaService } from "./app/Services/partida.service";

const timeService = new TimeService();
const partidaService = new PartidaService();

function enviarResposta(
  res: http.ServerResponse,
  statusCode: number,
  dados: unknown
): void {
  res.writeHead(statusCode, {
    "Content-Type": "application/json"
  });

  res.end(JSON.stringify(dados));
}

function lerBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (parte) => {
      body += parte.toString();
    });

    req.on("end", () => {
      try {
        if (!body) {
          resolve({});
          return;
        }

        resolve(JSON.parse(body));
      } catch {
        reject(new Error("JSON inválido"));
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const method = req.method;
    const url = req.url;

    if (method === "GET" && url === "/") {
      return enviarResposta(res, 200, {
        mensagem: "API de Times e Partidas"
      });
    }

    if (method === "POST" && url === "/times") {
      const body = await lerBody(req);

      const dados = new CreateTimeDto(
        body.nome,
        body.cidade,
        body.estadio
      );

      const novoTime = timeService.criar(dados);

      return enviarResposta(res, 201, novoTime);
    }

    if (method === "GET" && url === "/times") {
      return enviarResposta(res, 200, timeService.listar());
    }

    if (method === "POST" && url === "/partidas") {
      const body = await lerBody(req);

      const dados = new CreatePartidaDto(
        Number(body.timeCasaId),
        Number(body.timeForaId),
        Number(body.golsCasa),
        Number(body.golsFora),
        body.data
      );

      const novaPartida = partidaService.criar(dados);

      return enviarResposta(res, 201, novaPartida);
    }

    if (method === "GET" && url === "/partidas") {
      return enviarResposta(res, 200, partidaService.listar());
    }

    return enviarResposta(res, 404, {
      mensagem: "Rota não encontrada"
    });
  } catch (error) {
    return enviarResposta(res, 400, {
      mensagem: error instanceof Error ? error.message : "Erro ao processar a requisição"
    });
  }
});

server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});