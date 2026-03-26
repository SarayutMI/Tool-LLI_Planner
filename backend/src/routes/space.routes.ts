import { Router } from 'express';
import * as spaceController from '../controllers/space.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get('/', spaceController.list);
router.post('/', spaceController.create);
router.get('/:spaceId', spaceController.get);
router.put('/:spaceId', spaceController.update);
router.delete('/:spaceId', spaceController.remove);

export default router;
