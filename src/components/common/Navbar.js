import React, { useEffect, useState } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";

import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import './loader.css';

const Navbar = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const location = useLocation();

    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSublinks = async () => {
            setLoading(true);
            try {
                const result = await apiConnector("GET", categories.CATEGORIES_API);
                if (result?.data?.data) {
                    setSubLinks(result.data.data);
                }
            } catch (error) {
                console.error("Could not fetch the category list:", error);
            }
            setLoading(false);
        };
        fetchSublinks();
    }, []);

    const matchRoute = (route) => {
        return route ? matchPath({ path: route }, location.pathname) : false;
    };

    return (
        <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
            <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
                <Link to="/">
                    <img src={logo} alt="StudyNotion Logo" width={160} height={42} loading='lazy' />
                </Link>

                <nav>
                    <ul className='hidden md:flex gap-x-6 text-richblack-25'>
                        {NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {link.title === "Catalog" ? (
                                    <div className='relative flex items-center gap-2 group'>
                                        <p>{link.title}</p>
                                        <IoIosArrowDown />

                                        {/* === CODE CHANGED ON THIS LINE === */}
                                        <div className={`invisible absolute left-[50%] top-full z-50 flex translate-x-[-50%] flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px] mt-2`}>
                                            <div className='absolute left-[50%] top-0 h-6 w-6 translate-x-[-50%] translate-y-[-45%] rotate-45 rounded bg-richblack-5'>
                                            </div>

                                            {loading ? (
                                                <span className="loader"></span>
                                            ) : (
                                                subLinks?.length > 0 ? (
                                                    subLinks.map((subLink) => (
                                                        <Link
                                                            className='rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50'
                                                            to={`/catalog/${subLink.name.toLowerCase().split(" ").join("-")}`}
                                                            key={subLink._id}
                                                        >
                                                            <p>{subLink.name}</p>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <p className='text-center'>No courses found</p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={link?.path}>
                                        <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                            {link.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className='hidden md:flex gap-x-4 items-center'>
                    {user && user?.accountType !== "Instructor" && (
                        <Link to="/dashboard/cart" className='relative pr-2'>
                            <AiOutlineShoppingCart className='text-2xl text-richblack-100' />
                            {totalItems > 0 && (
                                <span className='absolute -bottom-2 -right-0 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100'>
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    {token === null && (
                        <>
                            <Link to="/login">
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                    Log in
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                    Sign Up
                                </button>
                            </Link>
                        </>
                    )}
                    {token !== null && <ProfileDropDown />}
                </div>

                <div className='mr-4 md:hidden text-[#AFB2BF] scale-150'>
                    <RxHamburgerMenu />
                </div>
            </div>
        </div>
    );
};

export default Navbar;