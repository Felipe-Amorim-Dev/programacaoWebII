import { IPartida } from "../interfaces/iPartida";

export class Partida implements IPartida {
  constructor(
    public id: number,
    public timeCasaId: number,
    public timeForaId: number,
    public golsCasa: number,
    public golsFora: number,
    public data: string
  ) {}
}