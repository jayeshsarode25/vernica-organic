import userModel from "../model/user.model.js";

export const getUsers = async (query) => {
  const { page = 1, limit = 10, search = "", role } = query;

  const filter = {
    isDeleted: false,
    ...(role && { role }),
    ...(search && {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }),
  };

  const user = await userModel
    .find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

    const total = await userModel.countDocuments(filter);

    return { user, total }
};

export const getUserById = async (id) =>{
    return await userModel.findById(id).select("-password");
} 

export const deleteUser = async (id)=>{
  return await userModel.findByIdAndUpdate(id,{ isDeleted:true },{ new:true });
};

export const toggleBlock = async (id)=>{
  const user = await userModel.findById(id);

  user.isBlocked = !user.isBlocked;
  await user.save();

  return user;
};