import connectToMongoDb from "../_database/connect-to-mongodb";
import { User } from "../_database/models/";

const handler = async (request, response) => {
  console.log(request.body);
  try {
    await connectToMongoDb();
    const user = await User.findOne({ nickName: request.body.nickName });
    if (user) {
      return response.json(user);
    } else {
      return response.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return response.status(500).json({ message: "Server error" });
  }
};
export default handler;
