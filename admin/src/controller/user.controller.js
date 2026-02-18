import * as userServices from "../services/user.services.js";

export const getUser = async (req, res) => {
  const user = req.query;
  try {
    const data = await userServices.getUsers(user);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userServices.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    await userServices.deleteUser(userId);

    res.json({ message: "User Successfully Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const blockUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userServices.toggleBlock(userId);

    res.json({
      message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
