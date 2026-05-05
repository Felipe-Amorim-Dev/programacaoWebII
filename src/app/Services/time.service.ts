import { prisma } from "../../prisma/client";
import { CreateTimeDto } from "../dtos/createTimeDto";

export class TimeService {
  async criar(dados: CreateTimeDto) {
    if (!dados.nome || !dados.cidade || !dados.estadio) {
      throw new Error("Preencha nome, cidade e estádio");
    }

    const novoTime = await prisma.time.create({
      data: {
        nome: dados.nome,
        cidade: dados.cidade,
        estadio: dados.estadio
      }
    });

    return novoTime;
  }

  async listar() {
    const times = await prisma.time.findMany({
      orderBy: {
        id: "asc"
      }
    });

    return times;
  }
}