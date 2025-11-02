import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  getTrashedTasks,
  postTaskActivity,
  trashTask,
  updateTask,
  restoreAllTasks,
  permanentlyDeleteTask,
  permanentlyDeleteAllTasks,  // Import the restoreAllTasks function
} from "../controllers/taskController.js";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewave.js";

const router = express.Router();

router.post("/create", protectRoute, createTask);
router.post("/duplicate/:id", protectRoute, duplicateTask);
router.post("/activity/:id", protectRoute, postTaskActivity);

router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getTasks);
router.get("/trash", protectRoute, getTrashedTasks);
router.get("/:id", protectRoute, getTask);

router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
router.put("/trash/:id", protectRoute, trashTask); // For trashing tasks
router.put("/restore/:id", protectRoute, deleteRestoreTask); // Route for restoring a single task
router.put("/restore-all", protectRoute, restoreAllTasks);  // ✅ new route for restoring all tasks
router.put("/:id", protectRoute, updateTask);

// DELETE /delete-restore/:id
router.delete("/delete/:id", protectRoute, permanentlyDeleteTask); // ✅ now only for deleting
router.delete("/delete-all", protectRoute, permanentlyDeleteAllTasks); // ✅ delete all

export default router;
