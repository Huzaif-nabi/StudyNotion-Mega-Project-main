import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import CourseCard from '../components/core/Catalog/Course_Card'; // Renamed for PascalCase
import CourseSlider from '../components/core/Catalog/CourseSlider';

const Catalog = () => {
    const { catalogName } = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [active, setActive] = useState(1);
    const [loading, setLoading] = useState(false);

    // Fetch category ID safely
    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API);
                // FIX 1: Safely find the matching category and get its ID
                const matchingCategory = res?.data?.data?.find(
                    (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName.toLowerCase()
                );
                if (matchingCategory) {
                    setCategoryId(matchingCategory._id);
                } else {
                    // Handle case where category doesn't exist if needed
                    console.error("Category not found");
                }
            } catch (error) {
                console.error("Could not fetch categories", error);
            }
            // Note: We don't setLoading(false) here, the next useEffect will handle it
        };
        getCategories();
    }, [catalogName]);

    // Fetch page details once we have a category ID
    useEffect(() => {
        const getCategoryDetails = async () => {
            setLoading(true);
            try {
                const res = await getCatalogPageData(categoryId);
                if (res) {
                    // FIX 2: Set the nested 'data' object to state, not the whole response
                    setCatalogPageData(res.data);
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        };
        if (categoryId) {
            getCategoryDetails();
        }
    }, [categoryId]);

    if (loading) {
        return (
            <div className='h-screen flex justify-center items-center text-richblack-100 mx-auto text-3xl'>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <>
            {!catalogPageData ? (
                <div className='text-center text-xl text-richblack-300 my-8'>No Courses Found</div>
            ) : (
                <>
                    <div className="box-content bg-richblack-800 px-4">
                        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
                            {/* FIX 3: Access data using the correct nested path */}
                            <p className="text-sm text-richblack-300">{`Home / Catalog / `}
                                <span className="text-yellow-25">{catalogPageData?.selectedCategory?.name}</span>
                            </p>
                            <p className="text-3xl text-richblack-5">{catalogPageData?.selectedCategory?.name}</p>
                            <p className="max-w-[870px] text-richblack-200">{catalogPageData?.selectedCategory?.description}</p>
                        </div>
                    </div>

                    <div>
                        {/* section1 */}
                        <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                            <div className="section_heading">Courses to get you started</div>
                            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                                <p className={`px-4 py-2 ${active === 1 ? "border-b border-b-yellow-25 text-yellow-25" : "text-richblack-50"} cursor-pointer`} onClick={() => setActive(1)}>
                                    Most Popular
                                </p>
                                <p className={`px-4 py-2 ${active === 2 ? "border-b border-b-yellow-25 text-yellow-25" : "text-richblack-50"} cursor-pointer`} onClick={() => setActive(2)}>
                                    New
                                </p>
                            </div>
                            <div>
                                {/* FIX 3: Use correct property names: selectedCategory and course */}
                                <CourseSlider Courses={catalogPageData?.selectedCategory?.course} />
                            </div>
                        </div>

                        {/* section2 */}
                        <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                            {/* FIX 3: Use correct property names: differentCategory */}
                            <div className="section_heading">Top courses in {catalogPageData?.differentCategory?.name}</div>
                            <div className="py-8">
                                <CourseSlider Courses={catalogPageData?.differentCategory?.course} />
                            </div>
                        </div>

                        {/* section3 */}
                        <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
                            <div className="section_heading">Frequently Bought</div>
                            <div className='py-8'>
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    {/* FIX 3: Use correct property name: mostSellingCourses */}
                                    {catalogPageData?.mostSellingCourses?.slice(0, 4)
                                        .map((course, index) => (
                                            <CourseCard course={course} key={index} Height={"h-[400px]"} />
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    );
};

export default Catalog;