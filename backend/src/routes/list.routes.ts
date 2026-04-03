import { Router } from 'express';
import * as listController from '../controllers/list.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get('/', listController.list);
router.post('/', listController.create);
router.get('/:listId', listController.get);
router.put('/:listId', listController.update);
router.delete('/:listId', listController.remove);

export default router;
