import connectToMongodb from "../_database/connect-to-mongodb";
import { User } from "../_database/models";

const handler = async (request, response) => {
  console.log(request.body);
  if (request.method !== "POST") {
    return response
      .status(405)
      .json({ message: `Method ${request.method} not allowed.` });
  }
  if (!request.body.nickName) {
    console.log("Nickname is missing");
    return response.status(400).json({ message: "Nickname is missing" });
  }

  try {
    await connectToMongodb();
    const user = await User.findOne({ nickName: request.body.nickName });
    if (user) {
      return response.json(user);
    } else {
      //   return response.status(404).json({ message: "User not found" });
      const error = new Error({ message: "User not found" });
      throw error;
    }
  } catch (err) {
    console.log(err);
    return response.status(500).json({ message: "Server Error" });
  }
};

export default handler;
