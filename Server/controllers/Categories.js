const Category = require('../models/Category');
const Course = require('../models/Course');

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

exports.createCategory = async (req,res) =>{
    try {
        const {name, description} =  req.body;

        if(!name || !description){
            return res.status(401).json({
                success:false,
                message:"Tag name or description not available"
            })
        }

        const newCategory = await Category.create({
            name,
            description
        })

        if (!newCategory) {
            return res.status(401).json({
                success:false,
                message:"Error in pushing new tag to db"
            }) 
        }

        return res.status(200).json({
            success:true,
            message:"Tag created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.showAllCategories = async (req,res) => {
    try {
        const allCategories =  await Category.find({},{name:true,
                                                description:true});
        
            return res.status(200).json({
                success:true,
                message:"All tags received",
                data:allCategories
            })  
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// CORRECTED FUNCTION
exports.categoryPageDetails = async (req,res) => {
    try {
        // 1. Get categoryId from req.params, NOT req.body
        const { categoryId } = req.params;
        console.log("PRINTING CATEGORY ID: ", categoryId);

        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: "ratingAndReviews",
            })
            .exec();

        if (!selectedCategory) {
            console.log("Category not found.")
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        if (selectedCategory.course.length === 0) {
            console.log("No courses found for the selected category.")
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            });
        }

        // 2. Handle the case where there is only one category
        const categoriesExceptSelected = await Category.find({ _id: { $ne: categoryId } });
        
        let differentCategory = null;
        if (categoriesExceptSelected.length > 0) {
            const randomIndex = getRandomInt(categoriesExceptSelected.length);
            differentCategory = await Category.findById(categoriesExceptSelected[randomIndex]._id)
                .populate({
                    path: "course",
                    match: { status: "Published" },
                })
                .exec();
        }

        // 3. Get top-selling courses using a more robust query
        const mostSellingCourses = await Course.find({ status: 'Published' })
            .sort({ studentsEnrolled: -1 }) // Sort by number of students (descending)
            .limit(10) // Get top 10
            .exec();

        res.status(200).json({
            success: true,
            data: {
                selectedCategory: selectedCategory,
                differentCategory: differentCategory,
                mostSellingCourses: mostSellingCourses,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}