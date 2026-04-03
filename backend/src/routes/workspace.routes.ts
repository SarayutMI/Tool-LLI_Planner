import { Router } from 'express';
import * as workspaceController from '../controllers/workspace.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', workspaceController.list);
router.post('/', workspaceController.create);
router.get('/:workspaceId', workspaceController.get);
router.put('/:workspaceId', workspaceController.update);
router.delete('/:workspaceId', workspaceController.remove);

router.post('/:workspaceId/members', workspaceController.addMember);
router.delete('/:workspaceId/members/:userId', workspaceController.removeMember);
router.patch('/:workspaceId/members/:userId/role', workspaceController.updateMemberRole);

export default router;
