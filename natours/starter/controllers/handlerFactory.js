const { StatusCodes } = require('http-status-codes');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendResponse = require('../utils/sendResponse');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError(`No document found with the ID ${req.params.id}`, StatusCodes.NOT_FOUND));

    sendResponse(res, StatusCodes.NO_CONTENT, null);
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!doc) return next(new AppError(`No document found with the ID ${req.params.id}`, StatusCodes.NOT_FOUND));

    sendResponse(res, StatusCodes.OK, doc);
  });

exports.createOne = (Model) => 
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    sendResponse(res, StatusCodes.CREATED, newDoc);
  });
