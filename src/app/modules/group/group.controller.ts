import AppError from "../../error/appError";
import catchAsync from "../../utils/catchAsycn";
import sendResponse from "../../utils/sendResponse";
import User from "../user/user.model";
import { createGroupService, getAllGroupsService, getGroupMessagesService, getUserGroupsService, joinGroupService, leaveGroupService } from "./group.service";

export const createGroup = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(400, "user not found");
    }
    const result = await createGroupService(userId, req.body);
    if (!result) {
        throw new AppError(400, "Failed to create group");
    };
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Group created successfully",
        data: result
    });
});

export const getUserGroups = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(400, "user not found");
    };
    const result = await getUserGroupsService(userId);
    if (!result) {
        throw new AppError(400, "failed to get groups");
    };
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Groups retrieved successfully",
        data: result
    });
});

export const getAllGroups = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(400, "user not found");
    };
    const result = await getAllGroupsService();
    if (!result) {
        throw new AppError(400, "failed to get groups");
    };
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Groups retrieved successfully",
        data: result
    });

});

export const joinGroup = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(400, "user not found");
    };
    const groupId = req.params.groupId;
    if (!groupId) {
        throw new AppError(400, "GroupId is required.");
    };
    const result = await joinGroupService(groupId, userId);
    if (!result) {
        throw new AppError(400, "Joining in group is failed.");
    };

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Join into group successfully",
        data: result
    });

});

export const leaveGroup = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(400, "user not found");
    };
    const groupId = req.params.groupId;
    if (!groupId) {
        throw new AppError(400, "GroupId is required.");
    };
    const result = await leaveGroupService(groupId, userId);
    if (!result) {
        throw new AppError(400, "leaving group is failed");
    };

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "You leaved the group successfully",
        data: result
    });
});

export const getGroupMessages = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(400, "user not found");
    };
    const groupId = req.params.groupId;
    if (!groupId) {
        throw new AppError(400, "GroupId is required.");
    };
    const result = await getGroupMessagesService(groupId, userId);
    if (!result) {
        throw new AppError(400, "Messages Getting request is failed");
    };

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Group Messages retrieved successfully",
        data: result
    });
});
