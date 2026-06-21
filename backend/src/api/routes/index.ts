import { Router } from "express"
import userRoutes from "./users.js"
import authRoutes from "./auth.js"
import characterRoutes from "./character.js"

const router = Router()

router.use("/users", userRoutes)
router.use("/auth", authRoutes)
router.use("/characters", characterRoutes)

router.use("/", function (req, res, next) {
  res.render("index", { title: "Express" })
})

export default router
