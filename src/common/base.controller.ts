import { Response, Router } from "express";
import { LoggerService } from "../common/lib/logger/logger.service.js";
import { ControllerRoute } from "./route.interface.js";

export abstract class BaseController {
  private readonly _router: Router;

  constructor(private logger: LoggerService) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public send<T>(res: Response, code: number, message: T) {
    return res.status(code).send(message);
  }

  public ok<T>(res: Response, message: T) {
    return this.send(res, 200, message);
  }

  public created(res: Response) {
    res.sendStatus(201);
  }

  protected bindRoutes(routes: ControllerRoute[]) {
    routes.forEach((route) => {
      this.logger.log(`[${route.method}] ${route.path}`);

      const handler = route.func.bind(this);
      this.router[route.method](route.path, handler);
    });
  }
}
