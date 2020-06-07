import { Request, Response } from "express";
import knex from '../database/connection';

class ItensController {
    index(req: Request, res: Response) {
        knex('itens').select('*').then(itens => {
            const itensSerialized = itens.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    image_url: `http://localhost:3333/uploads/${item.image}`
                }
            })
            return res.json(itensSerialized)
        });
    }
}

export default new ItensController();