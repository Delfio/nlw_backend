import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

    async index(req: Request, res: Response) {
        const { city, uf, itens } = req.query;

        const parsedItens = String(itens)
            .split(',')
            .map(item => Number(item.trim()));

        console.log(parsedItens);

        const points = await knex('points')
            .join('point_itens', 'points.id', '=', 'point_itens.point_id')
            .whereIn('point_itens.item_id', parsedItens)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        return res.json(points);
    }

    show(req: Request, res: Response) {
        const { id } = req.params;

        knex('points').where('id', '=', id).first().then(point => {
            if (!point) {
                return res.status(400).json({erro: 'Ponto inexistente'})
            }

            knex('itens')
                .join('point_itens', 'itens.id', '=', 'point_itens.item_id')
                .where('point_itens.point_id', '=', id).select('itens.title').then(itens => {
                    return res.json({
                        ...point,
                        itens
                    });

                });
        })
    }

    async create(req: Request, res: Response) {
        const { 
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            itens
         } = req.body;

         const point = {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60'
        }

        const trx = await knex.transaction();

        const insertedIds = await trx('points').insert(point);

        const point_id = insertedIds[0];

        const pointItens = itens.map((item_id: number) =>{
            return {
                item_id,
                point_id
            }
        });

        await trx('point_itens').insert(pointItens);

        await trx.commit();

         return res.json({ok: true});

    }
}

export default new PointsController();