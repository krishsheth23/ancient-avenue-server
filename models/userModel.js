import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      default: "000000000"
    },
    address: {
      type: Object,
      default: { street: "", city: "", state: "", zipcode: "", country: "" }
    },
    gender: {
      type: String,
      default: "Not Selected"
    },
    dob: {
      type: String,
      default: "Not Selected"
    },
    password: {
      type: String,
      required: true,
    },
    cartData: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
