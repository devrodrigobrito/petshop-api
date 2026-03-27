import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { loginSchema, refreshTokenSchema } from "./auth.schema";

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);

    const result = await this.authService.login(data);

    return res.status(200).json(result);
  };

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    const result = await this.authService.refresh({
      refreshToken: refreshToken,
    });

    return res.status(200).json(result);
  };

  logout = async (req: Request, res: Response) => {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    await this.authService.logout(refreshToken);

    return res.status(200).json({ message: "Logged out successfully" });
  };
}
