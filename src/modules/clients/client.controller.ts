import { Request, Response } from "express";
import {
  registerSchema,
  updateClientSchema,
  updateClientStatusSchema,
} from "../clients/client.schema";

import { ClientsService } from "./client.service";

export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  register = async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);

    const client = await this.clientsService.register(data);

    return res.status(201).json(client);
  };

  findMany = async (_req: Request, res: Response) => {
    const clients = await this.clientsService.findMany();

    return res.status(200).json(clients);
  };

  findById = async (req: Request, res: Response) => {
    const clientId = req.params.id;

    const client = await this.clientsService.findById(clientId as string);

    return res.status(200).json(client);
  };

  update = async (req: Request, res: Response) => {
    const clientId = req.params.id;
    const data = updateClientSchema.parse(req.body);

    const client = await this.clientsService.update(clientId as string, data);

    return res.status(200).json(client);
  };

  updateStatus = async (req: Request, res: Response) => {
    const clientId = req.params.id;
    const data = updateClientStatusSchema.parse(req.body);

    const client = await this.clientsService.updateStatus(
      clientId as string,
      data,
    );

    return res.status(200).json(client);
  };
}
