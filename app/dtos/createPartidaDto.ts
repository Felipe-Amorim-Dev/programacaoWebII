export class CreatePartidaDto {
  constructor(
    public timeCasaId: number,
    public timeForaId: number,
    public golsCasa: number,
    public golsFora: number,
    public data: string
  ) {}
}