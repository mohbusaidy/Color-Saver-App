import mongoose from "mongoose";
import connectToMongodb from "../_database/connect-to-mongodb";
import { Palette } from "../_database/models";

const handler = async (request, response) => {
  switch (request.method) {
    case "POST":
      try {
        const { palette, user } = request.body;
        await connectToMongodb();

        const newPalette = await Palette.findOneAndReplace(
          { user: mongoose.Types.ObjectId(user) },
          {
            user: mongoose.Types.ObjectId(user),
            name: palette.name,
            savedAt: Date.now(),
            colors: palette.colors,
          },
          {
            upsert: true,
            returnDocument: "after",
          }
        );
        return response.json(newPalette);
      } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Server Error" });
      }
    default:
      return response.status(405).json({ message: "Method not allowed." });
    case "GET":
      try {
        await connectToMongodb();
        const searchTerm = request.query.userid
          ? {
              user: request.query.userid,
            }
          : {};
        const palettes = await Palette.find(searchTerm, null, {
          limit: 10,
          sort: { savedAt: -1 },
        })
          .populate("user")
          .exec();
        return response.json(palettes);
      } catch (error) {
        console.log(error);
        return response.status(500).json({ message: "Server error." });
      }
  }
};

export default handler;
