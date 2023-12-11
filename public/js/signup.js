import axios from "axios";
import { showAlert } from "./alert";

export const signup = async (name, mail, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/user/signup",
      data: { name, mail, password, passwordConfirm },
    });

    if (res.data.status === "success") {
      showAlert("success", "Sign up successful!");
      window.setTimeout(() => {
        location.assign("/");
      }, 2000);
    }
    console.log(res);
  } catch (err) {
    console.log(err);
    showAlert("error", err.response.data.message);
  }
};
