import { Router } from 'express';
import * as folderController from '../controllers/folder.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get('/', folderController.list);
router.post('/', folderController.create);
router.get('/:folderId', folderController.get);
router.put('/:folderId', folderController.update);
router.delete('/:folderId', folderController.remove);

export default router;
