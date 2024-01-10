import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import auth from "../../config_firebase";
import usePublicLink from "../Hooks/usePublicLink";
const googleProvider = new GoogleAuthProvider();
export const AuthContext = createContext(null);


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const publicLink = usePublicLink();
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const userLogin = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photo
        }).then(() => {
            // Profile updated!
            // ...
        }).catch(() => {
            // An error occurred
            // ...
        });
    }
    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const userLogout = () => {
        setLoading(true);
        return signOut(auth);
    }
    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                //get token

                const userInfo = { email: currentUser.email };
                publicLink.post('/jwt', userInfo)
                    .then(res => {
                        if (res.data.token) {
                            localStorage.setItem('token', res.data.token);
                        }
                    })
                setUser(currentUser);
                setLoading(false);
            }
            else {
                localStorage.removeItem('token');
                setUser(null);
                setLoading(false);
            }
        })
        return () => unsubscribed;
    }, [publicLink])
    const authInfo = {
        user,
        loading,
        createUser,
        userLogin,
        googleLogin,
        userLogout,
        updateUserProfile
    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;