import { ITime } from "../interfaces/iTime";

export class Time implements ITime {
  constructor(
    public id: number,
    public nome: string,
    public cidade: string,
    public estadio: string
  ) {}
}