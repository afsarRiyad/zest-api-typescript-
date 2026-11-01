import taskModel, { Itask } from "../model/taskModel.ts";
import validate from "../../../middleware/validate";
import express, { RequestHandler } from 'express'
import taskSchema, { updateTaskSchema } from "../schemas/taskSchema.ts";
import AppError from "../../../utils/AppError.ts";
import z from "zod";

const router = express.Router()

// create task route 
type inputTask = z.infer<typeof taskSchema>;
type updateInputTask = z.infer<typeof updateTaskSchema>

interface GetAllTasksResponse {
  success: boolean;
  totalTasks: number;
  tasks: any[];
}
interface taskResponse {
   success: boolean,
   message: string,
  task: Itask
}

const createTask : RequestHandler<{},taskResponse, inputTask > = async (req, res, next)=>{
   const {date, time, ...rest} = req.body
  try {
     const newTask = await taskModel.create({
         ...rest,
         scheduledAt: new Date(`${date}T${time}:00+06:00`)
      })
  
      res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task: newTask
  })
  } catch (error) {
    next(error)
  }
};

router.post('/create/task', validate(taskSchema), createTask)

// get all task route 

const getAllTask : RequestHandler<{}, GetAllTasksResponse> = async (req, res, next)=>{
      try {
        const tasks = await taskModel.find()
        res.status(200).json({
          success:true,
          totalTasks: tasks.length,
          tasks
        })
      } catch (error) {
        next(error);
      }
};

router.get('/all-task', getAllTask)
 
//  task update route 

const updateTask : RequestHandler<{id : string}, taskResponse, updateInputTask > = async (req, res, next)=>{
    try {
          const {date, time, ...rest} = req.body

          const updateData = {...rest}
          const existingTask = await taskModel.findById(req.params.id).lean() as Itask | null
          if(date || time){
            if(!existingTask){
              throw new AppError('Task not found.', 404)
            }
            console.log(existingTask);
            const existingDate = existingTask.scheduledAt
                                 .toLocaleDateString("en-CA", {timeZone: "Asia/Dhaka"})
            const existingTime = existingTask.scheduledAt
                                  .toLocaleTimeString("en-GB", {
                                   timeZone: "Asia/Dhaka",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                    });
            const finalDate = date || existingDate
            const finalTime = time || existingTime

            updateData.scheduledAt = new Date(`${finalDate}T${finalTime}:00+06:00`)

          }

         const updatedTask = await taskModel.findByIdAndUpdate(req.params.id, updateData,{
          returnDocument: 'after',
          runValidators: true
        })
         if(!updatedTask){
           throw new AppError("Task not found", 404)
         }
         res.status(200).json({
            success:true,
            message: "Task updated successfully.",
            task: updatedTask
         })
      } catch (error) {
        next(error);
      }
}

router.patch('/update/task/:id', validate(updateTaskSchema), updateTask)

// task delete route

const deleteTask : RequestHandler = async (req, res, next)=>{
    try {
        const deletedTask = await taskModel.findByIdAndDelete(req.params.id)
        if(!deletedTask){
            throw new AppError("Task not found", 404)
        }
        res.status(200).json({
            success:true,
            message: "Task deleted successfully.",
            task: deletedTask
        })
    } catch (error) {
        next(error);
    }
}

router.delete('/delete/task/:id', deleteTask)

export default router;