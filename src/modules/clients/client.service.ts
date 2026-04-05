import bcrypt from "bcryptjs";

import { UsersRepository } from "../users/user.repository";
import { ClientsRepository } from "./client.repository";
import { ConflictError, NotFoundError } from "../../shared/errors/httpErrors";

type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
  cpf: string;
  phone?: string;
};

type UpdateClientInput = {
  fullName?: string;
  cpf?: string;
  phone?: string;
};

type UpdateClientStatusInput = {
  isActive: boolean;
};

export class ClientsService {
  constructor(
    private clientsRepository: ClientsRepository,
    private usersRepository: UsersRepository,
  ) {}

  private sanitizeClient<T extends { user: { passwordHash: string } }>(
    client: T,
  ) {
    const { passwordHash, ...userWithoutPassword } = client.user;

    return {
      ...client,
      user: userWithoutPassword,
    };
  }

  async register(data: RegisterInput) {
    const existingUser = await this.usersRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError("Email already in use");
    }

    const existingClient = await this.clientsRepository.findByCpf(data.cpf);

    if (existingClient) {
      throw new ConflictError("CPF already in use");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const client = await this.clientsRepository.create({
      fullName: data.fullName,
      cpf: data.cpf,
      phone: data.phone,
      user: {
        create: {
          email: data.email,
          passwordHash,
          role: "CLIENT",
        },
      },
    });

    return this.sanitizeClient(client);
  }

  async findMany() {
    const clients = await this.clientsRepository.findMany();

    return clients.map((client) => this.sanitizeClient(client));
  }

  async findById(id: string) {
    const client = await this.clientsRepository.findById(id);

    if (!client) {
      throw new NotFoundError();
    }

    return this.sanitizeClient(client);
  }

  async update(id: string, data: UpdateClientInput) {
    const currentClient = await this.clientsRepository.findById(id);

    if (!currentClient) {
      throw new NotFoundError();
    }

    if (data.cpf && data.cpf !== currentClient.cpf) {
      const existingClient = await this.clientsRepository.findByCpf(data.cpf);

      if (existingClient && existingClient.id !== id) {
        throw new ConflictError("CPF already in use");
      }
    }

    const updatedClient = await this.clientsRepository.update(id, data);

    return this.sanitizeClient(updatedClient);
  }

  async updateStatus(id: string, data: UpdateClientStatusInput) {
    const client = await this.clientsRepository.findById(id);

    if (!client) {
      throw new NotFoundError();
    }

    const updatedClient = await this.clientsRepository.updateStatus(
      id,
      data.isActive,
    );

    return this.sanitizeClient(updatedClient);
  }
}
