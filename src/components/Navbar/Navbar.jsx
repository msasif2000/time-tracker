import { BiUserCircle } from "react-icons/bi";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";



const Navbar = () => {
    const { user, userLogout } = useAuth();

    const handleLogout = () => {
        userLogout()
    }

    const navlinks =
        <>
            <li className=""><NavLink to='/'>Home</NavLink></li>
            <li className=""><NavLink to='/availableCamp'>Available Camp</NavLink></li>


            <li className=""><NavLink to='/dashboard'>Dashboard</NavLink></li>

            <li className=""><NavLink to='/contact'>Contact Us</NavLink></li>
            {
                user ?
                    ''
                    :
                    <>
                        <li><NavLink to='/login'>Sign in</NavLink></li>
                        <button className="rounded-xl border-2 border-red-600 "><li><NavLink to='/register'>Sign up</NavLink></li></button>
                    </>
            }
        </>
    return (
        <div className=" ">
            <div className="navbar">
                <div className="navbar-start w-3/5">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="red"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="sty menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-orange-600 rounded-box w-52 ">
                            {navlinks}
                        </ul>
                    </div>
                    <div className="flex items-center gap-2">
                        <a className="flex flex-col text-center"><span className="text-red-600 text-2xl font-bold">SAVE LIFE</span>  <span className="text-red-800 font-semibold">Medical Camp</span></a>
                    </div>
                </div>
                <ul className="navbar-center hidden lg:flex sty">
                    {navlinks}
                </ul>
                <div className="navbar-end">
                    {
                        user ?
                            <>
                                <li className="list-none"><button onClick={handleLogout} className="btn btn-sm md:mr-2 mr-1 border-2 border-red-600 text-sm md:text-xl">Sign Out</button></li>
                                <Link to='/dashboard'><img src={user.photoURL} alt="" className="h-14 w-14 rounded-full bg-red-600 p-1" /></Link>
                            </>
                            :
                            <Link to='/login'><BiUserCircle className="text-red-600 text-4xl"></BiUserCircle></Link>

                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;