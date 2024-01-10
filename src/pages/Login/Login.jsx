import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import { useState } from "react";
import useAuth from "../../Hooks/useAuth";
import usePublicLink from "../../Hooks/usePublicLink";


const Login = () => {
    const { googleLogin, userLogin, userLogout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const publicLink = usePublicLink();
    // const from = location.state?.from?.pathname || "/";

    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const role = e.target.role.value;
        //console.log(email, password, role);
        publicLink.get(`/usersLogin?email=${email}&role=${role}`)
            .then(res => {
                if (res.data) {
                    userLogin(email, password)
                        .then(result => {
                            if (result) {
                                Swal.fire({
                                    title: 'User Login Successful.',
                                    showClass: {
                                        popup: 'animate__animated animate__fadeInDown'
                                    },
                                    hideClass: {
                                        popup: 'animate__animated animate__fadeOutUp'
                                    }
                                });
                                navigate(location.state?.from ? location.state.from : '/dashboard');
                            }
                        })
                        .catch(error => {
                            console.log(error.message)
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'check email and password again!',
                                footer: '<a href="/login">Sign in again?</a>'
                            });

                        })
                }
            })
            .catch(error => {
                console.log(error.message)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'check email and role again!',
                    footer: '<a href="/login">Sign in again?</a>'
                });

            })

    }

    const [selectedRole, setSelectedRole] = useState(null);

    const handleRoleSelection = async () => {
        const { value: role } = await Swal.fire({
            title: 'Select Your Role',
            input: 'select',
            inputOptions: {
                'admin': 'Admin',
                'user': 'User',
                'professional': 'Professional',
            },
            inputPlaceholder: 'Select your role',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Role cannot be empty';
                }
            },
        });

        if (role) {
            setSelectedRole(role.toLowerCase());
        }
    };

    const handleGoogleLogin = async () => {
        // Prompt the user to select a role
        await handleRoleSelection();

        if (selectedRole) {
            // Continue with Google login
            googleLogin()
                .then((result) => {
                    const { displayName, email, photoURL } = result.user;
                    // Check if the user with the provided email and role exists in the database
                    publicLink.get(`/usersLogin?email=${email}&role=${selectedRole}`)
                        .then(res => {
                            if (res.data) {
                                // User with matching email and role found, proceed with login
                                const userInfo = { name: displayName, email, photoURL, role: selectedRole };
                                publicLink.post('/users', userInfo).then((res) => {
                                    if (res.data.insertedId) {
                                        Swal.fire({
                                            title: 'Login  Successful!',
                                            text: 'You are Logged in',
                                            icon: 'success',
                                            confirmButtonText: 'Ok',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                navigate(
                                                    location.state?.from ? location.state.from : '/dashboard'
                                                );
                                            }
                                        });
                                    }
                                });

                                navigate(location.state?.from ? location.state.from : '/dashboard');
                            } else {
                                const userInfo = { name: displayName, email, photoURL, role: 'user' };
                                publicLink.post('/users', userInfo)
                                    .then((res) => {
                                        console.log(
                                            res.data
                                        );
                                        if (res.data.insertedId) {
                                            Swal.fire({
                                                title: 'Account Created!',
                                                text: 'You are Logged in',
                                                icon: 'success',
                                                confirmButtonText: 'Ok',
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    navigate(
                                                        location.state?.from ? location.state.from : '/dashboard'
                                                    );
                                                }
                                            });
                                        }
                                        else {
                                            userLogout();
                                            // User with matching email and role not found, display error
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Error!',
                                                text: 'User with the provided email and role not found!',
                                                confirmButtonText: 'Ok',
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    navigate(location.state?.from ? location.state.from : '/login');
                                                }
                                            });
                                        }
                                    })
                            }
                        })
                        .catch(() => {
                            // Handle database error
                            const userInfo = { name: displayName, email, photoURL, role: selectedRole };
                            publicLink.post('/users', userInfo)
                                .then((res) => {
                                    if (res.data.insertedId) {
                                        Swal.fire({
                                            title: 'Account Created!',
                                            text: 'You are Logged in',
                                            icon: 'success',
                                            confirmButtonText: 'Ok',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                navigate(
                                                    location.state?.from ? location.state.from : '/dashboard'
                                                );
                                            }
                                        });
                                    }
                                });

                            navigate(location.state?.from ? location.state.from : '/dashboard');
                        });
                })
                .catch((error) => {
                    // Handle Google login error
                    console.log(error.message);
                    Swal.fire({
                        title: 'Error!',
                        text: error.message,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate(location.state?.from ? location.state.from : '/login');
                        }
                    });
                });
        } else {
            // Handle if the user cancels the role selection
            console.log('Role selection canceled');
        }
    };

    return (
        <div>
            <div className="">
                <div className="hero min-h-screen  lg:w-4/5 md:w-5/6 mx-auto">
                    <div className="hero-content flex-col mx-auto w-full">
                        <div className="text-center">
                            <h1 className="text-5xl font-bold">Login now!</h1>
                        </div>
                        <div className="card flex-shrink-2 w-full max-w-sm border-4 border-x-transparent shadow-2xl shadow-red-600 border-red-600">
                            <form onSubmit={handleLogin} className="card-body">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-bold">Please Select Your Role</span>
                                    </label>
                                    <div required className="flex items-center gap-4 ml-2">
                                        <label>
                                            <input type="radio" name='role' value="admin" className="mr-2" required />
                                            Admin
                                        </label>
                                        <label>
                                            <input type="radio" name='role' value="user" className="mr-2" required />
                                            User
                                        </label>
                                        <label>
                                            <input type="radio" name='role' value="professional" className="mr-2" required />
                                            Professional
                                        </label>
                                    </div>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input type="email" name="email" placeholder="email" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input type="password" name="password" placeholder="password" className="input input-bordered" required />
                                </div>
                                <label className="label">
                                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                                </label>
                                <div className="form-control mt-6">
                                    <input className={`btn btn-sm text-white py-2 rounded-xl font-bold bg-red-600 `} type="submit" value="Sign in" />
                                </div>

                            </form>
                            <div className="flex justify-center">
                                <label className="label">
                                    <p>Don`t have an Account? <Link to="/register" className="underline text-red-600 font-bold">Sign Up</Link></p>
                                </label>
                            </div>
                            <div className="text-center">
                                <p>--or--</p>
                                <p>continue with</p>

                            </div>
                            <div onClick={handleGoogleLogin} className="flex justify-center mx-auto mb-2 border-2 rounded-lg border-red-600 my-1">
                                <p className="flex gap-2 p-2  bg-white"><FcGoogle className="text-2xl "></FcGoogle> Google</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;