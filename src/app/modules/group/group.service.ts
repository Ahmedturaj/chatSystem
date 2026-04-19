import AppError from "../../error/appError";
import Message from "../message/message.model";
import { IGroup } from "./group.interface";
import { Group } from "./group.model";



export const createGroupService = async (userId: string, data: IGroup) => {
    const { name, description } = data;


    const group = new Group({
        name,
        description,
        creator: userId,
        members: [userId],
    });

    return await group.save();
};


export const getUserGroupsService = async (userId: string) => {
    return await Group.find({ members: userId })
        .populate('creator', 'firstName lastName email')
        .populate('members', 'firstName lastName email')
};

export const getAllGroupsService = async () => {
    return await Group.find()
        .populate('creator', 'firstName lastName email')
        .populate('members', 'firstName lastName email')
};


export const joinGroupService = async (groupId: string, userId: string) => {

    const group = await Group.findById(groupId);
    if (!group) throw new AppError(404, 'Group not found');

    if (group.members.includes(userId as any)) {
        throw new AppError(400, 'Already a member');
    }

    group.members.push(userId as any);
    await group.save();

    return group;
};


export const leaveGroupService = async (groupId: string, userId: string) => {
    const group = await Group.findById(groupId);
    if (!group) throw new Error('Group not found');

    group.members = group.members.filter(
        (id) => id.toString() !== userId
    );

    await group.save();
    return group;
};


export const getGroupMessagesService = async (
    groupId: string,
    userId: string
) => {
    const group = await Group.findById(groupId);
    if (!group || !group.members.includes(userId as any)) {
        throw new Error('Not a member of this group');
    }

    return await Message.find({ group: groupId })
        .populate('sender', 'firstName lastName email')
        .sort({ createdAt: 1 })
        .limit(100);
};