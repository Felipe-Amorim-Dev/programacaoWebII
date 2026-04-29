import * as http from "node:http";

import { times, partidas } from "./database";
import { Time } from "../app/entities/time";
import { Partida } from "../app/entities/partida";
import { CreatePartidaDto } from "../app/dtos/createPartidaDto";
import { CreateTimeDto } from "../app/dtos/createTimeDto";

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

      if (!dados.nome || !dados.cidade || !dados.estadio) {
        return enviarResposta(res, 400, {
          mensagem: "Preencha nome, cidade e estádio"
        });
      }

      const novoTime = new Time(
        times.length + 1,
        dados.nome,
        dados.cidade,
        dados.estadio
      );

      times.push(novoTime);

      return enviarResposta(res, 201, novoTime);
    }

    if (method === "GET" && url === "/times") {
      return enviarResposta(res, 200, times);
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

      if (
        !dados.timeCasaId ||
        !dados.timeForaId ||
        dados.golsCasa < 0 ||
        dados.golsFora < 0 ||
        !dados.data
      ) {
        return enviarResposta(res, 400, {
          mensagem: "Preencha todos os dados da partida corretamente"
        });
      }

      if (dados.timeCasaId === dados.timeForaId) {
        return enviarResposta(res, 400, {
          mensagem: "O time da casa não pode ser igual ao time de fora"
        });
      }

      const timeCasa = times.find((time) => time.id === dados.timeCasaId);
      const timeFora = times.find((time) => time.id === dados.timeForaId);

      if (!timeCasa || !timeFora) {
        return enviarResposta(res, 400, {
          mensagem: "Um dos times informados não existe"
        });
      }

      const novaPartida = new Partida(
        partidas.length + 1,
        dados.timeCasaId,
        dados.timeForaId,
        dados.golsCasa,
        dados.golsFora,
        dados.data
      );

      partidas.push(novaPartida);

      return enviarResposta(res, 201, novaPartida);
    }

    if (method === "GET" && url === "/partidas") {
      const lista = partidas.map((partida) => {
        const timeCasa = times.find((time) => time.id === partida.timeCasaId);
        const timeFora = times.find((time) => time.id === partida.timeForaId);

        return {
          id: partida.id,
          timeCasa: timeCasa?.nome,
          timeFora: timeFora?.nome,
          placar: `${partida.golsCasa} x ${partida.golsFora}`,
          data: partida.data
        };
      });

      return enviarResposta(res, 200, lista);
    }

    return enviarResposta(res, 404, {
      mensagem: "Rota não encontrada"
    });
  } catch {
    return enviarResposta(res, 400, {
      mensagem: "Erro ao processar a requisição"
    });
  }
});

server.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});