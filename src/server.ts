import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import routes from './routes';

export const app = express();

app.use(
    cors({
        origin:
            process.env.NODE_ENV === 'development'
                ? '*'
                : process.env.AGILUS_URL,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const tempFileDir = path.resolve(__dirname, '..', 'tmp');

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir,
        preserveExtension: true,
        safeFileNames: true,
    }),
);

app.use(routes);

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
    console.log(`✔✔✔✔✔✔ File Handler running at PORT: ${PORT} ✔✔✔✔✔✔`);
});
