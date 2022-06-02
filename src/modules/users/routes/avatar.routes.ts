import { Router } from 'express';
import multer from 'multer';

import { ensureAuthenticated } from '@shared/middleware/ensureAuthenticated';
import { uploadConfig } from '@config/upload';
import { AvatarController } from '../controller/AvatarController';

const uploadMulter = multer(uploadConfig.multer);
const avatarRoutes = Router();
const avatarController = new AvatarController();

avatarRoutes.use(ensureAuthenticated);

avatarRoutes.post('/', uploadMulter.single('avatar'), avatarController.update);
avatarRoutes.delete('/', avatarController.delete);

export { avatarRoutes };
