import { Router } from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { createGroup, getAllGroups, getGroupMessages, getUserGroups, joinGroup, leaveGroup } from './group.controller';


const router = Router();

router.post('/create', auth(userRole.user), createGroup);
router.get('/my', auth(userRole.user), getUserGroups);
router.get('/', auth(userRole.user), getAllGroups);           // discovery
router.post('/:groupId/join', auth(userRole.user), joinGroup);
router.post('/:groupId/leave', auth(userRole.user), leaveGroup);
router.get('/:groupId/messages', auth(userRole.user), getGroupMessages);

export default router;