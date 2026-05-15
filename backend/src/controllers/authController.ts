import type { Request, Response } from 'express';
import User from '../models/User';
import { checkPassword, generateJWT, hashPassword } from '../utils';

export class AuthController {
    static CreateUser = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            const userExists = await User.findOne({ email });
            if (userExists) return res.status(400).json({ error: 'El usuario ya existe' });

            const userNameUsed = await User.findOne({ name: req.body.name });
            if (userNameUsed) return res.status(400).json({ error: 'Nombre de usuario en uso' });

            const user = new User(req.body);
            user.password = await hashPassword(password);
            await user.save();

            return res.status(201).send('Usuario creado correctamente');
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al crear usuario' });
        }
    };

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            const userExists = await User.findOne({ email });
            if (!userExists) return res.status(400).json({ error: 'Usuario no encontrado' });

            const passCorrect = await checkPassword(password, userExists.password);
            if (!passCorrect) return res.status(401).json({ error: 'La contraseña es incorrecta' });

            const token = generateJWT(userExists._id);
            return res.send(token);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    };

    static user = async (req: Request, res: Response) => {
        return res.json(req.user);
    };
}
