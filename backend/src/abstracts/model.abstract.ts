import { Request, Response } from "express";

export default abstract class AbstractModel {
  abstract getById(req: Request, res: Response): Promise<any>;
  abstract getAll(req: Request, res: Response): Promise<any>;
}
