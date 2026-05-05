import { prisma } from "../../prisma/client";
import { CreatePartidaDto } from "../dtos/createPartidaDto";

export class PartidaService {
  async criar(dados: CreatePartidaDto) {
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

    const timeCasa = await prisma.time.findUnique({
      where: { id: dados.timeCasaId }
    });

    const timeFora = await prisma.time.findUnique({
      where: { id: dados.timeForaId }
    });

    if (!timeCasa || !timeFora) {
      throw new Error("Um dos times informados não existe");
    }

    const novaPartida = await prisma.partida.create({
      data: {
        timeCasaId: dados.timeCasaId,
        timeForaId: dados.timeForaId,
        golsCasa: dados.golsCasa,
        golsFora: dados.golsFora,
        data: new Date(dados.data)
      },
      include: {
        timeCasa: true,
        timeFora: true
      }
    });

    return novaPartida;
  }

  async listar() {
    const partidas = await prisma.partida.findMany({
      include: {
        timeCasa: true,
        timeFora: true
      },
      orderBy: {
        id: "asc"
      }
    });

    return partidas.map((partida) => {
      return {
        id: partida.id,
        timeCasa: partida.timeCasa.nome,
        timeFora: partida.timeFora.nome,
        placar: `${partida.golsCasa} x ${partida.golsFora}`,
        data: partida.data
      };
    });
  }
}