export default abstract class Engine {
  //public constructor(time: () => number) {};

  engine: any;
  dispatcher: any;
  //time: () => number;

  public loader(path: string): void {};
  public play(): boolean { return true };
  public pause(): void {};
  public seek(): void {};
  //public seek(time: () => number): void {};
  public resize(): void {};
}

