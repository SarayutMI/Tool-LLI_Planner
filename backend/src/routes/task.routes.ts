import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', taskController.create);
router.get('/list/:listId', taskController.getByList);
router.get('/:taskId', taskController.getById);
router.put('/:taskId', taskController.update);
router.delete('/:taskId', taskController.remove);
router.patch('/:taskId/status', taskController.updateStatus);
router.patch('/:taskId/priority', taskController.updatePriority);
router.post('/:taskId/assignees', taskController.addAssignee);
router.delete('/:taskId/assignees/:userId', taskController.removeAssignee);
router.post('/reorder', taskController.reorder);
router.get('/:taskId/subtasks', taskController.getSubtasks);

export default router;
