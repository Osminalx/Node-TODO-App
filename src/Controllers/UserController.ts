import {createUser, login} from '../Services/UserService.ts'
import type { Request, Response } from 'express';

export const createUserController = async (req: Request, res: Response) => {
    try {
        const user = await createUser(req.body)
        res.status(201).json(user)
    } catch (error) {
        if(error instanceof Error){
            res.status(400).send(error.message)
        }else{
            res.status(500).send(error)
        }
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const user = await login(req.body)
        res.status(200).json(user)
    } catch (error) {
        if(error instanceof Error){
        res.status(401).send(error.message)
        }else{
            res.status(500).send(error)
        }
    }
}