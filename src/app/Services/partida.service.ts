import { partidas, times } from "../../database";
import { CreatePartidaDto } from "../dtos/createPartidaDto";
import { Partida } from "../entities/partida";

export class PartidaService {
  criar(dados: CreatePartidaDto): Partida {
    if (
      !dados.timeCasaId ||
      !dados.timeForaId ||
      dados.golsCasa < 0 ||
      dados.golsFora < 0 ||
      !dados.data
    ) {
      throw new Error("Preencha todos os dados da partida corretamente");
    }

    if (dados.timeCasaId === dados.timeForaId) {
      throw new Error("O time da casa não pode ser igual ao time de fora");
    }

    const timeCasa = times.find((time) => time.id === dados.timeCasaId);
    const timeFora = times.find((time) => time.id === dados.timeForaId);

    if (!timeCasa || !timeFora) {
      throw new Error("Um dos times informados não existe");
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

    return novaPartida;
  }

  listar(): unknown[] {
    return partidas.map((partida) => {
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
  }
}