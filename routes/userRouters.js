const express = require("express");

const authControll = require("./../controller/authControll.js");
const {
  getAllUser,
  createUser,
  deleteUser,
  updateUser,
  getUser,
  updateMe,
  deleteMe,
  UplodeUserPhoto,
  resizeUserPhoto,
  getMe,
  re,
} = require("../controller/userController");
const router = express.Router();

router.route("/signup").post(authControll.signUp);
router.route("/logIn").post(authControll.logIn);
router.route("/logout").get(authControll.logout);

router.use(authControll.protect);

router.route("/me").get(getMe, getUser);
router.route("/updateMe").patch(UplodeUserPhoto, resizeUserPhoto, updateMe);
router.route("/deleteMe").delete(deleteMe);
router.route("/updateMyPassword").patch(authControll.updatePassword);
router.route("/forgetPassword").post(authControll.forgetPassword);
router.route("/resetPassword/:token").patch(authControll.resetPassword);

router.use(authControll.ristricTo("admin"));

router.route("/").get(getAllUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
