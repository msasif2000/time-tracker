import axios from "axios";


export const publicLink = axios.create({
    baseURL: 'http://localhost:5000',

})
const usePublicLink = () => {
    return publicLink;
};

export default usePublicLink;