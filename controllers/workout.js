const Workout = require('../models/Workout');
const auth = require("../auth");
const { errorHandler } = require("../auth");

module.exports.addWorkout = async (req, res) => {

    try{
        const { name, duration } = req.body;
        const userId = req.user.id;

        if(!name || !duration){
            return res.status(400).message({
                error: "Name and duration needed"
            });
        }


        const newWorkout = new Workout({
            userId,
            name,
            duration
        });

        const savedWorkout = await newWorkout.save();

        return res.status(201).json(savedWorkout);

    } catch (error) {
        return res.status(500).json({
            error: 'Server Error',
            message: error.message
        })
    }





}

module.exports.getMyWorkouts = async (req, res) => {
    try{
        const userId = req.user.id

        let myWorkouts = await Workout.find({userId: userId})

        return res.status(200).json({
            workouts: myWorkouts
        });
    } catch (error){
        return res.status(500).json({
            error: 'Server Error',
            message: error.message
        })
    }

}

module.exports.updateWorkout = async (req, res) => {

    try{
        const userId = req.user.id
        const { name, duration } = req.body;

        const updatedDetails = {
            name,
            duration
        }

        const updatedWorkout = await Workout.findOneAndUpdate({ _id: req.params.workoutId, userId: userId }, updatedDetails, { new: true })

        if(!updatedWorkout){
            return res.status(404).json({
                message: "Workout not found or not authorized to update"
            })
        }

        res.status(200).json({
            message: "Workout updated successfully",
            updatedWorkout: updatedWorkout
        })

    } catch (error) {
        res.status(500).json({
            error: "Server Error",
            message: error.message
        })
    }
}

module.exports.deleteWorkout = async (req, res) => {

    try{
        const userId = req.user.id

        const deletedWorkout = await Workout.findOneAndDelete({ _id: req.params.workoutId, userId: userId })

        if(!deletedWorkout){
            return res.status(404).json({
                message: "Workout not found or not authorized to delete"
            })
        }
        
        res.status(200).json({
            message: "Workout deleted successfully",
            deletedWorkout: deletedWorkout
        })

    } catch (error) {
        res.status(500).json({
            error: "Server Error",
            message: error.message
        })
    }
}

module.exports.completeWorkoutStatus = async (req, res) => {

    try{
        const userId = req.user.id

        const updatedStatus = {
            status: "completed"
        }

        const updatedWorkout = await Workout.findOneAndUpdate({ _id: req.params.workoutId, userId: userId }, updatedStatus, { new: true })

        if(!updatedWorkout){
            return res.status(404).json({
                message: "Workout not found or not authorized to update"
            })
        }
        
        res.status(200).json({
            message: "Workout updated successfully",
            updatedWorkout: updatedWorkout
        })

    } catch (error) {
        res.status(500).json({
            error: "Server Error",
            message: error.message
        })
    }
}