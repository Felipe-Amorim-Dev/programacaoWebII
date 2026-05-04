import { times } from "../../database";
import { CreateTimeDto } from "../dtos/createTimeDto";
import { Time } from "../entities/time";

export class TimeService {
  criar(dados: CreateTimeDto): Time {
    if (!dados.nome || !dados.cidade || !dados.estadio) {
      throw new Error("Preencha nome, cidade e estádio");
    }

    const novoTime = new Time(
      times.length + 1,
      dados.nome,
      dados.cidade,
      dados.estadio
    );

    times.push(novoTime);

    return novoTime;
  }

  listar(): Time[] {
    return times;
  }
}