import mongoose, {Schema} from "mongoose";

export interface Itask  {
   task:string;
   note?:string;
   category?:string;
   priority: "high" | "medium" | "low";
   scheduledAt: Date;
   isCompleted: boolean
}


const taskSchema = new Schema<Itask>({
    task:{
        type:String,
        required:true
    },
    note:{
        type:String,
        maxlength:600
    },
    category:{
        type:String,
    },
    priority:{
        type:String,
        enum:[ "high", "medium", "low"],
        default:"medium"
    },
   scheduledAt:{
        type:Date,
        required:true
    },
    isCompleted:{
        type:Boolean,
        default:false
    }
}, {timestamps:true})

const taskModel = mongoose.model<Itask>('Task', taskSchema)

export default taskModel;