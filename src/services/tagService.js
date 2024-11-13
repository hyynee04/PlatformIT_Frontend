import axios from "../utils/axiosCustomize";
const getAllTag = async () => {
    return await axios.get("api/Tag/GetAllTag");
};
export { getAllTag };
