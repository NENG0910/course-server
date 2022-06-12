const express = require("express");
const app = express();
const router = require("express").Router();
const courseValidation = require("../vaildation").courseValidation;
const Course = require("../models").courseModel;
const User = require("../models").userModel;

//middleware
router.use((req, res, next) => {
  console.log("A request is comming in API");
  next();
});

//列出所有課程
router.get("/", (req, res) => {
  //populate() 把instructor的參考值(userSchema中的username、email)帶到Coure
  Course.find({})
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.send(course);
    })
    .catch(() => {
      res.status(500).send("ERROR! Can not find the course.");
    });
});

//Course 顯示instructor的post course
router.get("/instructor/:_instructor_id", (req, res) => {
  let { _instructor_id } = req.params;
  Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send("ERROR! Can not get course data.");
    });
});

//Course顯示student的course
router.get("/student/:_student_id", (req, res) => {
  let { _student_id } = req.params;
  Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.status(500).send("ERROR! Can not get course data.");
    });
});

//搜尋課程
router.get("/findByName/:name", (req, res) => {
  let { name } = req.params;
  Course.find({ title: name })
    .populate("instructor", ["username", "email"])
    .then((course) => {
      res.status(200).send(course);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/:_id", (req, res) => {
  let { _id } = req.params;
  Course.findOne({ _id })
    .populate("instructor", ["email"])
    .then((course) => {
      res.send(course);
    })
    .catch((e) => {
      res.send(e);
    });
});

//instructor建立新課程
router.post("/", async (req, res) => {
  //validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let { title, description, price } = req.body;
  if (req.user.isStudent()) {
    return res.status(400).send("Only instructor can post a course.");
  }
  let newCourse = new Course({
    title,
    description,
    price,
    instructor: req.user._id,
  });
  try {
    await newCourse.save();
    res.status(200).send("New course has been saved.");
  } catch (err) {
    res.status(400).send("Cannot save course.");
  }
});

router.patch("/:_id", async (req, res) => {
  //validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let { _id } = req.params;
  const course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      msg: "Course not found.",
    });
  }
  //only course's instructor or adimin can update this course
  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true, //update validators are off by defult,set true when need to update.
    })
      .then(res.send("Course has been updated"))
      .catch((e) => {
        res.send({
          success: false,
          msg: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      msg: "only the instructor of this course or web admin can edit this course.",
    });
  }
});

router.delete("/:_id", async (req, res) => {
  //validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let { _id } = req.params;
  const course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      msg: "Course not found.",
    });
  }
  //only course's instructor or adimin can delete this course
  if (course.instructor.equals(req.user._id) || req.user.isAdmin()) {
    Course.findOneAndDelete({ _id })
      .then(res.send("Course has been deleted"))
      .catch((e) => {
        res.send({
          success: false,
          msg: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      msg: "only the instructor of this course or web admin can deleted this course.",
    });
  }
});

module.exports = router;
