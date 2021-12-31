const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');


const createNameForModel = model => {
  const modelName = model.collection.collectionName;

  return modelName.slice(0, modelName.length - 1);
}

exports.deleteOne = Model => catchAsync(async (req,res, next) => {
  const {params: {id}} = req;
  const doc = await Model.findByIdAndDelete({ _id: id });
  const modelName = createNameForModel(Model);

  if (!doc) {
    return next(new AppError(`No ${modelName} found with that id`, 404))
  }

  res.status(200).json({
    status: `${modelName} was successfully deleted`,
    data: {
      [modelName]: doc
    }
  });
});

exports.updateOne = Model =>  catchAsync(async (req,res,next) => {
  const { body, params: { id } } = req;
  const modelName = createNameForModel(Model);
  const doc = await Model.findByIdAndUpdate({ _id: id }, body, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    return next(new AppError(`No ${modelName} found with that id`, 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      [modelName]: doc
    }
  });
});

exports.createOne = Model => catchAsync(async (req,res,next) => {
  const {body} = req;
  const modelName = createNameForModel(Model);
  const doc = await Model.create(body);

  if (!doc) {
    return next(new AppError(`No ${modelName} found with that id`, 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      [modelName]: doc
    }
  });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req,res,next) => {
  const { params: { id } } = req;
  const modelName = createNameForModel(Model);
  let query = Model.findById({_id: id});

  if (popOptions) query = query.populate(popOptions);

  const doc = await query;

  if (!doc) {
    return next(new AppError(`No ${modelName} found with that id`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      [modelName]: doc
    }
  });
});

exports.getAll = Model => catchAsync(async (req,res,next) => {
  const modelName = createNameForModel(Model);
  // Allow nested GET reviews on tour
  let filter = {};
  if (req.params.tourId) filter = {tour: req.params.tourId};
  // EXECUTE QUERY
  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();

  // Shows info about current query
  // const doc = await features.query.explain();
  const doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    result: doc.length,
    data: {
      [modelName]: doc
    }
  });
});
