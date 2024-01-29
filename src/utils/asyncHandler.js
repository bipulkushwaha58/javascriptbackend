const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(
        requestHandler(req,res,next)
    )
    .catch((error) => next(error));
  };
};

export {asyncHandler}

//above function we can write like below also

// const asyncHandler=(requestHandler)=>async(req,res,next)=>{
//     try {
//         await asyncHandler(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }

// }