import { Router, Request, Response, NextFunction } from 'express';
import { Web3Storage, getFilesFromPath } from 'web3.storage';
import fs from 'fs';
import { logError, returnError } from '../lib/ErrorHandler';

const routes = Router();

routes.get('/', (request, response) => {
    return response.status(200).json({ message: 'Service available' });
});

routes.post(
    '/upload',
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.files || Object.keys(request.files).length === 0) {
                return response.status(400).json({
                    message: 'No files were uploaded.',
                });
            }

            const { file } = request.files as any;
            const files = await getFilesFromPath(file.tempFilePath);

            const client = new Web3Storage({
                token: process.env.STORAGE_TOKEN as string,
            });

            const cid = await client.put(files);

            fs.unlinkSync(file.tempFilePath);

            return response.status(200).json({
                FotoCID: cid + files[0].name,
            });
        } catch (error: unknown) {
            next(error);
        }
    },
);

routes.use((req: Request, res: Response) => {
    return res.status(404).json({ message: 'Rota não encontrada' });
});

routes.use(logError);
routes.use(returnError);

export default routes;
